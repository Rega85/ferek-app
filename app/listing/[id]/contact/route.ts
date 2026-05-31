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
    return NextResponse.redirect(`${origin}/auth/login?next=/listing/${id}`, 303);
  }

  if (message.length < 2) {
    return NextResponse.redirect(`${origin}/listing/${id}`, 303);
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, user_id, status")
    .eq("id", id)
    .single();

  if (!listing || listing.status !== "active") {
    return NextResponse.redirect(`${origin}/listing/${id}`, 303);
  }

  if (listing.user_id === user.id) {
    return NextResponse.redirect(`${origin}/profile`, 303);
  }

  const { data: existingConversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("listing_id", id)
    .eq("buyer_id", user.id)
    .single();

  let conversationId = existingConversation?.id as string | undefined;

  if (!conversationId) {
    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        listing_id: id,
        buyer_id: user.id,
        seller_id: listing.user_id,
      })
      .select("id")
      .single();

    if (error || !conversation) {
      return NextResponse.redirect(`${origin}/listing/${id}`, 303);
    }

    conversationId = conversation.id;
  }

  await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: message,
  });

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  return NextResponse.redirect(`${origin}/chat/${conversationId}`, 303);
}
