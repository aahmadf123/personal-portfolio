import { DatabaseSeeder } from "@/components/admin/database-seeder";
import { DatabaseSetup } from "@/components/admin/database-setup";
import { Suspense } from "react";

export const metadata = {
  title: "Database Management - Admin",
  description: "Manage your portfolio database",
};

export default function DatabaseManagementPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Database Management</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading setup...</div>}>
          <DatabaseSetup />
        </Suspense>
        <Suspense fallback={<div>Loading seeder...</div>}>
          <DatabaseSeeder />
        </Suspense>
      </div>
    </div>
  );
}
