
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Mail, Lock, Chrome } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockUser = {
        uid: "user_" + Math.random().toString(36).substr(2, 5),
        email,
        name: email.split('@')[0],
      };
      login(mockUser);
      toast({
        title: "Welcome back!",
        description: "Successfully logged into your soul vector.",
      });
      router.push("/dashboard");
    }, 1000);
  };

  const handleSocialLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const mockUser = {
        uid: "user_google_" + Math.random().toString(36).substr(2, 5),
        email: "google.user@example.com",
        name: "Google Explorer",
      };
      login(mockUser);
      router.push("/onboarding");
    }, 800);
  };

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

          <form className="space-y-4" onSubmit={handleEmailLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                <Link href="#" className="text-[10px] text-primary hover:underline font-bold uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg mt-6 shadow-xl shadow-primary/20"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-transparent px-4 text-muted-foreground">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" className="h-12 rounded-xl glass border-white/10 gap-2" onClick={handleSocialLogin}>
              <Chrome className="w-4 h-4" /> Google
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
