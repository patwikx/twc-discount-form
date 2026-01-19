import { getApplication, approveApplication, rejectApplication } from "@/actions/application";
import { Card, Button, Badge } from "@/components/ui/brutalist";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminApprovalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = await getApplication(id);

  if (!application) return <div>404</div>;

  async function onApprove() {
    "use server";
    await approveApplication(id, "Admin"); // TODO: Capture actual admin name if logged in
    redirect(`/admin/approve/${id}`);
  }

  async function onReject() {
    "use server";
    await rejectApplication(id);
    redirect(`/admin/approve/${id}`);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start">
      <Card className="max-w-2xl w-full">
        <h1 className="font-mono text-2xl font-black mb-6">Approval Request</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8 font-mono text-sm">
            <div>
                <span className="block text-gray-500 text-xs">APPLICANT</span>
                <span className="font-bold text-lg">{application.name}</span>
            </div>
            <div>
                <span className="block text-gray-500 text-xs">COMPANY</span>
                <span className="font-bold">{application.company?.name || "N/A"}</span>
            </div>
            <div>
                <span className="block text-gray-500 text-xs">DATE OF AVAILMENT</span>
                <span className="font-bold">{application.availmentDate.toLocaleDateString()}</span>
            </div>
            <div>
                <span className="block text-gray-500 text-xs">STATUS</span>
                <Badge status={application.status} />
            </div>
            <div className="col-span-2">
                 <span className="block text-gray-500 text-xs">REQUESTED DISCOUNTS</span>
                 <p className="font-bold">{application.discountType}</p>
                 <span className="block text-gray-500 text-xs mt-2">HOTELS</span>
                 <p className="font-bold">{application.hotel}</p>
            </div>
        </div>

        {application.status === "PENDING" ? (
            <div className="flex gap-4">
                <form action={onApprove} className="w-full">
                    <Button className="w-full bg-green-500 border-green-700 hover:bg-green-400">APPROVE</Button>
                </form>
                <form action={onReject} className="w-full">
                     <Button className="w-full bg-red-500 border-red-700 hover:bg-red-400">REJECT</Button>
                </form>
            </div>
        ) : (
            <div className="text-center font-mono font-bold p-4 bg-gray-200 border-2 border-gray-400">
                APPLICATION {application.status}
            </div>
        )}
      </Card>
    </div>
  );
}
