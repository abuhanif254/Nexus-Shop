import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Search, Filter, Star } from "lucide-react";
import ProductActions from "@/components/admin/ProductActions";
import AddProductButton from "@/components/admin/AddProductButton";

export default async function AdminProductsPage() {
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));

  const totalProducts = allProducts.length;
  const lowStock = allProducts.filter(p => p.totalStock < 10).length;
  const outOfStock = allProducts.filter(p => p.totalStock === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products ({totalProducts})</h1>
        <AddProductButton />
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Products</h3>
          <p className="text-3xl font-black text-gray-900">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Low Stock (&lt; 10)</h3>
          <p className="text-3xl font-black text-yellow-600">{lowStock}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Out of Stock</h3>
          <p className="text-3xl font-black text-red-600">{outOfStock}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={18} /></span>
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-orange outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
              {allProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex flex-col items-center justify-center shrink-0 text-[10px] text-gray-400 overflow-hidden">
                        Img
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 max-w-[200px] truncate">{product.title}</p>
                        <p className="text-xs text-brand-orange uppercase font-bold tracking-wider mt-0.5">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {product.category}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</div>
                    {product.oldPrice && <div className="text-xs text-gray-400 line-through">${product.oldPrice.toFixed(2)}</div>}
                  </td>
                  <td className="p-4">
                    <div className={`text-sm font-bold ${product.totalStock === 0 ? 'text-red-500' : product.totalStock < 10 ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {product.totalStock}
                    </div>
                  </td>
                  <td className="p-4">
                    {product.featured ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                        <Star size={12} fill="currentColor" /> Featured
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <ProductActions product={product} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
