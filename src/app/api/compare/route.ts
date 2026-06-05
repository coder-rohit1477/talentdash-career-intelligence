import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slugA = searchParams.get("a");
    const slugB = searchParams.get("b");

    if (!slugA || !slugB) {
      return NextResponse.json({ error: "Please provide two company slugs (a and b)" }, { status: 400 });
    }

    if (slugA === slugB) {
      return NextResponse.json({ error: "Please provide two different companies" }, { status: 400 });
    }

    const [companyA, companyB] = await Promise.all([
      prisma.company.findUnique({
        where: { slug: slugA },
        include: { salaries: true },
      }),
      prisma.company.findUnique({
        where: { slug: slugB },
        include: { salaries: true },
      }),
    ]);

    if (!companyA || !companyB) {
      return NextResponse.json({ error: "One or both companies not found" }, { status: 404 });
    }

    const getMetrics = (company: any) => {
      const salaries = company.salaries;
      const count = salaries.length;
      const avgTC = count > 0 ? salaries.reduce((acc: number, s: any) => acc + s.totalCompensation, 0) / count : 0;
      const maxTC = count > 0 ? Math.max(...salaries.map((s: any) => s.totalCompensation)) : 0;
      const minTC = count > 0 ? Math.min(...salaries.map((s: any) => s.totalCompensation)) : 0;
      const avgExp = count > 0 ? salaries.reduce((acc: number, s: any) => acc + s.experienceYears, 0) / count : 0;

      return {
        id: company.id,
        name: company.name,
        slug: company.slug,
        industry: company.industry,
        avgTC,
        maxTC,
        minTC,
        count,
        avgExp,
      };
    };

    return NextResponse.json({
      companyA: getMetrics(companyA),
      companyB: getMetrics(companyB),
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
