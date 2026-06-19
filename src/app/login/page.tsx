"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Mail, Lock, Github, Chrome } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col pt-32 px-4">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-headline font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Log in to your soul vector</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="name@example.com" className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                <Link href="#" className="text-[10px] text-primary hover:underline font-bold uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl" />
              </div>
            </div>

            <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg mt-6 shadow-xl shadow-primary/20">
              Sign In
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-transparent px-4 text-muted-foreground">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 rounded-xl glass border-white/10 gap-2">
              <Chrome className="w-4 h-4" /> Google
            </Button>
            <Button variant="outline" className="h-12 rounded-xl glass border-white/10 gap-2">
              <Github className="w-4 h-4" /> Github
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
