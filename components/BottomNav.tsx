'use client';

import { Home, PlusCircle, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
        }`}
    >
      <div className={`p-2 rounded-xl ${isActive ? 'bg-orange-50' : ''}`}>
        <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
};

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-6 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <NavItem href="/" icon={Home} label="Home" />
        <NavItem href="/create" icon={PlusCircle} label="Create" />
        <NavItem href="/play" icon={Gamepad2} label="Play" />
      </div>
    </nav>
  );
}
