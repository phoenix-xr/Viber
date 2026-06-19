
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, LogOut, MessageSquare } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUser();
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass px-6 py-3 rounded-full flex items-center justify-between shadow-2xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">
              Soulmatter
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/matches" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Matches</Link>
            {user && <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>}
            {user && <Link href="/saved" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Saved</Link>}
            {user && <Link href="/chats" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Chats
            </Link>}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-4 right-4 z-40"
          >
            <div className="glass p-6 rounded-2xl flex flex-col gap-4">
              <Link href="/matches" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Matches</Link>
              {user && <Link href="/dashboard" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Dashboard</Link>}
              {user && <Link href="/saved" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Saved</Link>}
              {user && <Link href="/chats" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Chats</Link>}
              <hr className="border-white/10" />
              <div className="flex flex-col gap-2 pt-2">
                {user ? (
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>Sign Out</Button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Log in</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-primary text-primary-foreground">Get Started</Button>
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
