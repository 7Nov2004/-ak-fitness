"use client";

import { useState } from "react";
import { Package, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if(!orderId) return;
    setIsTracking(true);
  };

  return (
    <div className="bg-black min-h-screen pb-24 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-zinc-950 rounded-full mb-4">
            <Package size={32} className="text-neon-green" />
          </div>
          <h1 className="text-3xl font-black uppercase italic text-white mb-2">Track Your Order</h1>
          <p className="text-zinc-400">Enter your order ID below to see the status of your shipment.</p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. FIT-123456"
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 font-bold focus:outline-none focus:border-neon-green text-center uppercase"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-neon-green text-black font-black uppercase py-4 flex items-center justify-center gap-2 hover:bg-white transition-colors"
          >
            <Search size={20} /> Track Now
          </button>
        </form>

        {isTracking && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-8 border-t border-zinc-800 text-center space-y-4"
          >
            <div className="inline-block px-4 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold uppercase text-sm rounded">
              In Transit
            </div>
            <p className="text-white font-bold text-lg">Your order is on the way!</p>
            <p className="text-zinc-400 text-sm">Expected delivery: Tomorrow by 8:00 PM</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
