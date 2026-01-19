"use client";

import { useState } from "react";
import { createCompany } from "@/actions/companies";
import { Card, Button, Input } from "@/components/ui/brutalist";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    approverEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.name.trim()) throw new Error("Company name is required.");
      if (!formData.approverEmail.trim()) throw new Error("Approver email is required.");

      await createCompany(formData);
      router.push("/admin/companies");
    } catch (err: any) {
      setError(err.message || "Failed to create company.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
      <Card className="max-w-lg w-full">
        <h1 className="font-mono text-2xl font-black mb-6 border-b-2 border-black pb-4">ADD NEW COMPANY</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs font-bold block mb-1">COMPANY NAME</label>
            <Input
              placeholder="e.g. Anchor Hotel"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="font-mono text-xs font-bold block mb-1">APPROVER EMAIL</label>
            <Input
              type="email"
              placeholder="manager@company.com"
              value={formData.approverEmail}
              onChange={(e) => setFormData({ ...formData, approverEmail: e.target.value })}
              required
            />
          </div>

          {error && (
            <div className="bg-red-500 text-white p-3 font-mono text-sm border-2 border-black">
              ERROR: {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "SAVING..." : "CREATE COMPANY"}
            </Button>
            <Link href="/admin/companies" className="flex-1">
              <Button type="button" className="w-full bg-gray-200 text-black border-gray-400">CANCEL</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
