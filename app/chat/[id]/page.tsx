import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AppNavbar from "@/components/AppNavbar";
import { createClient } from "@/utils/supabase/server";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type Conversation = {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing: {
    id: string;
    title: string;
    price: number;
    images: string[] | null;
  } | null;
  buyer: {
    full_name: string | null;
    email: string | null;
  } | null;
  seller: {
    full_name: string | null;
    email: string | null;
  } | null;
};

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?next=/chat/${id}`);

  const { data: conversationData, error } = await supabase
    .from("conversations")
    .select(`
      id,
      buyer_id,
      seller_id,
      listing:listings(id,title,price,images),
      buyer:users!conversations_buyer_id_fkey(full_name,email),
      seller:users!conversations_seller_id_fkey(full_name,email)
    `)
    .eq("id", id)
    .single();

  if (error || !conversationData) notFound();

  const conversation = conversationData as unknown as Conversation;
  if (conversation.buyer_id !== user.id && conversation.seller_id !== user.id) notFound();

  const { data: messagesData } = await supabase
    .from("messages")
    .select("id, sender_id, content, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  const messages = (messagesData ?? []) as Message[];
  const otherPerson = conversation.buyer_id === user.id ? conversation.seller : conversation.buyer;
  const image = conversation.listing?.images?.[0];

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/chat" className="text-sm font-bold text-gray-500 hover:text-black">
            Zpět na zprávy
          </Link>

          <section className="bg-white rounded-lg border border-gray-100 overflow-hidden mt-4">
            <header className="p-4 border-b border-gray-100 flex gap-4 items-center">
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/listing/${conversation.listing?.id}`} className="font-black text-lg text-gray-900 hover:underline truncate block">
                  {conversation.listing?.title ?? "Inzerát"}
                </Link>
                <p className="text-sm text-gray-500">
                  Konverzace s {otherPerson?.full_name || otherPerson?.email || "uživatelem"}
                </p>
              </div>
            </header>

            <div className="p-4 min-h-[420px] space-y-3 bg-gray-50">
              {messages.map((message) => {
                const mine = message.sender_id === user.id;
                return (
                  <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[78%] rounded-lg px-4 py-3 ${mine ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-900"}`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className={`text-[11px] mt-2 ${mine ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(message.created_at).toLocaleString("cs-CZ")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form action={`/chat/${id}/send`} method="post" className="p-4 border-t border-gray-100 flex gap-3">
              <input
                name="message"
                required
                minLength={1}
                maxLength={2000}
                placeholder="Napište zprávu..."
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
              />
              <button className="bg-[#CCFF00] text-black px-6 py-3 rounded-lg font-black hover:bg-lime-300 transition-colors">
                Odeslat
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
