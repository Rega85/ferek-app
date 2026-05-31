import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await request.formData();
  const message = String(formData.get("message") ?? "").trim();
  const supabase = await createClient();
  const origin = new URL(request.url).origin;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/login?next=/chat/${id}`, 303);
  }

  if (!message) {
    return NextResponse.redirect(`${origin}/chat/${id}`, 303);
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, buyer_id, seller_id")
    .eq("id", id)
    .single();

  if (!conversation || (conversation.buyer_id !== user.id && conversation.seller_id !== user.id)) {
    return NextResponse.redirect(`${origin}/chat`, 303);
  }

  await supabase.from("messages").insert({
    conversation_id: id,
    sender_id: user.id,
    content: message,
  });

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.redirect(`${origin}/chat/${id}`, 303);
}
