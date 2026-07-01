"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface PersonalitySliderProps {
  labelLeft: string;
  labelRight: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
}

export function PersonalitySlider({
  labelLeft,
  labelRight,
  value,
  onChange,
  description,
}: PersonalitySliderProps) {
  return (
    <div className="space-y-4 glass p-6 rounded-2xl border-white/5">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-bold tracking-tight transition-all ${value < 40 ? 'text-primary scale-110' : 'text-muted-foreground'}`}>
          {labelLeft}
        </span>
        <span className={`text-sm font-bold tracking-tight transition-all ${value > 60 ? 'text-primary scale-110' : 'text-muted-foreground'}`}>
          {labelRight}
        </span>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        max={100}
        step={1}
        className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
      />
      
      {description && (
        <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground/50 pt-2 font-bold">
          {description}
        </p>
      )}
    </div>
  );
}
