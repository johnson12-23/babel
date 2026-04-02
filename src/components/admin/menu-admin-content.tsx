"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

type MenuItem = {
  id: number;
  section_title: string;
  name: string;
  detail: string;
  price_ghs: number;
  sort_order: number;
  is_active: boolean;
};

type AdminMenuPageProps = {
  initialItems: MenuItem[];
};

export function MenuAdminContent({ initialItems }: AdminMenuPageProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    section_title: "Appetizers",
    name: "",
    detail: "",
    price_ghs: 0,
    sort_order: items.length,
  });

  async function handleAddItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) {
        alert("Failed to add item");
        return;
      }

      const data = (await res.json()) as { item: MenuItem };
      setItems((prev) => [...prev, data.item]);
      setNewItem({
        section_title: "Appetizers",
        name: "",
        detail: "",
        price_ghs: 0,
        sort_order: items.length + 1,
      });
    } catch {
      alert("Error adding item");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteItem(id: number) {
    if (!confirm("Delete this menu item?")) return;

    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to delete item");
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Error deleting item");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold text-cream">Menu Management</h1>
        <p className="mt-2 text-sm text-mist">Add, edit, and organize menu items.</p>
      </div>

      <form
        onSubmit={handleAddItem}
        className="luxury-glow rounded-2xl border border-mist/25 bg-charcoal/55 p-6 backdrop-blur-md"
      >
        <h2 className="text-xl font-semibold text-gold">New Menu Item</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-mist">
            Section
            <select
              value={newItem.section_title}
              onChange={(e) =>
                setNewItem((prev) => ({ ...prev, section_title: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
            >
              <option>Appetizers</option>
              <option>Cold Starters</option>
              <option>Sea & Flame</option>
              <option>Mains</option>
              <option>Desserts</option>
              <option>Beverages</option>
            </select>
          </label>

          <label className="text-sm text-mist">
            Dish Name
            <input
              required
              value={newItem.name}
              onChange={(e) =>
                setNewItem((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
            />
          </label>

          <label className="text-sm text-mist sm:col-span-2">
            Description
            <input
              required
              value={newItem.detail}
              onChange={(e) =>
                setNewItem((prev) => ({ ...prev, detail: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
            />
          </label>

          <label className="text-sm text-mist">
            Price (GHS)
            <input
              required
              type="number"
              min={0}
              value={newItem.price_ghs}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  price_ghs: Number(e.target.value),
                }))
              }
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
            />
          </label>

          <label className="text-sm text-mist">
            Sort Order
            <input
              type="number"
              min={0}
              value={newItem.sort_order}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  sort_order: Number(e.target.value),
                }))
              }
              className="mt-2 w-full rounded-lg border border-mist/30 bg-onyx/70 px-3 py-2 text-cream outline-none focus:border-gold"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold tracking-wide text-onyx transition hover:scale-[1.01] disabled:opacity-60"
        >
          <Plus size={16} />
          Add Item
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mist/20 text-mist">
              <th className="px-4 py-3 text-left">Section</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Sort</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-mist/10 hover:bg-charcoal/30">
                <td className="px-4 py-3 text-cream">{item.section_title}</td>
                <td className="px-4 py-3 text-cream">{item.name}</td>
                <td className="px-4 py-3 text-gold">GHS {item.price_ghs}</td>
                <td className="px-4 py-3 text-mist">{item.sort_order}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-400/50 px-3 py-1 text-xs font-semibold text-red-400 transition hover:border-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
