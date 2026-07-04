"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Message, Profile } from "@/lib/database.types";

export function useRealtimeChat(myId: string | undefined, friendId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [friendProfile, setFriendProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const pendingIdRef = useRef(0);

  const loadMessages = useCallback(async () => {
    if (!myId || !friendId) return;
    const { data } = await (supabase.from("messages") as any)
      .select("*")
      .or(`sender_id.eq.${myId},receiver_id.eq.${myId}`)
      .or(`sender_id.eq.${friendId},receiver_id.eq.${friendId}`)
      .order("created_at", { ascending: true });

    const filtered = ((data ?? []) as Message[]).filter(
      (m) =>
        (m.sender_id === myId && m.receiver_id === friendId) ||
        (m.sender_id === friendId && m.receiver_id === myId)
    );
    setMessages(filtered);

    // Mark unread messages as read
    const unreadIds = filtered
      .filter((m) => m.receiver_id === myId && !m.read)
      .map((m) => m.id);
    if (unreadIds.length > 0) {
      await (supabase.from("messages") as any)
        .update({ read: true })
        .in("id", unreadIds);
    }
  }, [myId, friendId]);

  const loadFriendProfile = useCallback(async () => {
    if (!friendId) return;
    const { data } = await (supabase.from("profiles") as any)
      .select("*")
      .eq("id", friendId)
      .single();
    setFriendProfile((data as unknown) as Profile);
  }, [friendId]);

  useEffect(() => {
    if (!myId || !friendId) {
      setLoading(false);
      return;
    }

    Promise.all([loadMessages(), loadFriendProfile()]).then(() =>
      setLoading(false)
    );

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`chat-${[myId, friendId].sort().join("-")}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === myId && newMsg.receiver_id === friendId) ||
            (newMsg.sender_id === friendId && newMsg.receiver_id === myId)
          ) {
            setMessages((prev) => {
              // Deduplicate: if already exists, skip
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            // Remove matching pending message (same content from me)
            setPendingMessages((prev) =>
              prev.filter(
                (p) =>
                  !(
                    p.sender_id === newMsg.sender_id &&
                    p.receiver_id === newMsg.receiver_id &&
                    p.content === newMsg.content &&
                    p.image_url === newMsg.image_url
                  )
              )
            );
            // Auto-mark as read if received
            if (newMsg.receiver_id === myId) {
              (supabase.from("messages") as any)
                .update({ read: true })
                .eq("id", newMsg.id)
                .then(() => {});
            }
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myId, friendId, loadMessages, loadFriendProfile]);

  const sendMessage = useCallback(
    async (content: string, imageUrl?: string) => {
      if (!myId || !friendId) return;
      if (!content.trim() && !imageUrl) return;
      const pendingId = `pending-${pendingIdRef.current++}`;
      const optimistic: Message = {
        id: pendingId,
        sender_id: myId,
        receiver_id: friendId,
        content: content.trim() || "",
        image_url: imageUrl || null,
        audio_url: null,
        read: true,
        created_at: new Date().toISOString(),
      };
      setPendingMessages((prev) => [...prev, optimistic]);
      try {
        await (supabase.from("messages") as any).insert({
          sender_id: myId,
          receiver_id: friendId,
          content: content.trim() || "",
          image_url: imageUrl || null,
        });
      } catch {
        // Remove optimistic message on error
        setPendingMessages((prev) => prev.filter((m) => m.id !== pendingId));
        throw new Error("메시지 전송에 실패했어요");
      }
    },
    [myId, friendId]
  );

  const sendImageMessage = useCallback(
    async (file: File) => {
      if (!myId || !friendId) return;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error } = await supabase.storage
        .from("chat-images")
        .upload(fileName, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("chat-images").getPublicUrl(fileName);
      await sendMessage("", data.publicUrl);
    },
    [myId, friendId, sendMessage]
  );

  const sendVoiceMessage = useCallback(
    async (blob: Blob) => {
      if (!myId || !friendId) return;
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.webm`;
      const { error } = await supabase.storage
        .from("chat-audio")
        .upload(fileName, blob, { upsert: false, contentType: "audio/webm" });
      if (error) throw error;
      const { data } = supabase.storage.from("chat-audio").getPublicUrl(fileName);
      await (supabase.from("messages") as any).insert({
        sender_id: myId,
        receiver_id: friendId,
        content: "",
        audio_url: data.publicUrl,
      });
    },
    [myId, friendId]
  );

  const allMessages = [...messages, ...pendingMessages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return { messages: allMessages, friendProfile, loading, sendMessage, sendImageMessage, sendVoiceMessage };
}
