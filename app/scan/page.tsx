"use client";

import { useState, useEffect, useRef } from "react";
import { validateToken, redeemToken } from "@/actions/application";
import { Card, Button, Input, Badge } from "@/components/ui/brutalist";
import type { Html5Qrcode } from "html5-qrcode";

export default function ScanPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Cleanup scanner on unmount
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    setError("");
    setResult(null);
    
    try {
      // Dynamically import the library to avoid SSR issues
      const { Html5Qrcode } = await import("html5-qrcode");
      
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // QR code detected
          setToken(decodedText);
          await stopScanner();
          await validateScannedToken(decodedText);
        },
        (errorMessage) => {
          // Ignore scan errors (no QR found)
        }
      );
      setScanning(true);
      setScannerReady(true);
    } catch (err: any) {
      setError("Camera access denied or unavailable. Please use manual entry.");
      console.error(err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    setScanning(false);
  };

  const validateScannedToken = async (scannedToken: string) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const app = await validateToken(scannedToken);
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

  const handleManualScan = async (e: React.FormEvent) => {
    e.preventDefault();
    await stopScanner();
    await validateScannedToken(token);
  };

  const handleRedeem = async () => {
    if (!result) return;
    setLoading(true);
    await redeemToken(result.id);
    setResult({ ...result, status: "USED", usedAt: new Date() });
    setLoading(false);
  };

  const resetScanner = async () => {
    setToken("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-lg space-y-6">
        <h1 className="font-mono text-3xl font-black uppercase text-center">Staff Scanner</h1>
        
        {/* QR Scanner View */}
        {!result && (
          <>
            <div className="relative">
              <div 
                id="qr-reader" 
                className={`w-full aspect-square bg-gray-900 border-2 border-black ${scanning ? '' : 'flex items-center justify-center'}`}
              >
                {!scanning && (
                  <div className="text-center p-4">
                    <p className="font-mono text-gray-400 text-sm mb-4">Camera preview will appear here</p>
                    <Button onClick={startScanner} className="bg-blue-500 border-blue-700">
                      📷 START CAMERA
                    </Button>
                  </div>
                )}
              </div>
              {scanning && (
                <Button 
                  onClick={stopScanner} 
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 border-red-700"
                >
                  STOP CAMERA
                </Button>
              )}
            </div>

            <div className="text-center font-mono text-xs text-gray-500">— OR ENTER MANUALLY —</div>

            <form onSubmit={handleManualScan} className="flex gap-2">
              <Input 
                placeholder="ENTER QR TOKEN" 
                value={token} 
                onChange={(e) => setToken(e.target.value)}
                className="text-center text-lg font-black uppercase"
              />
              <Button type="submit" disabled={loading || !token}>SEARCH</Button>
            </form>
          </>
        )}

        {error && <div className="text-red-600 font-mono font-bold text-center">{error}</div>}

        {result && (
          <div className="border-t-2 border-black pt-4 space-y-4 animate-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center">
              <h2 className="font-bold font-mono text-xl">{result.name}</h2>
              <Badge status={result.status} />
            </div>
            
            <div className="font-mono text-sm space-y-1">
              <p><strong>ID:</strong> {result.idNumber}</p>
              <p><strong>Company:</strong> {result.company?.name || "N/A"}</p>
              <p><strong>Hotel:</strong> {result.hotel}</p>
              <p><strong>Discount:</strong> {result.discountType}</p>
              <p><strong>Date:</strong> {new Date(result.availmentDate).toLocaleDateString()}</p>
            </div>

            {result.status === "APPROVED" ? (
              <Button onClick={handleRedeem} disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white border-green-700">
                ✓ MARK AS USED / REDEEM
              </Button>
            ) : (
              <div className={`text-center font-mono text-sm py-3 px-4 ${
                result.status === "USED" ? "bg-gray-100 text-gray-600" : "bg-yellow-100 text-yellow-700"
              }`}>
                {result.status === "USED" ? "✓ ALREADY REDEEMED" : "⚠ CANNOT REDEEM (NOT APPROVED)"}
              </div>
            )}

            <Button onClick={resetScanner} className="w-full bg-gray-300 border-gray-500">
              ← SCAN ANOTHER
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
