"use client";

import { createClient } from "@/lib/supabase";
import { DataTable } from "@/components/admin/data-table";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { deleteCaseStudy } from "./actions";
import { useEffect, useState } from "react";

interface CaseStudy {
  id: number;
  title: string;
  featured: boolean;
  created_at: string;
}

export default function CaseStudiesAdmin() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

  useEffect(() => {
    async function fetchCaseStudies() {
      const supabase = createClient();
      const { data } = await supabase
        .from("case_studies")
        .select("*")
        .order("created_at", { ascending: false });

      setCaseStudies(data || []);
    }

    fetchCaseStudies();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Case Studies</h1>

      <DataTable
        data={caseStudies}
        columns={[
          {
            key: "title",
            header: "Title",
            cell: (caseStudy) => (
              <Link
                href={`/admin/case-studies/${caseStudy.id}/edit`}
                className="font-medium hover:underline"
              >
                {caseStudy.title}
              </Link>
            ),
          },
          {
            key: "featured",
            header: "Featured",
            cell: (caseStudy) =>
              caseStudy.featured ? (
                <Badge variant="default">Featured</Badge>
              ) : (
                <span className="text-gray-500">-</span>
              ),
          },
          {
            key: "created_at",
            header: "Created",
            cell: (caseStudy) => formatDate(caseStudy.created_at),
          },
        ]}
        createHref="/admin/case-studies/new"
        onDelete={deleteCaseStudy}
      />
    </div>
  );
}
