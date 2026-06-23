"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export interface Variant {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'size';
  priceOffset?: number; // E.g., +$20 for XL size
  stock?: number; // Added to handle variation-level stock
}

interface VariantSelectorProps {
  colors: Variant[];
  sizes: Variant[];
  onVariantChange: (color: Variant | null, size: Variant | null) => void;
}

export default function VariantSelector({ colors, sizes, onVariantChange }: VariantSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<Variant | null>(colors[0] || null);
  const [selectedSize, setSelectedSize] = useState<Variant | null>(sizes[0] || null);

  const handleColorChange = (color: Variant) => {
    setSelectedColor(color);
    onVariantChange(color, selectedSize);
  };

  const handleSizeChange = (size: Variant) => {
    setSelectedSize(size);
    onVariantChange(selectedColor, size);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Color</h3>
            <span className="text-gray-500 text-sm">{selectedColor?.name}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => color.stock !== 0 && handleColorChange(color)}
                disabled={color.stock === 0}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-brand-orange outline-none ${selectedColor?.id === color.id ? 'ring-2 ring-brand-orange ring-offset-2' : 'ring-1 ring-gray-200'} ${color.stock !== 0 ? 'hover:ring-gray-300' : 'opacity-40 cursor-not-allowed'}`}
                style={{ backgroundColor: color.value }}
                title={color.stock === 0 ? `${color.name} - Out of Stock` : color.name}
              >
                {/* Diagonal line to indicate out of stock */}
                {color.stock === 0 && (
                  <div className="absolute inset-0 w-full h-full bg-red-500/80 rounded-full" style={{ clipPath: 'polygon(0 45%, 100% 45%, 100% 55%, 0 55%)', transform: 'rotate(45deg)' }}></div>
                )}
                {selectedColor?.id === color.id && (
                  <Check size={16} className={['#ffffff', '#fff', 'white'].includes(color.value.toLowerCase()) ? 'text-gray-900' : 'text-white'} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Size</h3>
            <button className="text-brand-orange text-sm font-medium hover:underline">Size Guide</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => size.stock !== 0 && handleSizeChange(size)}
                disabled={size.stock === 0}
                className={`relative min-w-[4rem] h-12 px-4 rounded-xl font-bold transition-all border-2 focus-visible:ring-2 focus-visible:ring-brand-orange outline-none overflow-hidden ${selectedSize?.id === size.id ? 'border-brand-orange bg-orange-50 text-brand-orange' : size.stock === 0 ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                title={size.stock === 0 ? `${size.name || size.value} - Out of Stock` : undefined}
              >
                {size.value}
                {/* Diagonal line to indicate out of stock */}
                {size.stock === 0 && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[2px] bg-gray-300 -rotate-12"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
