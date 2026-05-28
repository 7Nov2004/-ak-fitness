"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { CreditCard, Truck, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Checkout() {
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const cartTotal = useStore((state) => state.cartTotal());
  const clearCart = useStore((state) => state.clearCart);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      router.push("/cart");
    }
  }, [cart.length, isSuccess, router]);

  if (cart.length === 0 && !isSuccess) {
    return null;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const orderData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      streetAddress: formData.get('streetAddress'),
      city: formData.get('city'),
      zipCode: formData.get('zipCode'),
      paymentMethod,
      total: cartTotal,
      items: cart
    };

    try {
      // Hit our Shiprocket API Route
      const response = await fetch('/api/shiprocket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderData })
      });

      const result = await response.json();

      if (!response.ok) {
        // We log the error but still place the order locally in a real app, 
        // for now we just show a toast message
        console.error("Shiprocket API Error:", result.error);
        toast.error("Order placed, but courier connection failed.");
      } else {
        toast.success("Order placed & Courier assigned! 🔥");
      }

      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] bg-black flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-neon-green mb-6"
        >
          <CheckCircle size={100} />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black uppercase italic text-white mb-4 text-center">
          Order <span className="text-neon-green text-glow-green">Confirmed</span>
        </h1>
        <p className="text-zinc-400 mb-8 text-center max-w-md">
          Your beast gear is being prepared. We'll send you an email with tracking details shortly.
        </p>
        <button 
          onClick={() => router.push("/shop")}
          className="bg-transparent border-2 border-neon-green text-neon-green font-black uppercase px-8 py-4 hover:bg-neon-green hover:text-black transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="bg-zinc-950 py-12 border-b border-zinc-900 mb-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-black uppercase italic text-white">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Shipping Address */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8">
              <h2 className="text-2xl font-black uppercase text-white mb-6 flex items-center gap-2">
                <Truck className="text-neon-red" /> Shipping Address
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-zinc-400">First Name</label>
                  <input name="firstName" required type="text" className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-zinc-400">Last Name</label>
                  <input name="lastName" required type="text" className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs uppercase font-bold text-zinc-400">Email Address</label>
                  <input name="email" required type="email" className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs uppercase font-bold text-zinc-400">Street Address</label>
                  <input name="streetAddress" required type="text" className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-zinc-400">City</label>
                  <input name="city" required type="text" className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-zinc-400">Postal / Zip Code</label>
                  <input name="zipCode" required type="text" className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8">
              <h2 className="text-2xl font-black uppercase text-white mb-6 flex items-center gap-2">
                <CreditCard className="text-neon-red" /> Payment Method
              </h2>
              
              <div className="space-y-4">
                <label className={`block border ${paymentMethod === 'razorpay' ? 'border-neon-green bg-neon-green/5' : 'border-zinc-800 bg-zinc-950'} p-4 cursor-pointer transition-colors`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="razorpay" 
                      checked={paymentMethod === 'razorpay'} 
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-neon-green"
                    />
                    <span className="font-bold text-white uppercase">Pay with Razorpay (Cards, UPI, NetBanking)</span>
                  </div>
                  {paymentMethod === 'razorpay' && (
                    <div className="mt-4 pl-7 text-sm text-zinc-400">
                      You will be redirected to Razorpay securely to complete your purchase.
                    </div>
                  )}
                </label>

                <label className={`block border ${paymentMethod === 'cod' ? 'border-neon-green bg-neon-green/5' : 'border-zinc-800 bg-zinc-950'} p-4 cursor-pointer transition-colors`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-neon-green"
                    />
                    <span className="font-bold text-white uppercase">Cash on Delivery</span>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-24">
            <h2 className="text-2xl font-black uppercase text-white mb-6 border-b border-zinc-800 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm max-h-60 overflow-y-auto pr-2">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="text-zinc-300 flex-grow">
                    <p className="font-bold text-white truncate">{item.name}</p>
                    <p className="text-zinc-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 text-zinc-300 border-t border-zinc-800 pt-4">
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
                <span className="text-3xl font-black text-white glow-text">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full bg-neon-green text-black font-black uppercase py-4 flex items-center justify-center gap-2 hover:bg-white transition-colors glow-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
