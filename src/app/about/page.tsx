import Image from "next/image";
import { Dumbbell, ShieldCheck, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="bg-black min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-zinc-950 py-20 border-b border-zinc-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070')] bg-cover bg-center z-0"></div>
        <div className="relative z-20 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-6">
            About <span className="text-neon-red text-glow-red">A.K FITNESS</span>
          </h1>
          <p className="text-xl text-zinc-300 font-medium max-w-2xl mx-auto">
            We exist to fuel the relentless. For those who don't know the meaning of quit.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-black uppercase italic text-white mb-6">Our Mission</h2>
          <div className="h-1 w-24 bg-neon-green glow-green mb-8"></div>
          <p className="text-zinc-400 text-lg leading-relaxed mb-6">
            A.K FITNESS was born in the gym, for the gym. We got tired of supplements filled with proprietary blends, underdosed ingredients, and artificial junk.
          </p>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Our mission is simple: provide the most hardcore, scientifically dosed, and effective sports nutrition products on the market. Period.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <ShieldCheck className="text-neon-green mb-4" size={32} />
              <h3 className="text-white font-bold uppercase mb-2">100% Transparent</h3>
              <p className="text-zinc-500 text-sm">No proprietary blends. You know exactly what you're putting in your body.</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <Zap className="text-neon-red mb-4" size={32} />
              <h3 className="text-white font-bold uppercase mb-2">Clinical Doses</h3>
              <p className="text-zinc-500 text-sm">We use ingredients at doses backed by real scientific research.</p>
            </div>
          </div>
        </div>
        <div className="relative h-[600px] border border-zinc-800 p-2 bg-zinc-900">
          <Image 
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070" 
            alt="Workout" 
            fill 
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
