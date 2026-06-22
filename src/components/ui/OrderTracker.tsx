import { Check } from "lucide-react";

interface OrderTrackerProps {
  currentStatus: string;
}

export default function OrderTracker({ currentStatus }: OrderTrackerProps) {
  const steps = [
    { id: 'PENDING', label: 'Order Placed' },
    { id: 'PROCESSING', label: 'Processing' },
    { id: 'SHIPPED', label: 'Shipped' },
    { id: 'DELIVERED', label: 'Delivered' }
  ];

  // If Cancelled, show a specific error state
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="w-full bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-center">
        <span className="text-red-600 font-bold">This order has been cancelled.</span>
      </div>
    );
  }

  // Find current step index
  const currentIndex = steps.findIndex(s => s.id === currentStatus);
  // Default to 0 (Pending) if not found (or in an edge case)
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between w-full">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full" />
        
        {/* Active Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-orange rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isCompleted 
                    ? 'bg-brand-orange border-brand-orange text-white' 
                    : isActive 
                      ? 'bg-white border-brand-orange text-brand-orange ring-4 ring-orange-50' 
                      : 'bg-white border-gray-300 text-gray-300'
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-brand-orange' : 'bg-transparent'}`} />}
              </div>
              <span className={`absolute top-10 text-xs font-bold whitespace-nowrap transition-colors duration-300 ${
                isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
