"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! Our team will get back to you shortly.", { icon: "🔥" });
  };

  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="bg-zinc-950 py-16 border-b border-zinc-900 mb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white mb-4">
            Contact <span className="text-neon-green text-glow-green">Us</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Got questions about our supplements, your order, or just want to talk gains? Hit us up.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-black uppercase text-white mb-8">Get In Touch</h2>
          
          <div className="space-y-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 text-neon-green">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold uppercase mb-1">HQ Address</h3>
                <p className="text-zinc-400">Hasanpur Luhari<br/>Shamli, Uttar Pradesh, India</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 text-neon-red">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold uppercase mb-1">Phone</h3>
                <p className="text-zinc-400">1-800-FIT-NESS</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 text-neon-green">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold uppercase mb-1">Email</h3>
                <p className="text-zinc-400">support@fitnesssupps.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8">
          <h2 className="text-2xl font-black uppercase text-white mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input required type="text" placeholder="FIRST NAME" className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 text-sm focus:outline-none focus:border-neon-green uppercase" />
              </div>
              <div>
                <input required type="text" placeholder="LAST NAME" className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 text-sm focus:outline-none focus:border-neon-green uppercase" />
              </div>
            </div>
            <div>
              <input required type="email" placeholder="EMAIL ADDRESS" className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 text-sm focus:outline-none focus:border-neon-green uppercase" />
            </div>
            <div>
              <textarea required placeholder="YOUR MESSAGE" rows={5} className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 text-sm focus:outline-none focus:border-neon-green uppercase"></textarea>
            </div>
            <button type="submit" className="w-full bg-neon-green text-black font-black uppercase py-4 hover:bg-white transition-colors glow-green">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
