import Script from "next/script"

interface Organization {
  name: string
  url: string
  logo?: string
  role?: string
  period?: string
}

interface SeoSchemaProps {
  name: string
  description: string
  profileImage?: string
  sameAs?: string[]
  jobTitle?: string
  organization?: string
  affiliations?: Organization[]
}

export function SeoSchema({
  name,
  description,
  profileImage,
  sameAs = [],
  jobTitle,
  organization,
  affiliations = [],
}: SeoSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"

  // Create memberOf array for person schema
  const memberOfArray = affiliations.map((affiliation) => ({
    "@type": "Organization",
    name: affiliation.name,
    url: affiliation.url,
    ...(affiliation.logo && { logo: `${baseUrl}${affiliation.logo}` }),
  }))

  // Create separate organization schemas for each affiliation
  const organizationSchemas = affiliations.map((affiliation) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: affiliation.name,
    url: affiliation.url,
    ...(affiliation.logo && { logo: `${baseUrl}${affiliation.logo}` }),
  }))

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description,
    ...(profileImage && { image: `${baseUrl}${profileImage}` }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(jobTitle && { jobTitle }),
    ...(organization && {
      worksFor: {
        "@type": "Organization",
        name: organization,
      },
    }),
    ...(affiliations.length > 0 && { memberOf: memberOfArray }),
    url: baseUrl,
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url: baseUrl,
  }

  return (
    <>
      <Script
        id="schema-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {organizationSchemas.map((schema, index) => (
        <Script
          key={`schema-org-${index}`}
          id={`schema-org-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
