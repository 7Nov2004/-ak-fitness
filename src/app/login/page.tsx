"use client";

import { useState, useEffect } from "react";
import { Dumbbell, Loader2, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export default function Login() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Email form state
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // Phone form state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/profile");
      else setAuthChecking(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (authMethod === "phone" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  }, [authMethod]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success("Welcome back to the squad!");
        router.push("/shop");
      } else {
        if (!formData.name) return toast.error("Please enter your full name");
        const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(cred.user, { displayName: formData.name });
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString(),
          orders: [],
          address: {}
        });
        toast.success("Account created successfully!");
        router.push("/shop");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      return toast.error("Enter a valid phone number with country code (e.g. +91...)");
    }
    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      console.error("Firebase Phone Auth Error:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) return toast.error("Enter the OTP");
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      
      // Save phone user to db if first time
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || "User",
        phone: user.phoneNumber,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      toast.success("Phone verified successfully!");
      router.push("/shop");
    } catch (error: any) {
      console.error(error);
      toast.error("Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save user to db if first time
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || "User",
        email: user.email,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      toast.success("Google Sign-In successful!");
      router.push("/shop");
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-neon-green" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pb-24 flex items-center justify-center p-4 pt-24">
      <div className="bg-zinc-900 border border-zinc-800 p-8 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-neon-green glow-green"></div>
        <div id="recaptcha-container"></div>
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <Dumbbell className="text-neon-green group-hover:rotate-12 transition-transform" size={32} />
            <span className="font-black text-3xl tracking-tighter uppercase text-white">
              A.K <span className="text-neon-red">FITNESS</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black uppercase text-white mb-2">
            {isLogin ? "Welcome Back" : "Join the Squad"}
          </h1>
          <p className="text-zinc-400 text-sm">Access your orders and exclusive deals.</p>
        </div>

        <div className="mb-6">
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white text-black font-black uppercase tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            Sign in with Google
          </button>
          
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-zinc-800"></div>
            <span className="px-3 text-zinc-500 text-xs font-bold uppercase">Or continue with</span>
            <div className="flex-1 border-t border-zinc-800"></div>
          </div>
        </div>

        {/* Auth Method Toggle */}
        <div className="flex bg-black p-1 rounded-md mb-6">
          <button 
            onClick={() => { setAuthMethod("email"); setOtpSent(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold uppercase transition-colors ${authMethod === "email" ? "bg-zinc-800 text-neon-green" : "text-zinc-500 hover:text-white"}`}
          >
            <Mail size={16} /> Email
          </button>
          <button 
            onClick={() => { setAuthMethod("phone"); setIsLogin(true); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold uppercase transition-colors ${authMethod === "phone" ? "bg-zinc-800 text-neon-green" : "text-zinc-500 hover:text-white"}`}
          >
            <Phone size={16} /> Phone
          </button>
        </div>

        {authMethod === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {!isLogin && (
              <input 
                type="text" 
                placeholder="FULL NAME"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 text-sm font-bold focus:outline-none focus:border-neon-green"
              />
            )}
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 text-sm font-bold focus:outline-none focus:border-neon-green"
            />
            <input 
              type="password" 
              placeholder="PASSWORD"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 text-sm font-bold focus:outline-none focus:border-neon-green"
            />
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-neon-green text-black font-black uppercase tracking-widest py-4 hover:bg-white transition-colors mt-4"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : (isLogin ? "Log In" : "Sign Up")}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {!otpSent ? (
              <>
                <input 
                  type="tel" 
                  placeholder="PHONE NUMBER (+91...)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 text-sm font-bold focus:outline-none focus:border-neon-green"
                />
                <button 
                  onClick={sendOTP}
                  disabled={loading}
                  className="w-full bg-neon-green text-black font-black uppercase tracking-widest py-4 hover:bg-white transition-colors mt-4"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <p className="text-zinc-400 text-sm text-center">OTP sent to {phoneNumber}</p>
                <input 
                  type="text" 
                  placeholder="ENTER OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 text-sm font-bold focus:outline-none focus:border-neon-green text-center tracking-widest text-xl"
                />
                <button 
                  onClick={verifyOTP}
                  disabled={loading}
                  className="w-full bg-neon-green text-black font-black uppercase tracking-widest py-4 hover:bg-white transition-colors mt-4"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Verify & Login"}
                </button>
                <button 
                  onClick={() => setOtpSent(false)}
                  className="w-full text-zinc-500 text-sm font-bold hover:text-white uppercase py-2"
                >
                  Change Number
                </button>
              </>
            )}
          </div>
        )}

        {authMethod === "email" && (
          <div className="mt-8 text-center border-t border-zinc-800 pt-6">
            <p className="text-zinc-400 text-sm font-bold">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)} 
                className="text-neon-green font-black uppercase hover:underline ml-1"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
