"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export interface Variant {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'size';
  priceOffset?: number; // E.g., +$20 for XL size
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
                onClick={() => handleColorChange(color)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor?.id === color.id ? 'ring-2 ring-brand-orange ring-offset-2' : 'ring-1 ring-gray-200 hover:ring-gray-300'}`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
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
                onClick={() => handleSizeChange(size)}
                className={`min-w-[4rem] h-12 px-4 rounded-xl font-bold transition-all border-2 ${selectedSize?.id === size.id ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
              >
                {size.value}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
