import Link from "next/link";
import { Sparkles, Twitter, Github, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/50 backdrop-blur-sm py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">
              Soulmatter
            </span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-[240px]">
            The next generation of matchmaking, powered by high-dimensional embeddings.
          </p>
          <div className="flex gap-4">
            <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
            <Github className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
            <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="font-headline font-bold mb-4">Product</h4>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-foreground">Features</Link></li>
            <li><Link href="#" className="hover:text-foreground">How it works</Link></li>
            <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-bold mb-4">Company</h4>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-foreground">About</Link></li>
            <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
            <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-bold mb-4">Legal</h4>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
            <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
            <li><Link href="#" className="hover:text-foreground">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Soulmatter Inc. All rights reserved. Built for the future of connection.
      </div>
    </footer>
  );
}