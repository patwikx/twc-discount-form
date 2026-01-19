import Link from "next/link";
import { Button } from "@/components/ui/brutalist";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="text-center font-mono space-y-6">
        <h1 className="text-6xl font-black">404</h1>
        <p className="text-xl uppercase">Page Not Found</p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
