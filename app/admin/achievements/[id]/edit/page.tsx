"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AchievementForm } from "../../_components/achievement-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Achievement } from "@/types/timeline";

export default function EditAchievementPage() {
  const params = useParams();
  const router = useRouter();
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchAchievement() {
      try {
        setLoading(true);
        setError(null);

        const id = Number(params?.id);
        if (isNaN(id)) {
          throw new Error("Invalid achievement ID");
        }

        const { data, error } = await supabase
          .from("achievements")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Achievement not found");
        }

        setAchievement(data);
      } catch (error) {
        console.error("Error fetching achievement:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load achievement. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAchievement();
  }, [params?.id, supabase]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <AdminPageHeader
          title="Edit Achievement"
          description="Update an existing achievement"
          icon={<Award className="h-6 w-6" />}
        />
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push("/admin/achievements")}>
            Back to achievements
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Edit Achievement"
        description="Update an existing achievement, award, or recognition in your timeline."
        icon={<Award className="h-6 w-6" />}
      />
      {achievement && (
        <AchievementForm achievement={achievement} isEdit={true} />
      )}
    </>
  );
}
