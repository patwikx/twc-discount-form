import { getAllCompanies, seedCompanies, deleteCompany, restoreCompany } from "@/actions/companies";
import { Card, Button, Badge } from "@/components/ui/brutalist";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies = await getAllCompanies();

  async function onSeed() {
    "use server";
    await seedCompanies();
    revalidatePath("/admin/companies");
  }

  async function onDelete(id: string) {
    "use server";
    await deleteCompany(id);
  }

  async function onRestore(id: string) {
    "use server";
    await restoreCompany(id);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
          <div>
            <h1 className="font-mono text-2xl font-black uppercase">Company Management</h1>
            <p className="font-mono text-sm text-gray-500">Manage approver emails per company</p>
          </div>
          <div className="flex gap-2">
            <form action={onSeed}>
              <Button type="submit" className="text-sm">SEED DATA</Button>
            </form>
            <Link href="/admin/companies/new">
              <Button className="text-sm bg-green-600 border-green-800">+ ADD COMPANY</Button>
            </Link>
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="text-center py-10 font-mono text-gray-500">
            <p>No companies found.</p>
            <p className="text-sm mt-2">Click "SEED DATA" to add initial companies.</p>
          </div>
        ) : (
          <table className="w-full font-mono text-sm">
            <thead>
              <tr className="border-b-2 border-black text-left">
                <th className="py-3 px-2">COMPANY NAME</th>
                <th className="py-3 px-2">APPROVER EMAIL</th>
                <th className="py-3 px-2">STATUS</th>
                <th className="py-3 px-2 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b border-gray-300 hover:bg-gray-100">
                  <td className="py-3 px-2 font-bold">{company.name}</td>
                  <td className="py-3 px-2">{company.approverEmail}</td>
                  <td className="py-3 px-2">
                    <Badge status={company.isActive ? "APPROVED" : "REJECTED"} />
                  </td>
                  <td className="py-3 px-2 text-right space-x-2">
                    <Link href={`/admin/companies/${company.id}/edit`}>
                      <Button className="text-xs py-1 px-3">EDIT</Button>
                    </Link>
                    {company.isActive ? (
                      <form action={onDelete.bind(null, company.id)} className="inline">
                        <Button type="submit" className="text-xs py-1 px-3 bg-red-500 border-red-700">DELETE</Button>
                      </form>
                    ) : (
                      <form action={onRestore.bind(null, company.id)} className="inline">
                        <Button type="submit" className="text-xs py-1 px-3 bg-blue-500 border-blue-700">RESTORE</Button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-6 pt-4 border-t-2 border-black">
          <Link href="/" className="font-mono text-sm underline">← Back to Form</Link>
        </div>
      </Card>
    </div>
  );
}
