import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { inviteId } = await req.json();
    if (!inviteId) {
      return NextResponse.json({ success: false, error: "Missing inviteId" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 503 });
    }

    const edgeUrl = `${supabaseUrl}/functions/v1/notify-inviter`;

    const result = await fetch(edgeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ invite_id: inviteId }),
    });

    if (!result.ok) {
      const text = await result.text().catch(() => "Unknown error");
      console.warn("Edge Function call failed:", result.status, text);
      // Still return success - notification is best-effort
      return NextResponse.json({ success: true, notified: false, warning: text });
    }

    return NextResponse.json({ success: true, notified: true });
  } catch (err) {
    console.error("invite-accept API error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
