import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 md:hidden">
      <div className="grid h-16 grid-cols-4">
        {[
          { href: "/", label: "Domů", icon: "⌂" },
          { href: "/mapa", label: "Mapa", icon: "□" },
          { href: "/chat", label: "Chat", icon: "○" },
          { href: "/profile", label: "Profil", icon: "♙" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center gap-0.5 text-xs font-semibold text-gray-500">
            <span className="text-2xl leading-none text-[#ff5a1f]">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
