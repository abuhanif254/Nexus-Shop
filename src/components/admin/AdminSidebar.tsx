"use client";

import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Users, Settings, PackageOpen, Box } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { href: "/admin/products", icon: Box, label: "Products" },
    { href: "/admin/customers", icon: Users, label: "Customers" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 shrink-0">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
          <span className="bg-brand-orange text-white p-1.5 rounded">
            <PackageOpen size={20} />
          </span>
          Besa Admin
        </h2>
      </div>
      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                isActive ? 'text-brand-orange bg-orange-50' : 'text-gray-600 hover:text-brand-orange hover:bg-orange-50'
              }`}
            >
              <Icon size={18} /> {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
