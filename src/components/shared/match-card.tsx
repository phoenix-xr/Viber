
"use client";

import { motion } from "framer-motion";
import { CompatibilityRing } from "@/components/ui/compatibility-ring";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MapPin, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { mockDb, useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

interface Match {
  id: string;
  name: string;
  age: number;
  city: string;
  compatibilityScore: number;
  interests: string[];
  imageUrl: string;
}

export function MatchCard({ match }: { match: Match }) {
  const { user } = useUser();
  const { toast } = useToast();

  const handleAction = (type: 'like' | 'pass' | 'save') => {
    if (!user) {
      toast({ title: "Auth required", description: "Please log in to interact." });
      return;
    }
    
    mockDb.add("interactions", {
      type,
      targetUserId: match.id,
      timestamp: new Date().toISOString()
    });

    toast({
      title: type.charAt(0).toUpperCase() + type.slice(1) + "d!",
      description: `You ${type}d ${match.name}.`,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass rounded-3xl border-white/5 overflow-hidden group h-full flex flex-col"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={match.imageUrl || "https://picsum.photos/seed/placeholder/500/700"}
          alt={match.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="absolute top-4 right-4">
          <CompatibilityRing score={match.compatibilityScore} size={50} />
        </div>

        <div className="absolute top-4 left-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full glass border-white/10 hover:bg-white/10"
            onClick={(e) => { e.preventDefault(); handleAction('save'); }}
          >
            <Bookmark className="w-4 h-4 text-white" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-headline font-bold text-2xl text-white">
                {match.name}, {match.age}
              </h3>
              <div className="flex items-center gap-1 text-white/70 text-sm">
                <MapPin className="w-3 h-3" />
                {match.city}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-6">
          {match.interests?.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="secondary" className="bg-white/5 border-none text-[10px] py-0 px-2 uppercase font-bold tracking-wider">
              {interest}
            </Badge>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl glass border-white/10 hover:bg-white/5 h-12"
            onClick={() => handleAction('pass')}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Link href={`/matches/${match.id}`} className="w-full">
            <Button 
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground group"
              onClick={() => handleAction('like')}
            >
              <Heart className="w-5 h-5 group-hover:fill-current transition-colors" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
