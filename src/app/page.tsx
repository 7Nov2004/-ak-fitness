"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products, categories } from "@/lib/data";
import { ArrowRight, ShieldCheck, Zap, Truck, Star } from "lucide-react";

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        {/* We can use a generic workout background image from unsplash here */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat"
        ></div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 text-glow-green"
          >
            Unleash Your <span className="text-neon-red text-glow-red">Beast</span> Mode
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 font-medium mb-10 max-w-3xl mx-auto"
          >
            Premium, science-backed fitness supplements engineered for serious athletes who demand serious results.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              href="/shop" 
              className="bg-neon-green text-black font-black uppercase px-10 py-5 rounded-none text-xl hover:bg-white transition-all glow-green inline-flex items-center gap-3"
            >
              Shop Now <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-neon-red text-white py-4 relative z-30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-around items-center gap-4 text-center font-bold uppercase tracking-wider text-sm md:text-base">
          <div className="flex items-center gap-2"><ShieldCheck size={24} /> 100% Authentic Supplements</div>
          <div className="flex items-center gap-2"><Zap size={24} /> Fast Results</div>
          <div className="flex items-center gap-2"><Truck size={24} /> Free Shipping Over ₹100</div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black uppercase italic text-white mb-2">Featured Gear</h2>
              <div className="h-1 w-24 bg-neon-green glow-green"></div>
            </div>
            <Link href="/shop" className="text-neon-green uppercase font-bold hover:text-white transition-colors flex items-center gap-1">
              View All <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 p-6 group hover:border-neon-green transition-colors relative"
              >
                <Link href={`/product/${product.id}`} className="block relative h-64 mb-6">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-contain group-hover:scale-110 transition-transform duration-500" 
                  />
                </Link>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-neon-green uppercase">{product.category}</span>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                    <Star size={16} fill="currentColor" /> {product.rating}
                  </div>
                </div>
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-green transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl font-black text-white">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-zinc-500 line-through font-bold">₹{product.originalPrice}</span>
                  )}
                </div>
                <Link 
                  href={`/product/${product.id}`}
                  className="w-full block text-center bg-transparent border-2 border-neon-green text-neon-green font-bold uppercase py-3 hover:bg-neon-green hover:text-black transition-colors"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black uppercase italic text-white mb-12">Shop by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link 
                  href={`/shop?category=${category.toLowerCase().replace(" ", "")}`}
                  className="bg-zinc-900 border border-zinc-800 text-white font-bold uppercase px-8 py-4 block hover:border-neon-red hover:text-neon-red transition-colors"
                >
                  {category}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
