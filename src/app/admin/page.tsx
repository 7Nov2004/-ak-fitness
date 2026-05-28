"use client";

import { useEffect, useState } from "react";
import { Users, DollarSign, Package, ShoppingBag, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        toast.success("Product deleted successfully");
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleToggleStock = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "products", id), {
        inStock: !currentStatus
      });
      setProducts(products.map(p => p.id === id ? { ...p, inStock: !currentStatus } : p));
      toast.success("Stock status updated");
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  const stats = [
    { name: 'Total Revenue', value: '₹45,231.89', icon: DollarSign, color: 'text-neon-green' },
    { name: 'Active Orders', value: '124', icon: ShoppingBag, color: 'text-blue-500' },
    { name: 'Total Customers', value: '8,439', icon: Users, color: 'text-purple-500' },
    { name: 'Products in Stock', value: products.length.toString(), icon: Package, color: 'text-neon-red' },
  ];

  return (
    <ProtectedRoute>
      <div className="bg-black min-h-screen pt-8 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black uppercase text-white mb-8 border-b border-zinc-800 pb-4">Admin Dashboard Demo</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 p-6 flex items-center gap-4">
                <div className={`p-4 bg-zinc-950 rounded-full ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm font-bold uppercase">{stat.name}</p>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Products Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase text-white">Product Inventory</h2>
              <Link href="/admin/add-product" className="bg-neon-green text-black px-4 py-2 text-sm font-bold uppercase hover:bg-white transition-colors">
                + Add Product
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950 text-zinc-400 uppercase font-bold text-xs">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-8 text-zinc-500">Loading products from database...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-zinc-500">No products found. Add one!</td></tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-contain bg-zinc-950 rounded" />
                        </td>
                        <td className="px-6 py-4 font-bold text-white">{product.name}</td>
                        <td className="px-6 py-4 text-neon-green">{product.category}</td>
                        <td className="px-6 py-4">₹{product.price}</td>
                        <td className="px-6 py-4">
                          {product.inStock 
                            ? <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs font-bold">In Stock</span>
                            : <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded text-xs font-bold">Out of Stock</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-right space-x-4">
                          <button 
                            onClick={() => handleToggleStock(product.id, product.inStock)}
                            className="bg-zinc-800 text-white hover:bg-zinc-700 px-3 py-1 rounded text-xs font-bold uppercase transition-colors"
                          >
                            Toggle Stock
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="text-zinc-400 hover:text-neon-red uppercase text-xs font-bold transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
