"use client";

import { useActionState, useState } from "react";
import { validateToken, redeemToken } from "@/actions/application";
import { Card, Button, Input, Badge } from "@/components/ui/brutalist";

export default function ScanPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
        const app = await validateToken(token);
        if (!app) {
            setError("Invalid Token");
        } else {
            setResult(app);
        }
    } catch (err) {
        setError("Error validating token");
    } finally {
        setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!result) return;
    setLoading(true);
    await redeemToken(result.id);
    setResult({ ...result, status: "USED", usedAt: new Date() });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-lg space-y-6">
        <h1 className="font-mono text-3xl font-black uppercase text-center">Staff Scanner</h1>
        
        <form onSubmit={handleScan} className="flex gap-2">
            <Input 
                placeholder="ENTER QR TOKEN" 
                value={token} 
                onChange={(e) => setToken(e.target.value)}
                className="text-center text-lg font-black uppercase"
                autoFocus
            />
            <Button type="submit" disabled={loading}>SEARCH</Button>
        </form>

        {error && <div className="text-red-600 font-mono font-bold text-center">{error}</div>}

        {result && (
            <div className="border-t-2 border-black pt-4 space-y-4 animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold font-mono text-xl">{result.name}</h2>
                    <Badge status={result.status} />
                </div>
                
                <div className="font-mono text-sm space-y-1">
                    <p><strong>Company:</strong> {result.company}</p>
                    <p><strong>Hotel:</strong> {result.hotel}</p>
                    <p><strong>Discount:</strong> {result.discountType}</p>
                    <p><strong>Date:</strong> {new Date(result.availmentDate).toLocaleDateString()}</p>
                </div>

                {result.status === "APPROVED" ? (
                    <Button onClick={handleRedeem} disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white border-green-700">
                        MARK AS USED / REDEEM
                    </Button>
                ) : (
                    <div className="text-center font-mono text-xs text-gray-500">
                        {result.status === "USED" ? "ALREADY REDEEMED" : "CANNOT REDEEM (NOT APPROVED)"}
                    </div>
                )}
            </div>
        )}
      </Card>
    </div>
  );
}
