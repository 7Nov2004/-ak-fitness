"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Dumbbell } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      router.push("/admin");
    } catch (error: any) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <Dumbbell className="text-neon-green mb-4" size={48} />
          <h1 className="text-2xl font-black uppercase text-white tracking-tighter">
            Admin <span className="text-neon-red">Access</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-zinc-400 text-sm font-bold uppercase mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@akfitness.com"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm font-bold uppercase mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-neon-green text-black font-black uppercase tracking-tighter py-4 hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
