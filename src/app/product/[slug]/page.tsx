"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Truck, ArrowLeft, Heart, ShoppingCart, Share2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import ImageGallery from "@/components/product/ImageGallery";
import VariantSelector, { Variant } from "@/components/product/VariantSelector";
import ProductReviews from "@/components/product/ProductReviews";

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = use(params);
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart, toggleWishlist, wishlist } = useCartStore();
  
  // Format slug to readable title (mock data generation)
  const productTitle = unwrappedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Default variants just for UI demo since our DB doesn't support complex variants yet
  const colors = [
    { id: 'c1', name: 'Standard Edition', value: '#111827', type: 'color' as const },
  ];
  const sizes = [
    { id: 's1', name: 'Standard Size', value: 'Std', type: 'size' as const },
  ];

  const [selectedVariantColor, setSelectedVariantColor] = useState<Variant | null>(colors[0]);
  const [selectedVariantSize, setSelectedVariantSize] = useState<Variant | null>(sizes[0]);

  useEffect(() => {
    // Fetch from our new API route by searching through all (we should add a slug endpoint, but this works for demo)
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Find product by slug match
          const found = data.data.find((p: any) => p.title.toLowerCase().replace(/ /g, '-') === unwrappedParams.slug);
          setProduct(found);
        }
        setLoading(false);
      });
  }, [unwrappedParams.slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const currentPrice = product.price + (selectedVariantSize?.priceOffset || 0);
  const isWishlisted = wishlist.some(item => item.id === product.id);



  const handleVariantChange = (color: Variant | null, size: Variant | null) => {
    setSelectedVariantColor(color);
    setSelectedVariantSize(size);
  };

  const handleAddToCart = () => {
    if (product.totalStock === 0) return;
    
    // Check if adding this quantity exceeds stock
    if (quantity > product.totalStock) {
      alert(`Sorry, we only have ${product.totalStock} in stock.`);
      return;
    }

    const variantTitle = `${product.title} - ${selectedVariantColor?.name || ''} / ${selectedVariantSize?.value || ''}`;
    
    for(let i=0; i<quantity; i++) {
      addItemToCart({
        id: `${product.id}-${selectedVariantColor?.id}-${selectedVariantSize?.id}`,
        title: variantTitle,
        price: currentPrice,
        image: `/${product.image}.jpg`,
        brand: product.brand
      });
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      title: product.title,
      price: product.price,
      image: `/${product.image}.jpg`,
      brand: product.brand
    });
  };

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-12">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-xs md:text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-orange transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Back Button */}
        <Link href="#" onClick={(e) => { e.preventDefault(); window.history.back(); }} className="md:hidden flex items-center gap-2 text-gray-600 font-semibold mb-6">
          <ArrowLeft size={20} /> Back to previous
        </Link>

        {/* Main Product Area Split */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-1/2">
            <ImageGallery images={[`/${product.image}.jpg`, "/mock-product-2.jpg", "/mock-product-3.jpg"]} />
            
            {/* Mobile Floating Actions (Wishlist/Share) that were inside the old image container */}
            <div className="flex gap-3 md:hidden mt-4 justify-end">
                <button onClick={handleToggleWishlist} className={`w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-600'}`}>
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
                <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm text-gray-600">
                  <Share2 size={20} />
                </button>
            </div>
          </div>

          {/* Right: Product Details & Actions */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-24">
              <p className="text-brand-orange font-bold text-sm tracking-widest uppercase mb-2">{product.brand}</p>
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-4">{product.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                  <Star size={16} className="text-yellow-500" fill="currentColor" />
                  <span className="text-sm font-bold text-gray-800">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500 hover:text-brand-orange cursor-pointer transition-colors underline underline-offset-4">{product.reviews} Reviews</span>
                <span className="text-gray-300">|</span>
                {product.totalStock === 0 ? (
                  <span className="text-sm text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-200">Out of Stock</span>
                ) : product.totalStock < 10 ? (
                  <span className="text-sm text-yellow-600 font-semibold bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">Only {product.totalStock} left!</span>
                ) : (
                  <span className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">In Stock ({product.totalStock})</span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">${currentPrice.toFixed(2)}</h2>
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through mb-1">${product.oldPrice}</span>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded mb-2">-{product.discount}%</span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-8">
                Experience premium quality with this meticulously crafted {product.category.toLowerCase()}. Designed for durability and styled for modern aesthetics, it's the perfect addition to your daily routine. Features include high-grade materials, ergonomic design, and an industry-leading warranty.
              </p>

              <hr className="border-gray-100 mb-8" />

              {/* Variant Selectors */}
              <VariantSelector 
                colors={colors} 
                sizes={sizes} 
                onVariantChange={handleVariantChange} 
              />

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-4 mb-8">
                {/* Quantity */}
                <div className="flex items-center border-2 border-gray-100 rounded-full h-14 bg-gray-50">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-brand-orange transition-colors">
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-brand-orange transition-colors">
                    <Plus size={18} />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={product.totalStock === 0}
                  className={`flex-1 text-white h-14 rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-500/30 ${product.totalStock === 0 ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-brand-orange hover:bg-orange-600'}`}
                >
                  <ShoppingCart size={20} />
                  {product.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                <button onClick={handleToggleWishlist} className={`w-14 h-14 border-2 border-gray-100 rounded-full flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-colors ${isWishlisted ? 'text-red-500 border-red-500' : 'text-gray-600'}`}>
                   <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-start gap-3">
                  <Truck size={24} className="text-brand-orange shrink-0 mt-1" />
                  <div>
                    <h5 className="font-bold text-sm text-gray-800">Free Delivery</h5>
                    <p className="text-xs text-gray-500 mt-1">Enter your postal code for Delivery Availability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck size={24} className="text-brand-orange shrink-0 mt-1" />
                  <div>
                    <h5 className="font-bold text-sm text-gray-800">Return Delivery</h5>
                    <p className="text-xs text-gray-500 mt-1">Free 30 Days Delivery Returns.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Product Reviews Section */}
        <ProductReviews productId={product.id} />
      </div>

      {/* Mobile Fixed Add to Cart Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe flex gap-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col justify-center shrink-0">
          <span className="text-xs text-gray-500 font-medium">Total Price</span>
          <span className="text-xl font-black text-brand-dark">${(currentPrice * quantity).toFixed(2)}</span>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={product.totalStock === 0}
          className={`flex-1 text-white rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-500/30 active:scale-95 ${product.totalStock === 0 ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-brand-orange hover:bg-orange-600'}`}
        >
          <ShoppingCart size={20} />
          {product.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>

    </div>
  );
}
