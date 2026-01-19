"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui/brutalist";
import { getAllHotels, createHotel, deleteHotel, restoreHotel } from "@/actions/lookups";

type Hotel = {
  id: string;
  name: string;
  isActive: boolean;
};

export default function HotelsAdminPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [newHotelName, setNewHotelName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHotels();
  }, []);

  async function loadHotels() {
    setLoading(true);
    const data = await getAllHotels();
    setHotels(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newHotelName.trim()) return;
    setSaving(true);
    try {
      await createHotel({ name: newHotelName.trim() });
      setNewHotelName("");
      await loadHotels();
    } catch (error) {
      alert("Failed to create hotel");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to deactivate this hotel?")) return;
    await deleteHotel(id);
    await loadHotels();
  }

  async function handleRestore(id: string) {
    await restoreHotel(id);
    await loadHotels();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="font-mono text-2xl font-black uppercase">Hotels & Resorts</h1>
              <p className="font-mono text-sm text-gray-500">Manage hotels for the discount form</p>
            </div>
            <Button className="bg-gray-300 border-gray-500" onClick={() => router.push("/admin/companies")}>
              ← Back to Companies
            </Button>
          </div>

          {/* Add New Hotel */}
          <form onSubmit={handleCreate} className="flex gap-2 mb-6">
            <Input
              placeholder="Enter hotel/resort name"
              value={newHotelName}
              onChange={(e) => setNewHotelName(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={saving || !newHotelName.trim()}>
              {saving ? "Adding..." : "Add Hotel"}
            </Button>
          </form>

          {/* Hotels List */}
          {loading ? (
            <div className="text-center py-10 font-mono">Loading...</div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-10 font-mono text-gray-500">No hotels found</div>
          ) : (
            <div className="space-y-2">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className={`flex justify-between items-center p-3 border-2 border-black ${
                    hotel.isActive ? "bg-white" : "bg-gray-200 opacity-60"
                  }`}
                >
                  <div className="font-mono">
                    <span className="font-bold">{hotel.name}</span>
                    {!hotel.isActive && (
                      <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5">INACTIVE</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {hotel.isActive ? (
                      <Button className="bg-gray-300 border-gray-500" onClick={() => handleDelete(hotel.id)}>
                        Deactivate
                      </Button>
                    ) : (
                      <Button onClick={() => handleRestore(hotel.id)}>Restore</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Links */}
          <div className="mt-6 pt-4 border-t-2 border-black flex gap-4">
            <Button className="bg-gray-300 border-gray-500" onClick={() => router.push("/admin/discount-types")}>
              Manage Discount Types →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
