"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { products } from "@/lib/data";
import { useStore } from "@/store/useStore";
import { ArrowLeft, Star, ShoppingCart, Zap, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const product = products.find((p) => p.id === id);
  const addToCart = useStore((state) => state.addToCart);

  const [selectedFlavor, setSelectedFlavor] = useState(product?.flavors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black uppercase mb-4 text-neon-red">Product Not Found</h1>
        <Link href="/shop" className="text-neon-green hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      selectedFlavor,
      selectedSize,
    });
    toast.success(`${quantity}x ${product.name} added to cart!`, {
      icon: '💪',
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/shop" className="inline-flex items-center gap-2 text-zinc-400 hover:text-neon-green transition-colors mb-8 uppercase text-sm font-bold">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg flex items-center justify-center relative h-[500px]">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              className="object-contain p-8 drop-shadow-2xl" 
            />
            {product.originalPrice && (
              <div className="absolute top-4 left-4 bg-neon-red text-white font-bold px-3 py-1 uppercase text-sm">
                Sale
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2 text-neon-green font-bold uppercase text-sm">{product.category}</div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-zinc-600" : ""} />
                ))}
              </div>
              <span className="text-zinc-400 text-sm">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-zinc-800">
              <span className="text-4xl font-black text-white">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-zinc-500 line-through font-bold mb-1">₹{product.originalPrice}</span>
              )}
            </div>

            {/* Selectors */}
            <div className="space-y-6 mb-8">
              {product.flavors.length > 0 && (
                <div>
                  <h3 className="text-white font-bold uppercase mb-3 text-sm">Flavor: <span className="text-neon-green">{selectedFlavor}</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map(flavor => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-4 py-2 border ${selectedFlavor === flavor ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'} font-bold text-sm transition-colors`}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes.length > 0 && (
                <div>
                  <h3 className="text-white font-bold uppercase mb-3 text-sm">Size: <span className="text-neon-green">{selectedSize}</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border ${selectedSize === size ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'} font-bold text-sm transition-colors`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                 <h3 className="text-white font-bold uppercase mb-3 text-sm">Quantity</h3>
                 <div className="flex items-center border border-zinc-700 w-fit">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-white hover:text-neon-green">-</button>
                    <span className="px-4 py-2 text-white font-bold border-x border-zinc-700">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-white hover:text-neon-green">+</button>
                 </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-transparent border-2 border-neon-green text-neon-green font-black uppercase py-4 flex items-center justify-center gap-2 hover:bg-neon-green hover:text-black transition-colors"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-neon-green text-black font-black uppercase py-4 flex items-center justify-center gap-2 hover:bg-white transition-colors glow-green"
              >
                <Zap size={20} /> Buy Now
              </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded flex items-center gap-4 text-sm text-zinc-300">
              <ShieldCheck className="text-neon-red shrink-0" size={24} />
              <p>100% Authentic Product. Free shipping on orders over $100. Hassle-free returns within 30 days.</p>
            </div>
          </div>
        </div>

        {/* Details & Nutrition */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-800 pt-16">
          <div>
            <h2 className="text-2xl font-black uppercase italic text-white mb-6 border-b border-zinc-800 pb-2">Description</h2>
            <p className="text-zinc-400 leading-relaxed">
              {product.description}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase italic text-white mb-6 border-b border-zinc-800 pb-2">Nutrition Facts</h2>
            <ul className="space-y-3">
              {product.nutritionFacts.map((fact, i) => (
                <li key={i} className="flex justify-between border-b border-zinc-800/50 pb-2 text-zinc-300">
                  <span>{fact.split(':')[0]}</span>
                  <span className="font-bold text-white">{fact.split(':')[1]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
