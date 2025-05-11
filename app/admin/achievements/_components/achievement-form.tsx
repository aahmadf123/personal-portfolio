"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Award, Calendar, CalendarIcon, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "@/components/ui/use-toast";
import type { Achievement } from "@/types/timeline";

interface AchievementFormProps {
  achievement?: Achievement;
  isEdit?: boolean;
}

export function AchievementForm({
  achievement,
  isEdit = false,
}: AchievementFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(achievement?.title || "");
  const [description, setDescription] = useState(
    achievement?.description || ""
  );
  const [organization, setOrganization] = useState(
    achievement?.organization || ""
  );
  const [awardDate, setAwardDate] = useState<Date | undefined>(
    achievement?.award_date ? new Date(achievement.award_date) : undefined
  );
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    achievement?.expiry_date ? new Date(achievement.expiry_date) : undefined
  );
  const [awardUrl, setAwardUrl] = useState(achievement?.award_url || "");
  const [imageUrl, setImageUrl] = useState(achievement?.image_url || "");
  const [achievementType, setAchievementType] = useState(
    achievement?.achievement_type || "award"
  );
  const [location, setLocation] = useState(achievement?.location || "");
  const [isFeatured, setIsFeatured] = useState(
    achievement?.is_featured || false
  );
  const [tags, setTags] = useState(achievement?.tags?.join(", ") || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !awardDate || !achievementType) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const formattedAwardDate = format(awardDate, "yyyy-MM-dd");
      const formattedExpiryDate = expiryDate
        ? format(expiryDate, "yyyy-MM-dd")
        : null;
      const formattedTags = tags
        ? tags.split(",").map((tag) => tag.trim())
        : [];

      const achievementData = {
        title,
        description,
        organization: organization || null,
        award_date: formattedAwardDate,
        expiry_date: formattedExpiryDate,
        award_url: awardUrl || null,
        image_url: imageUrl || null,
        achievement_type: achievementType,
        location: location || null,
        is_featured: isFeatured,
        tags: formattedTags,
      };

      if (isEdit && achievement) {
        // Update existing achievement
        const { error } = await supabase
          .from("achievements")
          .update(achievementData)
          .eq("id", achievement.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Achievement updated successfully",
        });
      } else {
        // Create new achievement
        const { error } = await supabase
          .from("achievements")
          .insert([achievementData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Achievement created successfully",
        });
      }

      // Navigate back to achievements page
      router.push("/admin/achievements");
      router.refresh();
    } catch (error) {
      console.error("Error saving achievement:", error);
      toast({
        title: "Error",
        description: "Failed to save achievement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/achievements")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Achievements
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Update Achievement" : "Save Achievement"}
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                {isEdit ? "Edit Achievement" : "New Achievement"}
              </CardTitle>
              <CardDescription>
                {isEdit
                  ? "Update the details of your achievement"
                  : "Enter the details of your new achievement"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Achievement title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      placeholder="Awarding organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="achievement-type">
                      Achievement Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={achievementType}
                      onValueChange={setAchievementType}
                    >
                      <SelectTrigger id="achievement-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="award">Award</SelectItem>
                        <SelectItem value="recognition">Recognition</SelectItem>
                        <SelectItem value="publication">Publication</SelectItem>
                        <SelectItem value="competition">Competition</SelectItem>
                        <SelectItem value="honor">Honor</SelectItem>
                        <SelectItem value="scholarship">Scholarship</SelectItem>
                        <SelectItem value="grant">Grant</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Award location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="award-date">
                      Award Date <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                      id="award-date"
                      date={awardDate}
                      setDate={setAwardDate}
                      placeholder="Select award date"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="expiry-date">
                      Expiry Date (if applicable)
                    </Label>
                    <DatePicker
                      id="expiry-date"
                      date={expiryDate}
                      setDate={setExpiryDate}
                      placeholder="Select expiry date"
                    />
                  </div>

                  <div>
                    <Label htmlFor="award-url">Award URL</Label>
                    <Input
                      id="award-url"
                      placeholder="Link to award certificate or details"
                      value={awardUrl}
                      onChange={(e) => setAwardUrl(e.target.value)}
                      type="url"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image-url">Image URL</Label>
                    <Input
                      id="image-url"
                      placeholder="URL to award image"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      type="url"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the achievement"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="leadership, innovation, teamwork"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-featured"
                  checked={isFeatured}
                  onCheckedChange={(checked) =>
                    setIsFeatured(checked as boolean)
                  }
                />
                <Label htmlFor="is-featured" className="cursor-pointer">
                  Featured achievement (appears in the featured section)
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/achievements")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update Achievement"
                  : "Create Achievement"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
}
