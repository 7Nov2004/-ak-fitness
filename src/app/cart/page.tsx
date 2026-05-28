"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { Trash2, ArrowRight, ShieldCheck } from "lucide-react";

export default function Cart() {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const cartTotal = useStore((state) => state.cartTotal());

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black uppercase italic text-white mb-6">Your Cart is Empty</h1>
        <p className="text-zinc-400 mb-8 text-center max-w-md">Looks like you haven't added any premium gear to your cart yet.</p>
        <Link 
          href="/shop" 
          className="bg-neon-green text-black font-black uppercase px-8 py-4 flex items-center gap-2 hover:bg-white transition-colors glow-green"
        >
          Start Shopping <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="bg-zinc-950 py-12 border-b border-zinc-900 mb-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-black uppercase italic text-white">Your Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <div className="space-y-6">
            {cart.map((item, idx) => (
              <div key={`${item.id}-${item.selectedFlavor}-${item.selectedSize}-${idx}`} className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 relative group">
                <button 
                  onClick={() => removeFromCart(item.id, item.selectedFlavor, item.selectedSize)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-neon-red transition-colors"
                >
                  <Trash2 size={20} />
                </button>
                
                <div className="relative w-32 h-32 shrink-0 bg-black border border-zinc-800 p-2">
                  <Image src={item.image} alt={item.name} fill className="object-contain" />
                </div>
                
                <div className="flex-grow text-center md:text-left">
                  <span className="text-xs font-bold text-neon-green uppercase mb-1 block">{item.category}</span>
                  <Link href={`/product/${item.id}`} className="text-xl font-bold text-white hover:text-neon-green transition-colors line-clamp-1 mb-2">
                    {item.name}
                  </Link>
                  <div className="text-sm text-zinc-400 space-x-4 mb-4">
                    {item.selectedFlavor && <span>Flavor: <span className="text-white">{item.selectedFlavor}</span></span>}
                    {item.selectedSize && <span>Size: <span className="text-white">{item.selectedSize}</span></span>}
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-6">
                    <div className="flex items-center border border-zinc-700 w-fit">
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedFlavor, item.selectedSize, Math.max(1, item.quantity - 1))} 
                        className="px-3 py-1 text-white hover:text-neon-green"
                      >-</button>
                      <span className="px-3 py-1 text-white font-bold border-x border-zinc-700 text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedFlavor, item.selectedSize, item.quantity + 1)} 
                        className="px-3 py-1 text-white hover:text-neon-green"
                      >+</button>
                    </div>
                    <span className="text-xl font-black text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-24">
            <h2 className="text-2xl font-black uppercase text-white mb-6 border-b border-zinc-800 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-neon-green">FREE</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-4 mt-4">
                <span className="text-xl font-black text-white">Total</span>
                <span className="text-3xl font-black text-white">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link 
              href="/checkout"
              className="w-full bg-neon-green text-black font-black uppercase py-4 flex items-center justify-center gap-2 hover:bg-white transition-colors glow-green mb-4"
            >
              Proceed to Checkout
            </Link>
            
            <div className="flex items-start gap-3 text-xs text-zinc-500 mt-6">
              <ShieldCheck className="text-zinc-400 shrink-0" size={16} />
              <p>Secure SSL checkout. Your information is protected.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
