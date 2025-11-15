export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from 'next/server';
import { validateTelegramInitData } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  const { initData } = await req.json();
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken || !initData) {
    return Response.json({ valid: false }, { status: 400 });
  }

  const result = validateTelegramInitData(initData, botToken);
  return Response.json(result);
}
