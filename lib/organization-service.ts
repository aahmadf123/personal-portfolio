import type { Organization } from "@/components/organizations"

// This would normally be an API call to fetch organizations
// For this example, we'll just return the default organizations after a delay
export async function fetchOrganizations(): Promise<Organization[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return default organizations
  return [
    {
      name: "Pi Sigma Epsilon",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pi_Sigma_Epsilon_professional_fraternity_crest-g3uQ5EApIBA3apGrNEhRpvxwgDohxL.jpeg",
      role: "Epsilon Delta Chapter, Member",
      period: "2020 - Present",
      shortDescription: "National professional fraternity in marketing, sales, and management",
      description:
        "Member of Pi Sigma Epsilon, the national professional fraternity in marketing, sales, and management. As part of the Epsilon Delta Chapter, I participate in professional development activities, networking events, and community service projects that enhance my leadership and business skills.",
      benefits: [
        "Access to exclusive professional development workshops and training",
        "Networking opportunities with industry professionals and alumni",
        "Leadership development through chapter officer positions",
        "Participation in national sales and marketing competitions",
        "Mentorship programs with experienced professionals",
        "Resume enhancement and career preparation resources",
      ],
      url: "https://www.pse.org/",
      color: "rgba(165, 30, 34, 0.05)", // PSE colors are typically red and gold
    },
    {
      name: "IEEE",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ieee%20mb%20blue-dlYXWYesJXb1QZry5VNPYNmptNKt6H.png",
      role: "Member",
      period: "2019 - Present",
      shortDescription:
        "World's largest technical professional organization for electronics and electrical engineering",
      description:
        "Member of the Institute of Electrical and Electronics Engineers (IEEE), the world's largest technical professional organization. I participate in technical communities, access cutting-edge research, and engage with fellow professionals in computing, engineering, and technology fields.",
      benefits: [
        "Access to IEEE Xplore Digital Library with millions of technical documents",
        "Subscription to IEEE Spectrum magazine and technical publications",
        "Discounted registration for IEEE conferences and events",
        "Participation in technical communities and special interest groups",
        "Professional development courses and continuing education",
        "IEEE email alias and networking platform access",
      ],
      url: "https://www.ieee.org/",
      color: "rgba(0, 83, 165, 0.05)", // IEEE blue
    },
    {
      name: "AIChE",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/American%20Institute%20of%20Chemical%20Engineers_id9B2E87Q3_0-tInCnFiEekBKaoLrjGoUvZl9uqCsmx.png",
      role: "Member",
      period: "2021 - Present",
      shortDescription: "Leading organization for chemical engineering professionals worldwide",
      description:
        "Member of the American Institute of Chemical Engineers (AIChE), the world's leading organization for chemical engineering professionals. I engage with the latest developments in chemical engineering, process safety, and sustainable technology through conferences, publications, and networking opportunities.",
      benefits: [
        "Subscription to Chemical Engineering Progress (CEP) magazine",
        "Access to AIChE Academy for online learning and webinars",
        "Discounted registration for AIChE conferences and events",
        "Participation in technical divisions and forums",
        "Career resources including job board and salary surveys",
        "Networking with chemical engineering professionals worldwide",
      ],
      url: "https://www.aiche.org/",
      color: "rgba(0, 102, 51, 0.05)", // AIChE green
    },
  ]
}
