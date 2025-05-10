import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageGalleryWrapper } from "./_components/image-gallery-wrapper"

export const metadata = {
  title: "Media Library | Admin",
  description: "Upload, browse, and manage images for your portfolio",
}

export default async function ImagesPage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Upload, browse, and manage images for your portfolio</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Image Management</CardTitle>
          <CardDescription>Upload and organize images for your projects, blog posts, and other content</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Images</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ImageGalleryWrapper folder="all" />
            </TabsContent>

            <TabsContent value="projects">
              <ImageGalleryWrapper folder="projects" />
            </TabsContent>

            <TabsContent value="blog">
              <ImageGalleryWrapper folder="blog" />
            </TabsContent>

            <TabsContent value="profile">
              <ImageGalleryWrapper folder="profile" />
            </TabsContent>

            <TabsContent value="general">
              <ImageGalleryWrapper folder="general" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
