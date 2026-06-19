
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, LogOut, MessageSquare, Heart, Bookmark, LayoutDashboard, Globe, Map as MapIcon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Globe },
    { name: "Matches", href: "/matches", icon: Heart },
    { name: "Map", href: "/map", icon: MapIcon },
    { name: "Dashboard", href: "/dashboard", auth: true, icon: LayoutDashboard },
    { name: "Saved", href: "/saved", auth: true, icon: Bookmark },
    { name: "Chats", href: "/chats", auth: true, icon: MessageSquare },
  ];

  const filteredLinks = navLinks.filter(link => !link.auth || (link.auth && user));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass px-8 py-4 rounded-3xl flex items-center justify-between shadow-2xl border-white/10 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight">
              Soulmatter
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {filteredLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-primary flex items-center gap-2 ${
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 font-bold uppercase tracking-widest text-[10px] h-10 px-4 rounded-xl border border-white/5 hover:bg-white/5">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost" className="font-bold uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 h-10 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="lg:hidden absolute top-28 left-4 right-4 z-40"
          >
            <div className="glass p-8 rounded-3xl flex flex-col gap-6 border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
              {filteredLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-xl font-headline font-bold flex items-center justify-between ${
                    pathname === link.href ? 'text-primary' : 'text-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  {link.icon && <link.icon className={`w-5 h-5 ${pathname === link.href ? 'text-primary' : 'text-muted-foreground'}`} />}
                </Link>
              ))}
              <hr className="border-white/5" />
              <div className="flex flex-col gap-4">
                {user ? (
                  <Button variant="outline" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs border-white/10" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs border-white/10">Log in</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
