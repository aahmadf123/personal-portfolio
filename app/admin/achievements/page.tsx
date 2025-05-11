"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit, Award, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Achievement } from "@/types/timeline";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("award_date", { ascending: false });

      if (error) {
        throw error;
      }

      setAchievements(data || []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast({
        title: "Error",
        description: "Failed to load achievements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleCreate = () => {
    router.push("/admin/achievements/new");
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/achievements/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from("achievements")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Achievement deleted successfully",
      });
      fetchAchievements();
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast({
        title: "Error",
        description: "Failed to delete achievement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (id: number, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from("achievements")
        .update({ is_featured: !currentValue })
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Achievement ${
          !currentValue ? "featured" : "unfeatured"
        } successfully`,
      });
      fetchAchievements();
    } catch (error) {
      console.error("Error updating achievement:", error);
      toast({
        title: "Error",
        description: "Failed to update achievement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredAchievements = achievements.filter((achievement) => {
    const query = searchQuery.toLowerCase();
    return (
      achievement.title.toLowerCase().includes(query) ||
      (achievement.organization &&
        achievement.organization.toLowerCase().includes(query)) ||
      achievement.description.toLowerCase().includes(query) ||
      achievement.achievement_type.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <AdminPageHeader
        title="Achievements Management"
        description="Create and manage your achievements, awards, and recognitions."
        icon={<Award className="h-6 w-6" />}
      />

      <div className="flex justify-between items-center my-6">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Eye className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Achievement
        </Button>
      </div>

      <Separator className="my-6" />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredAchievements.length === 0 ? (
        <EmptyState
          icon={<Award className="h-12 w-12" />}
          title="No achievements found"
          description={
            searchQuery
              ? "No achievements match your search. Try a different query."
              : "You haven't added any achievements yet. Click the button above to create one."
          }
          action={
            !searchQuery && (
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </Button>
            )
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAchievements.map((achievement) => (
              <TableRow key={achievement.id}>
                <TableCell className="font-medium">
                  {achievement.title}
                </TableCell>
                <TableCell>{achievement.organization || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {achievement.achievement_type}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(achievement.award_date)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleToggleFeatured(
                        achievement.id,
                        achievement.is_featured
                      )
                    }
                    title={
                      achievement.is_featured ? "Featured" : "Not featured"
                    }
                  >
                    <Star
                      className={`h-4 w-4 ${
                        achievement.is_featured
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(achievement.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(achievement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
