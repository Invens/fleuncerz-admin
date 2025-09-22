"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Campaigns", href: "/dashboard/campaigns" },
  { label: "Brands", href: "/dashboard/brands" },
  { label: "Influencers", href: "/dashboard/influencers" },
  { label: "Applications", href: "/dashboard/applications" },
  // { label: "Moderation", href: "/dashboard/moderation" },
  // { label: "Insights", href: "/dashboard/insights" },
    // { label: "Stats", href: "/dashboard/stats" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded ${
              pathname.startsWith(item.href)
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
