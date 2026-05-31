import Link from "next/link";
import { redirect } from "next/navigation";
import AppNavbar from "@/components/AppNavbar";
import { createClient } from "@/utils/supabase/server";

type ConversationRow = {
  id: string;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
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

type MessageRow = {
  conversation_id: string;
  content: string;
  created_at: string;
};

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/chat");

  const { data: conversationsData } = await supabase
    .from("conversations")
    .select(`
      id,
      buyer_id,
      seller_id,
      last_message_at,
      listing:listings(id,title,price,images),
      buyer:users!conversations_buyer_id_fkey(full_name,email),
      seller:users!conversations_seller_id_fkey(full_name,email)
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  const conversations = (conversationsData ?? []) as unknown as ConversationRow[];
  const conversationIds = conversations.map((conversation) => conversation.id);
  const { data: messagesData } = conversationIds.length
    ? await supabase
        .from("messages")
        .select("conversation_id, content, created_at")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const latestMessages = new Map<string, MessageRow>();
  for (const message of (messagesData ?? []) as MessageRow[]) {
    if (!latestMessages.has(message.conversation_id)) {
      latestMessages.set(message.conversation_id, message);
    }
  }

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Zprávy</h1>
              <p className="text-gray-500 text-sm mt-1">Bezpečná komunikace k inzerátům zůstává uvnitř Fereku.</p>
            </div>
            <Link href="/" className="hidden sm:block text-sm font-bold text-gray-600 hover:text-black">
              Zpět na bazar
            </Link>
          </div>

          {conversations.length === 0 ? (
            <div className="bg-white rounded-lg border border-dashed border-gray-300 p-10 text-center">
              <h2 className="text-xl font-black mb-2">Zatím žádné konverzace</h2>
              <p className="text-gray-500 mb-6">Jakmile napíšete prodejci nebo kupující vám napíše, objeví se to tady.</p>
              <Link href="/" className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold">
                Prohlížet inzeráty
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              {conversations.map((conversation) => {
                const otherPerson = conversation.buyer_id === user.id ? conversation.seller : conversation.buyer;
                const latest = latestMessages.get(conversation.id);
                const image = conversation.listing?.images?.[0];

                return (
                  <Link
                    key={conversation.id}
                    href={`/chat/${conversation.id}`}
                    className="flex gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <h2 className="font-black text-gray-900 truncate">{conversation.listing?.title ?? "Inzerát"}</h2>
                        <span className="text-xs text-gray-400 shrink-0">
                          {new Date(conversation.last_message_at).toLocaleDateString("cs-CZ")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {otherPerson?.full_name || otherPerson?.email || "Uživatel"}
                      </p>
                      <p className="text-sm text-gray-700 truncate mt-1">
                        {latest?.content ?? "Konverzace založena."}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
