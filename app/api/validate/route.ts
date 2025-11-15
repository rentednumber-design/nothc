// src/app/api/validate/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!initData || !botToken) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // Validate initData
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) return NextResponse.json({ valid: false });

    params.delete("hash");

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
    const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

    if (computedHash !== hash) return NextResponse.json({ valid: false });

    const userStr = params.get("user");
    if (!userStr) return NextResponse.json({ valid: false });

    const user = JSON.parse(decodeURIComponent(userStr));

    // Optional: reject if auth_date is older than 1 hour
    // const authDate = parseInt(params.get("auth_date") || "0", 10);
    // const now = Math.floor(Date.now() / 1000);
    // if (now - authDate > 3600) return NextResponse.json({ valid: false });

    return NextResponse.json({ valid: true, user });
  } catch (e) {
    console.error("Telegram validation error:", e);
    return NextResponse.json({ valid: false });
  }
}
