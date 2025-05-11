import {
  debugProjectImages,
  getProjectWithImages,
} from "@/lib/debug-project-images";

export default async function DebugProjectsPage() {
  // Debug the ChemE Car project
  const chemeCarProject = await debugProjectImages(
    "cheme-car-competition-project"
  );

  // Get all projects
  const allProjects = await getProjectWithImages();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Project Images</h1>

      <div className="space-y-8">
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">ChemE Car Project</h2>
          {chemeCarProject ? (
            <pre className="bg-black text-white p-4 rounded overflow-auto max-h-[400px]">
              {JSON.stringify(chemeCarProject, null, 2)}
            </pre>
          ) : (
            <p className="text-red-500">Project not found or error occurred</p>
          )}
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            All Projects (Image URLs)
          </h2>
          {allProjects.length > 0 ? (
            <div className="grid gap-4">
              {allProjects.map((project) => (
                <div key={project.id} className="border p-4 rounded">
                  <h3 className="font-medium">
                    {project.title} (slug: {project.slug})
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Featured: {project.is_featured ? "Yes" : "No"}
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>thumbnail_url: {project.thumbnail_url || "none"}</p>
                    <p>main_image_url: {project.main_image_url || "none"}</p>
                    <p>image_url: {project.image_url || "none"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-500">No projects found or error occurred</p>
          )}
        </div>
      </div>
    </div>
  );
}
