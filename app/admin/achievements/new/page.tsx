"use client";

import { AchievementForm } from "../_components/achievement-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Award } from "lucide-react";

export default function NewAchievementPage() {
  return (
    <>
      <AdminPageHeader
        title="Create New Achievement"
        description="Add a new achievement, award, or recognition to your timeline."
        icon={<Award className="h-6 w-6" />}
      />
      <AchievementForm />
    </>
  );
}
