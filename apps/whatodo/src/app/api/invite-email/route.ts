import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { to, placeName, placeUrl, proposedDate, proposedTime, message, inviterNickname } = await req.json();

    if (!to || !placeName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (!resend) {
      return NextResponse.json({ success: false, error: "Email service not configured" }, { status: 503 });
    }

    const result = await resend.emails.send({
      from: "캐나다가자 <invites@whatodo.app>",
      to: [to],
      subject: `${inviterNickname}님이 "${placeName}"에 가자고 제안했어요! 🎉`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:16px;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#e85d26;font-size:24px;margin:0;">📅 캐나다가자 초대장</h1>
          </div>
          <div style="background:white;border-radius:12px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            <p style="font-size:16px;color:#334155;line-height:1.6;">
              <strong style="color:#1e3a5f;">${inviterNickname}</strong>님이
              <strong style="color:#e85d26;">"${placeName}"</strong>에 가자고 제안했어요!
            </p>
            <div style="background:#fff7ed;border-radius:8px;padding:12px 16px;margin:16px 0;">
              <p style="margin:0;color:#7c2d12;font-size:14px;">📆 <strong>${proposedDate}</strong> ${proposedTime}</p>
            </div>
            ${message ? `<p style="color:#64748b;font-style:italic;font-size:14px;">💬 "${message}"</p>` : ""}
            <div style="text-align:center;margin-top:24px;">
              <a href="${placeUrl}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#e85d26,#f5a623);color:white;text-decoration:none;border-radius:12px;font-weight:bold;font-size:16px;">앱에서 보기</a>
            </div>
          </div>
          <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">캐나다가자 — 워홀러를 위한 맞춤 핫플레이스</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
