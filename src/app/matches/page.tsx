"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { MatchCard } from "@/components/shared/match-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const DUMMY_MATCHES = [
  {
    id: "1",
    name: "Alex Rivers",
    age: 26,
    city: "San Francisco, CA",
    compatibilityScore: 92,
    interests: ["Coding", "Jazz", "Philosophy", "Photography"],
    imageUrl: "https://picsum.photos/seed/soul1/500/700",
  },
  {
    id: "2",
    name: "Jordan Smith",
    age: 24,
    city: "Brooklyn, NY",
    compatibilityScore: 88,
    interests: ["Vinyl", "Plants", "Art", "Startups"],
    imageUrl: "https://picsum.photos/seed/soul2/500/700",
  },
  {
    id: "3",
    name: "Elena Vance",
    age: 28,
    city: "Austin, TX",
    compatibilityScore: 81,
    interests: ["AI", "Gaming", "Fitness", "Nature"],
    imageUrl: "https://picsum.photos/seed/soul3/500/700",
  },
  {
    id: "4",
    name: "Marcus Chen",
    age: 25,
    city: "Chicago, IL",
    compatibilityScore: 75,
    interests: ["Cooking", "Movies", "Travel", "Books"],
    imageUrl: "https://picsum.photos/seed/soul4/500/700",
  },
  {
    id: "5",
    name: "Sofia Rossi",
    age: 27,
    city: "Los Angeles, CA",
    compatibilityScore: 94,
    interests: ["Design", "Fashion", "Art History", "Techno"],
    imageUrl: "https://picsum.photos/seed/soul5/500/700",
  },
  {
    id: "6",
    name: "Kai Nakamoto",
    age: 23,
    city: "Seattle, WA",
    compatibilityScore: 79,
    interests: ["Cycling", "Coffee", "Books", "Startups"],
    imageUrl: "https://picsum.photos/seed/soul6/500/700",
  },
];

export default function MatchesPage() {
  const [search, setSearch] = useState("");

  const filteredMatches = DUMMY_MATCHES.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32 px-4">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
            <Sparkles className="w-3 h-3" />
            <span>AI Powered Discovery</span>
          </div>
          <h1 className="font-headline text-4xl font-bold mb-4">Semantic Matches</h1>
          <p className="text-muted-foreground">Based on your Soul Vector, these individuals resonate most with your profile.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, city, or interests..." 
              className="pl-11 h-12 bg-white/5 border-white/10 rounded-xl focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 rounded-xl glass border-white/10 gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Sort by:</span>
            <select className="bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Compatibility Score</option>
              <option>Distance</option>
              <option>Recently Active</option>
            </select>
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </motion.div>

        {filteredMatches.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No matches found matching your search. Try broadening your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
