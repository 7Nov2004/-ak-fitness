"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Whey Protein",
    price: "",
    originalPrice: "",
    flavors: "",
    sizes: "",
    description: "",
    inStock: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload image to Firebase Storage with a timeout
      const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      
      // Prevent infinite hang by wrapping in a Promise with timeout
      const uploadPromise = uploadBytes(imageRef, imageFile);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Storage Upload Timeout - Please check if Firebase Storage is enabled in Test Mode.")), 15000));
      
      const uploadResult = await Promise.race([uploadPromise, timeoutPromise]) as any;
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // Parse comma-separated flavors and sizes
      const flavorsArray = formData.flavors ? formData.flavors.split(',').map(s => s.trim()).filter(s => s !== "") : [];
      const sizesArray = formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s !== "") : [];

      // 2. Save product data to Firestore
      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        inStock: formData.inStock,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        image: imageUrl,
        rating: 5.0,
        reviews: 0,
        flavors: flavorsArray,
        sizes: sizesArray,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "products"), productData);
      
      toast.success("Product added successfully!");
      router.push("/admin");
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error(error.message || "Failed to add product. Check Firebase setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-black min-h-screen pt-8 pb-24">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-black uppercase text-white mb-8 border-b border-zinc-800 pb-4">
            Add New Product
          </h1>
          
          <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-6">
            
            <div>
              <label className="block text-zinc-400 text-sm font-bold uppercase mb-2">Product Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-zinc-400 text-sm font-bold uppercase mb-2">Category</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green transition-colors"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Whey Protein</option>
                  <option>Creatine</option>
                  <option>Pre Workout</option>
                  <option>Mass Gainer</option>
                  <option>Vitamins</option>
                  <option>Gym Accessories</option>
                </select>
              </div>
              
              <div>
                <label className="block text-zinc-400 text-sm font-bold uppercase mb-2">Stock Status</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green transition-colors"
                  value={formData.inStock ? "true" : "false"}
                  onChange={(e) => setFormData({...formData, inStock: e.target.value === "true"})}
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-zinc-400 text-sm font-bold uppercase mb-2">Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green transition-colors"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm font-bold uppercase mb-2">Original Price (₹) - Optional</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green transition-colors"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-zinc-400 text-sm font-bold uppercase mb-2">Flavors (Comma Separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Chocolate, Vanilla, Strawberry"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green transition-colors"
                  value={formData.flavors}
                  onChange={(e) => setFormData({...formData, flavors: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm font-bold uppercase mb-2">Sizes / Weights (Comma Separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1kg, 2kg, 4kg"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green transition-colors"
                  value={formData.sizes}
                  onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-sm font-bold uppercase mb-2">Product Image</label>
              <input 
                type="file" 
                accept="image/*"
                required
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 p-3 focus:outline-none focus:border-neon-green transition-colors"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-sm font-bold uppercase mb-2">Description</label>
              <textarea 
                required
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 focus:outline-none focus:border-neon-green transition-colors"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-neon-green text-black font-black uppercase tracking-tighter py-4 hover:bg-white transition-colors disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Save Product"}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
