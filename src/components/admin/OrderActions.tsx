"use client";

import { useState } from "react";
import { MoreVertical, Check, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
  paymentStatus: string;
}

export default function OrderActions({ orderId, currentStatus, paymentStatus }: OrderActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      alert("Error updating status");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handlePaymentStatusChange = async (newPaymentStatus: string) => {
    if (newPaymentStatus === paymentStatus) {
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to update payment status");
      }
    } catch (e) {
      alert("Error updating payment status");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleRefund = async () => {
    if (!confirm("Are you sure you want to refund this order? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: "POST",
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to process refund");
      }
    } catch (e) {
      alert("Error processing refund");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="p-2 text-gray-400 hover:text-brand-orange transition-colors rounded-full hover:bg-orange-50 disabled:opacity-50"
      >
        {loading ? <RefreshCw size={18} className="animate-spin" /> : <MoreVertical size={18} />}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 border-b border-gray-50 bg-gray-50">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Status</span>
            </div>
            <ul className="py-1">
              {statuses.map(status => (
                <li key={status}>
                  <button 
                    onClick={() => handleStatusChange(status)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors flex items-center justify-between"
                  >
                    {status}
                    {currentStatus === status && <Check size={14} className="text-brand-orange" />}
                  </button>
                </li>
              ))}
            </ul>

            <div className="p-2 border-y border-gray-50 bg-gray-50 mt-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Status</span>
            </div>
            <ul className="py-1">
              {['PENDING', 'PAID', 'FAILED', 'REFUNDED'].map(pStatus => (
                <li key={pStatus}>
                  <button 
                    onClick={() => handlePaymentStatusChange(pStatus)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors flex items-center justify-between"
                  >
                    {pStatus}
                    {paymentStatus === pStatus && <Check size={14} className="text-brand-orange" />}
                  </button>
                </li>
              ))}

              {paymentStatus === 'PAID' && (
                <>
                  <div className="border-t border-gray-100 my-1"></div>
                  <li>
                    <button 
                      onClick={handleRefund}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors flex items-center justify-between"
                    >
                      Process Refund
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
