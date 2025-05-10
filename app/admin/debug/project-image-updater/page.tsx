"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { transformStorageUrl } from "@/lib/storage-utils";

export default function ProjectImageUpdaterPage() {
  const [projectSlug, setProjectSlug] = useState("cheme-car-project");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    transformStorageUrl(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChemECar.jpg-e4KwdtDo9QKTFFqSQ46RLq23OjAcVM.jpeg"
    )
  );
  const [mainImageUrl, setMainImageUrl] = useState(
    transformStorageUrl(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChemECar.jpg-e4KwdtDo9QKTFFqSQ46RLq23OjAcVM.jpeg"
    )
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectSlug) {
      toast({
        title: "Validation Error",
        description: "Project slug is required",
        variant: "destructive",
      });
      return;
    }

    if (!thumbnailUrl && !mainImageUrl) {
      toast({
        title: "Validation Error",
        description: "At least one image URL is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setResult(null);

      const response = await fetch("/api/admin/update-project-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectSlug,
          thumbnailUrl: thumbnailUrl || undefined,
          mainImageUrl: mainImageUrl || undefined,
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update project images",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating project images:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/projects/clear-cache");
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description:
            "Cache cleared successfully. Refresh the page to see changes.",
        });
      } else {
        throw new Error(data.error || "Failed to clear cache");
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to clear cache",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Project Image Updater</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Update Project Images</CardTitle>
          <CardDescription>
            Use this form to directly update image URLs for a project in the
            database
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectSlug">Project Slug</Label>
              <Input
                id="projectSlug"
                value={projectSlug}
                onChange={(e) => setProjectSlug(e.target.value)}
                placeholder="e.g., cheme-car-project"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input
                id="thumbnailUrl"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainImageUrl">Main Image URL</Label>
              <Input
                id="mainImageUrl"
                value={mainImageUrl}
                onChange={(e) => setMainImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Project Images"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={clearCache}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Clear Cache"}
              </Button>
            </div>
          </form>
        </CardContent>

        {result && (
          <CardFooter className="flex-col items-start">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="bg-muted p-4 rounded w-full overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <a
              href="/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View Projects Page
            </a>
          </div>
          <div>
            <a
              href="/admin/debug/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Debug Projects
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
