import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Dumbbell className="text-neon-green" size={28} />
              <span className="font-bold text-2xl tracking-tighter uppercase">
                A.K <span className="text-neon-red">FITNESS</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm">
              Premium fitness supplements for serious athletes. 100% authentic, scientifically backed formulas to help you crush your goals.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-zinc-400 hover:text-neon-green text-xs font-bold uppercase transition-colors">Instagram</a>
              <a href="#" className="text-zinc-400 hover:text-neon-green text-xs font-bold uppercase transition-colors">Youtube</a>
              <a href="#" className="text-zinc-400 hover:text-neon-green text-xs font-bold uppercase transition-colors">Facebook</a>
              <a href="#" className="text-zinc-400 hover:text-neon-green text-xs font-bold uppercase transition-colors">Twitter</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-zinc-400 hover:text-neon-green text-sm uppercase">Shop All</Link></li>
              <li><Link href="/about" className="text-zinc-400 hover:text-neon-green text-sm uppercase">About Us</Link></li>
              <li><Link href="/contact" className="text-zinc-400 hover:text-neon-green text-sm uppercase">Contact</Link></li>
              <li><Link href="/track-order" className="text-zinc-400 hover:text-neon-green text-sm uppercase">Track Order</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-4 text-white">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/shop?category=whey" className="text-zinc-400 hover:text-neon-green text-sm uppercase">Whey Protein</Link></li>
              <li><Link href="/shop?category=preworkout" className="text-zinc-400 hover:text-neon-green text-sm uppercase">Pre Workout</Link></li>
              <li><Link href="/shop?category=creatine" className="text-zinc-400 hover:text-neon-green text-sm uppercase">Creatine</Link></li>
              <li><Link href="/shop?category=accessories" className="text-zinc-400 hover:text-neon-green text-sm uppercase">Accessories</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-4 text-white">Stay Aggressive</h3>
            <p className="text-zinc-400 text-sm mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL" 
                className="bg-zinc-900 border border-zinc-800 text-white px-4 py-2 w-full focus:outline-none focus:border-neon-green text-sm"
              />
              <button 
                type="button" 
                className="bg-neon-green text-black font-bold px-4 py-2 hover:bg-white transition-colors"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs">
            &copy; {new Date().getFullYear()} A.K FITNESS Supplements. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-zinc-500 text-xs uppercase hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="text-zinc-500 text-xs uppercase hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
