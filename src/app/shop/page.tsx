"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { products, categories } from "@/lib/data";
import { Star, Filter } from "lucide-react";

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-black min-h-screen pb-24">
      {/* Header */}
      <div className="bg-zinc-950 py-16 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white mb-4">
            Shop <span className="text-neon-green text-glow-green">All</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Browse our full collection of premium fitness supplements designed to elevate your performance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-24">
            <h3 className="text-white font-bold uppercase flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800">
              <Filter size={20} className="text-neon-red" /> Filters
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => setSelectedCategory("All")}
                className={`block w-full text-left text-sm uppercase font-bold transition-colors ${selectedCategory === "All" ? "text-neon-green" : "text-zinc-400 hover:text-white"}`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left text-sm uppercase font-bold transition-colors ${selectedCategory === cat ? "text-neon-green" : "text-zinc-400 hover:text-white"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-zinc-900 border border-zinc-800 p-6 group hover:border-neon-red transition-colors relative flex flex-col"
              >
                <Link href={`/product/${product.id}`} className="block relative h-56 mb-6">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-contain group-hover:scale-110 transition-transform duration-500" 
                  />
                </Link>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-neon-red uppercase">{product.category}</span>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                    <Star size={16} fill="currentColor" /> {product.rating}
                  </div>
                </div>
                <Link href={`/product/${product.id}`} className="flex-grow">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-red transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 mb-6 mt-4">
                  <span className="text-2xl font-black text-white">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-zinc-500 line-through font-bold">₹{product.originalPrice}</span>
                  )}
                </div>
                <Link 
                  href={`/product/${product.id}`}
                  className="w-full block text-center bg-transparent border-2 border-neon-red text-neon-red font-bold uppercase py-3 hover:bg-neon-red hover:text-black transition-colors"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-24 text-zinc-500 uppercase font-bold">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
