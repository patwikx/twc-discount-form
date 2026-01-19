"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui/brutalist";
import { getAllDiscountTypes, createDiscountType, deleteDiscountType, restoreDiscountType } from "@/actions/lookups";

type DiscountType = {
  id: string;
  name: string;
  isActive: boolean;
};

export default function DiscountTypesAdminPage() {
  const router = useRouter();
  const [discountTypes, setDiscountTypes] = useState<DiscountType[]>([]);
  const [newTypeName, setNewTypeName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDiscountTypes();
  }, []);

  async function loadDiscountTypes() {
    setLoading(true);
    const data = await getAllDiscountTypes();
    setDiscountTypes(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    setSaving(true);
    try {
      await createDiscountType({ name: newTypeName.trim() });
      setNewTypeName("");
      await loadDiscountTypes();
    } catch (error) {
      alert("Failed to create discount type");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to deactivate this discount type?")) return;
    await deleteDiscountType(id);
    await loadDiscountTypes();
  }

  async function handleRestore(id: string) {
    await restoreDiscountType(id);
    await loadDiscountTypes();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="font-mono text-2xl font-black uppercase">Discount Types</h1>
              <p className="font-mono text-sm text-gray-500">Manage discount types for the form</p>
            </div>
            <Button className="bg-gray-300 border-gray-500" onClick={() => router.push("/admin/hotels")}>
              ← Back to Hotels
            </Button>
          </div>

          {/* Add New Discount Type */}
          <form onSubmit={handleCreate} className="flex gap-2 mb-6">
            <Input
              placeholder="Enter discount type name"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={saving || !newTypeName.trim()}>
              {saving ? "Adding..." : "Add Type"}
            </Button>
          </form>

          {/* Discount Types List */}
          {loading ? (
            <div className="text-center py-10 font-mono">Loading...</div>
          ) : discountTypes.length === 0 ? (
            <div className="text-center py-10 font-mono text-gray-500">No discount types found</div>
          ) : (
            <div className="space-y-2">
              {discountTypes.map((type) => (
                <div
                  key={type.id}
                  className={`flex justify-between items-center p-3 border-2 border-black ${
                    type.isActive ? "bg-white" : "bg-gray-200 opacity-60"
                  }`}
                >
                  <div className="font-mono">
                    <span className="font-bold">{type.name}</span>
                    {!type.isActive && (
                      <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5">INACTIVE</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {type.isActive ? (
                      <Button className="bg-gray-300 border-gray-500" onClick={() => handleDelete(type.id)}>
                        Deactivate
                      </Button>
                    ) : (
                      <Button onClick={() => handleRestore(type.id)}>Restore</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Links */}
          <div className="mt-6 pt-4 border-t-2 border-black flex gap-4">
            <Button className="bg-gray-300 border-gray-500" onClick={() => router.push("/admin/companies")}>
              Manage Companies →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
