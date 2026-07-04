import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { invite_id } = await req.json();
    if (!invite_id) {
      return new Response(JSON.stringify({ error: "invite_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch invite with inviter profile
    const { data: invite } = await supabaseClient
      .from("invites")
      .select("*, inviter:profiles!inviter_id(nickname, email), invitee:profiles!invitee_id(nickname)")
      .eq("id", invite_id)
      .single();

    if (!invite || invite.status !== "accepted") {
      return new Response(JSON.stringify({ error: "Invite not found or not accepted" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const inviterEmail = (invite.inviter as any)?.email;
    const inviterNickname = (invite.inviter as any)?.nickname ?? "친구";
    const inviteeNickname = (invite.invitee as any)?.nickname ?? "친구";

    // Send email via Resend if API key exists
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey && inviterEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "캐나다가자 <invites@whatodo.app>",
          to: [inviterEmail],
          subject: `${inviteeNickname}님이 "${invite.place_name}" 초대를 수락했어요! 🎉`,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:16px;">
              <div style="background:white;border-radius:12px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                <h2 style="color:#22c55e;font-size:20px;margin:0 0 12px;">✅ 초대 수락!</h2>
                <p style="font-size:16px;color:#334155;line-height:1.6;">
                  <strong>${inviteeNickname}</strong>님이
                  <strong style="color:#e85d26;">"${invite.place_name}"</strong>에 가자는 제안을 수락했어요.
                </p>
                <div style="background:#fff7ed;border-radius:8px;padding:12px 16px;margin:16px 0;">
                  <p style="margin:0;color:#7c2d12;font-size:14px;">📆 ${new Date(invite.proposed_date).toLocaleDateString("ko-KR")}</p>
                </div>
                <div style="text-align:center;margin-top:24px;">
                  <a href="${Deno.env.get("APP_URL") ?? "https://whatodo-seven.vercel.app"}/friends" 
                     style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#e85d26,#f5a623);color:white;text-decoration:none;border-radius:12px;font-weight:bold;font-size:16px;">
                    앱에서 확인하기
                  </a>
                </div>
              </div>
            </div>
          `,
        }),
      });
    }

    // Insert notification record for in-app push
    await supabaseClient.from("notifications").insert({
      user_id: invite.inviter_id,
      type: "invite_accepted",
      title: "초대 수락! 🎉",
      body: `${inviteeNickname}님이 "${invite.place_name}" 초대를 수락했어요`,
      data: { invite_id: invite.id, place_name: invite.place_name },
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
