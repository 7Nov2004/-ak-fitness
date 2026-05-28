"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Search, User, Menu, X, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cart = useStore((state) => state.cart);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-md border-b border-zinc-800" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Dumbbell className="text-neon-green group-hover:rotate-12 transition-transform duration-300" size={32} />
            <span className="font-bold text-2xl tracking-tighter uppercase">
              A.K <span className="text-neon-red">FITNESS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm uppercase font-semibold text-gray-300 hover:text-neon-green transition-colors hover:text-glow-green"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="hidden md:flex items-center gap-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <Link href="/cart" className="relative text-gray-300 hover:text-neon-green transition-colors group">
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-neon-red text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center glow-red">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link href="/login" className="text-gray-300 hover:text-neon-green transition-colors">
              <User size={20} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-b border-zinc-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg uppercase font-semibold text-gray-300 hover:text-neon-green transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex gap-6 pt-4 border-t border-zinc-800">
                <Link href="/cart" className="relative flex items-center gap-2 text-gray-300 hover:text-neon-green">
                  <ShoppingCart size={24} />
                  <span className="uppercase font-semibold">Cart ({cartItemCount})</span>
                </Link>
                <Link href="/login" className="flex items-center gap-2 text-gray-300 hover:text-neon-green">
                  <User size={24} />
                  <span className="uppercase font-semibold">Account</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
