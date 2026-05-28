"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Loader2, LogOut, Package, User } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // Basic fallback if no db document exists yet (e.g. admin user)
            setUserData({ name: user.displayName || "Admin/User", email: user.email, phone: user.phoneNumber });
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-neon-green" size={48} />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-black min-h-screen pb-24 pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-2">
                My <span className="text-neon-green text-glow-green">Profile</span>
              </h1>
              <p className="text-zinc-400">Manage your account and view orders.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-neon-red px-6 py-3 font-bold uppercase hover:bg-neon-red hover:text-black transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg text-center">
                <div className="w-24 h-24 bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center text-neon-green">
                  <User size={48} />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{userData?.name || "Fitness Athlete"}</h2>
                <p className="text-zinc-400 text-sm mb-4">{userData?.email || userData?.phone}</p>
                <div className="inline-block bg-zinc-950 px-4 py-2 border border-neon-green text-neon-green text-xs font-bold uppercase">
                  Active Member
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
                  <Package className="text-neon-green" /> Recent Orders
                </h3>
                <div className="text-center py-12">
                  <p className="text-zinc-500 font-bold uppercase">No orders found.</p>
                  <button 
                    onClick={() => router.push('/shop')}
                    className="mt-6 border-2 border-neon-green text-neon-green px-8 py-3 font-bold uppercase hover:bg-neon-green hover:text-black transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
