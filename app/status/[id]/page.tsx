import { getApplication } from "@/actions/application";
import { Card, Badge } from "@/components/ui/brutalist";
import QRCode from "react-qr-code";

export const dynamic = "force-dynamic";

export default async function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = await getApplication(id);

  if (!application) {
    return <div className="p-10 font-mono text-center">APPLICATION NOT FOUND</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white text-center space-y-6">
        <div>
           <h1 className="font-mono text-2xl font-black uppercase">Application Status</h1>
        </div>

        <div className="flex justify-center">
            <Badge status={application.status} />
        </div>

        {application.status === "APPROVED" && (
            <div className="bg-white p-4 border-2 border-black inline-block">
                <QRCode value={application.qrToken} size={200} />
                <p className="mt-2 text-xs font-mono">SCAN TO VALIDATE</p>
            </div>
        )}
        
        {application.status === "PENDING" && (
            <div className="p-4 bg-yellow-100 border-2 border-yellow-500 font-mono text-sm">
                Your application is waiting for approval from <strong>{application.company?.name || "management"}</strong>.
                Please check back later.
            </div>
        )}

        {application.status === "REJECTED" && (
            <div className="p-4 bg-red-100 border-2 border-red-500 font-mono text-sm">
                Sorry, your application has been rejected.
            </div>
        )}
        
        {application.status === "USED" && (
            <div className="p-4 bg-gray-100 border-2 border-gray-500 font-mono text-sm">
                This discount was used on {application.usedAt?.toLocaleDateString()}.
            </div>
        )}

        <div className="border-t-2 border-black pt-4">
            <div className="grid grid-cols-2 gap-3 font-mono text-sm text-left">
                <div>
                    <span className="block text-gray-500 text-xs uppercase">Requestor</span>
                    <span className="font-bold">{application.name}</span>
                </div>
                <div>
                    <span className="block text-gray-500 text-xs uppercase">Employee ID</span>
                    <span className="font-bold">{application.idNumber}</span>
                </div>
                <div>
                    <span className="block text-gray-500 text-xs uppercase">Company</span>
                    <span className="font-bold">{application.company?.name || "N/A"}</span>
                </div>
                <div>
                    <span className="block text-gray-500 text-xs uppercase">Type</span>
                    <span className="font-bold">{application.employeeType}</span>
                </div>
                <div>
                    <span className="block text-gray-500 text-xs uppercase">Availment Date</span>
                    <span className="font-bold">{application.availmentDate.toLocaleDateString()}</span>
                </div>
                <div>
                    <span className="block text-gray-500 text-xs uppercase">Hotel/Resort</span>
                    <span className="font-bold">{application.hotel}</span>
                </div>
                <div className="col-span-2">
                    <span className="block text-gray-500 text-xs uppercase">Discount Type</span>
                    <span className="font-bold">{application.discountType}</span>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
}
