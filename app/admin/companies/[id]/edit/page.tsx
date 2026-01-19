"use client";

import { useState, useEffect } from "react";
import { getCompanyById, updateCompany } from "@/actions/companies";
import { Card, Button, Input } from "@/components/ui/brutalist";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    approverEmail: "",
  });

  useEffect(() => {
    async function fetchCompany() {
      const company = await getCompanyById(id);
      if (company) {
        setFormData({
          name: company.name,
          approverEmail: company.approverEmail,
        });
      }
      setFetching(false);
    }
    fetchCompany();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.name.trim()) throw new Error("Company name is required.");
      if (!formData.approverEmail.trim()) throw new Error("Approver email is required.");

      await updateCompany(id, formData);
      router.push("/admin/companies");
    } catch (err: any) {
      setError(err.message || "Failed to update company.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="font-mono">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
      <Card className="max-w-lg w-full">
        <h1 className="font-mono text-2xl font-black mb-6 border-b-2 border-black pb-4">EDIT COMPANY</h1>

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
              {loading ? "SAVING..." : "UPDATE COMPANY"}
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
