"use client";

import { useState, useEffect } from "react";
import { submitApplication } from "@/actions/application";
import { getCompanies } from "@/actions/companies";
import { getHotels, getDiscountTypes } from "@/actions/lookups";
import { Card, Button, Input, Checkbox } from "@/components/ui/brutalist";
import { useRouter } from "next/navigation";

type Company = {
  id: string;
  name: string;
  approverEmail: string;
};

type LookupItem = {
  id: string;
  name: string;
};

export default function EmployeeDiscountForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [hotels, setHotels] = useState<LookupItem[]>([]);
  const [discountTypes, setDiscountTypes] = useState<LookupItem[]>([]);

  // Fetch lookup data from database on mount
  useEffect(() => {
    async function loadLookups() {
      const [companiesData, hotelsData, discountTypesData] = await Promise.all([
        getCompanies(),
        getHotels(),
        getDiscountTypes(),
      ]);
      setCompanies(companiesData);
      setHotels(hotelsData);
      setDiscountTypes(discountTypesData);
    }
    loadLookups();
  }, []);

  const [formData, setFormData] = useState({
    employeeType: "Employee", // Default
    name: "",
    idNumber: "",
    companyId: "",
    department: "",
    position: "",
    availmentDate: "",
    phoneNumber: "",
    email: "",
    hotels: [] as string[],
    discountTypes: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.companyId) throw new Error("Please select a company/resort.");
      if (formData.hotels.length === 0) throw new Error("Please select at least one hotel.");
      if (formData.discountTypes.length === 0) throw new Error("Please select at least one discount type.");
      
      const result = await submitApplication({
        ...formData,
        availmentDate: new Date(formData.availmentDate),
        hotel: formData.hotels,
        discountType: formData.discountTypes,
      });

      if (result.success) {
        router.push(`/status/${result.id}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  const toggleList = (list: string[], item: string) => {
    if (list.includes(item)) return list.filter((i) => i !== item);
    return [...list, item];
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-10 animate-in fade-in slide-in-from-bottom-4 bg-[#f0f0f0]">
      <div className="border-b-2 border-black pb-4 mb-6">
        <div className="flex items-center gap-4">
          <img src="/twc-logo.png" alt="TWC Logo" className="h-16 w-auto" />
          <div>
            <h1 className="font-mono text-3xl font-black uppercase tracking-tighter">Dolores Hotels & Resorts</h1>
            <p className="font-mono text-sm uppercase text-gray-600">Employee Discount Application Form</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Type Selection */}
        <div className="space-y-4">
          <h2 className="font-mono text-xl font-bold bg-black text-white inline-block px-2">1. APPLICANT TYPE</h2>
          <div className="flex gap-6">
            <Checkbox 
                id="type-emp" 
                label="EMPLOYEE" 
                checked={formData.employeeType === "Employee"} 
                onCheckedChange={() => setFormData({...formData, employeeType: "Employee"})} 
            />
             <Checkbox 
                id="type-rel" 
                label="RELATIVE" 
                checked={formData.employeeType === "Relative"} 
                onCheckedChange={() => setFormData({...formData, employeeType: "Relative"})} 
            />
          </div>
        </div>

        {/* Personal Info */}
        <div className="space-y-4">
          <h2 className="font-mono text-xl font-bold bg-black text-white inline-block px-2">2. PERSONAL INFORMATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="font-mono text-xs font-bold block mb-1">FULL NAME <span className="text-red-500">*</span></label>
                <Input 
                    placeholder="Enter full name" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div>
                <label className="font-mono text-xs font-bold block mb-1">ID NUMBER <span className="text-red-500">*</span></label>
                <Input 
                    placeholder="Enter ID number" 
                    required 
                    value={formData.idNumber}
                    onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                />
            </div>
            
            <div className="relative">
                <label className="font-mono text-xs font-bold block mb-1">COMPANY <span className="text-red-500">*</span></label>
                <select 
                    className="w-full border-2 border-black bg-transparent px-3 py-2 font-mono appearance-none"
                    required
                    value={formData.companyId}
                    onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                >
                    <option value="" disabled>SELECT COMPANY</option>
                    {companies.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <div className="absolute right-3 bottom-3 pointer-events-none">▼</div>
            </div>

            <div>
                <label className="font-mono text-xs font-bold block mb-1">DEPARTMENT <span className="text-red-500">*</span></label>
                <Input 
                    placeholder="Enter department" 
                    required 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                />
            </div>
            <div>
                <label className="font-mono text-xs font-bold block mb-1">POSITION <span className="text-red-500">*</span></label>
                <Input 
                    placeholder="Enter position" 
                    required 
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                />
            </div>
            <div>
                <label className="font-mono text-xs font-bold block mb-1">PHONE NUMBER <span className="text-red-500">*</span></label>
                <Input 
                    placeholder="09XX XXX XXXX" 
                    required 
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
            </div>
            <div>
                <label className="font-mono text-xs font-bold block mb-1">EMAIL ADDRESS <span className="text-red-500">*</span></label>
                <Input 
                    placeholder="email@company.com" 
                    required 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
            </div>
            <div className="md:col-span-2">
                <label className="font-mono text-xs font-bold block mb-1">DATE OF AVAILMENT <span className="text-red-500">*</span></label>
                <Input 
                    type="date" 
                    required 
                    value={formData.availmentDate}
                    onChange={(e) => setFormData({...formData, availmentDate: e.target.value})}
                />
            </div>
          </div>
        </div>

        {/* Hotels */}
        <div className="space-y-4">
            <h2 className="font-mono text-xl font-bold bg-black text-white inline-block px-2">3. HOTEL & RESORT</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hotels.map((hotel) => (
                    <Checkbox
                        key={hotel.id}
                        id={hotel.id}
                        label={hotel.name}
                        checked={formData.hotels.includes(hotel.name)}
                        onCheckedChange={() => setFormData(prev => ({...prev, hotels: toggleList(prev.hotels, hotel.name)}))}
                    />
                ))}
            </div>
        </div>

        {/* Discount Type */}
        <div className="space-y-4">
            <h2 className="font-mono text-xl font-bold bg-black text-white inline-block px-2">4. TYPE OF DISCOUNT</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {discountTypes.map((type) => (
                    <Checkbox
                        key={type.id}
                        id={type.id}
                        label={type.name}
                        checked={formData.discountTypes.includes(type.name)}
                        onCheckedChange={() => setFormData(prev => ({...prev, discountTypes: toggleList(prev.discountTypes, type.name)}))}
                    />
                ))}
            </div>
        </div>

        {/* Terms */}
        <div className="bg-gray-100 p-4 border-2 border-black text-xs font-mono">
            <h3 className="font-bold underline mb-2">TERMS & CONDITIONS</h3>
            <ul className="list-disc pl-4 space-y-1">
                <li>RD Employee must fill-up & submit this form at least 5 days for cottage and room availment.</li>
                <li>RD Employee must bring a valid company ID (Requirement on entry and verification).</li>
                <li>No approval of PMD Head = No discounts.</li>
            </ul>
        </div>
        
        {error && (
            <div className="bg-red-500 text-white p-4 font-mono font-bold border-2 border-black">
                ERROR: {error}
            </div>
        )}

        <Button type="submit" disabled={loading} className="w-full text-xl">
            {loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}
        </Button>

      </form>
    </Card>
  );
}
