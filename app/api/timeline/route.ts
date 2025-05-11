import { NextRequest, NextResponse } from "next/server";
import {
  getAllExperience,
  getAllEducation,
  getAllCertifications,
  getAllAchievements,
} from "@/lib/timeline-service";

// Set revalidation period to 24 hours (86400 seconds)
export const revalidate = 86400;

// Static data options - use a limited set for the static build
export const generateStaticParams = async () => {
  return [{}]; // Default params (no limit or type filter)
};

export async function GET(request: NextRequest) {
  try {
    // For static generation, don't use URL parameters
    // We'll return all entries and let the client do filtering
    const limit = undefined; // No limit for static generation
    const typeFilter = undefined; // No type filter for static generation

    // Get all timeline entries from various tables in parallel
    const [experience, education, certifications, achievements] =
      await Promise.all([
        getAllExperience().catch((err) => {
          console.error("Error fetching experience:", err);
          return [];
        }),
        getAllEducation().catch((err) => {
          console.error("Error fetching education:", err);
          return [];
        }),
        getAllCertifications().catch((err) => {
          console.error("Error fetching certifications:", err);
          return [];
        }),
        getAllAchievements().catch((err) => {
          console.error("Error fetching achievements:", err);
          return [];
        }),
      ]);

    // Ensure all returned values are arrays
    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeCertifications = Array.isArray(certifications)
      ? certifications
      : [];
    const safeAchievements = Array.isArray(achievements) ? achievements : [];

    // Combine all timeline entries into a single array
    const allEntries = [
      // Experience/Work entries
      ...safeExperience
        .map((exp) => {
          try {
            return {
              id: `work-${exp.id}`,
              type: "work" as const,
              title: exp.position || "Untitled Position",
              description: exp.description || "",
              organization: exp.company || "Unknown Company",
              startDate:
                exp.start_date || new Date().toISOString().split("T")[0],
              endDate: exp.end_date || null,
              location: exp.location,
              image: exp.logo_url,
              tags: exp.skills || [],
              link: exp.company_url || undefined,
            };
          } catch (err) {
            console.error("Error mapping experience entry:", err, exp);
            return null;
          }
        })
        .filter(Boolean),

      // Education entries
      ...safeEducation
        .map((edu) => {
          try {
            return {
              id: `education-${edu.id}`,
              type: "education" as const,
              title: edu.degree || "Education Entry",
              description:
                edu.description ||
                `${edu.degree || ""} in ${edu.field_of_study || ""}`.trim() ||
                "Education details",
              organization: edu.institution || "Unknown Institution",
              startDate:
                edu.start_date || new Date().toISOString().split("T")[0],
              endDate: edu.end_date || null,
              location: edu.location,
              image: edu.logo_url,
              tags: [],
              link: edu.institution_url || undefined,
            };
          } catch (err) {
            console.error("Error mapping education entry:", err, edu);
            return null;
          }
        })
        .filter(Boolean),

      // Certification entries
      ...safeCertifications
        .map((cert) => {
          try {
            return {
              id: `certification-${cert.id}`,
              type: "achievement" as const, // Certifications are shown as achievements
              title: cert.name || "Certification",
              description:
                cert.description ||
                `Certification issued by ${cert.issuer || "Unknown Issuer"}`,
              organization: cert.issuer || "Unknown Issuer",
              startDate:
                cert.issue_date || new Date().toISOString().split("T")[0],
              endDate: cert.expiry_date,
              image: cert.logo_url,
              link: cert.credential_url,
              tags: ["certification"],
            };
          } catch (err) {
            console.error("Error mapping certification entry:", err, cert);
            return null;
          }
        })
        .filter(Boolean),

      // Achievement entries
      ...safeAchievements
        .map((achievement) => {
          try {
            return {
              id: `achievement-${achievement.id}`,
              type: "achievement" as const,
              title: achievement.title || "Achievement",
              description: achievement.description || "Achievement details",
              organization: achievement.organization || undefined,
              startDate:
                achievement.award_date ||
                new Date().toISOString().split("T")[0],
              endDate: achievement.expiry_date,
              location: achievement.location,
              image: achievement.image_url,
              link: achievement.award_url,
              tags: achievement.tags || [],
            };
          } catch (err) {
            console.error("Error mapping achievement entry:", err, achievement);
            return null;
          }
        })
        .filter(Boolean),
    ].filter(Boolean); // Final filter to remove any null entries

    // Use static filter/sort/limit logic without URL params
    const sortedEntries = allEntries.sort((a, b) => {
      try {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA; // Descending order (newest first)
      } catch (error) {
        console.error("Error sorting entries:", error, { a, b });
        return 0; // Don't change order if there's an error
      }
    });

    return NextResponse.json(sortedEntries);
  } catch (error) {
    console.error("Error in timeline API:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeline entries", details: String(error) },
      { status: 500 }
    );
  }
}
