import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const company = searchParams.get("company");
    const location = searchParams.get("location");
    const level = searchParams.get("level");
    const sort = searchParams.get("sort") || "newest";

    const where: any = {};

    if (search) {
      where.OR = [
        { role: { contains: search, mode: "insensitive" } },
        { company: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (company) {
      where.company = { name: company };
    }

    if (location) {
      where.location = location;
    }

    if (level) {
      where.level = level;
    }

    let orderBy: any = { postedAt: "desc" };
    if (sort === "highest") {
      orderBy = { totalCompensation: "desc" };
    } else if (sort === "lowest") {
      orderBy = { totalCompensation: "asc" };
    }

    const salaries = await prisma.salary.findMany({
      where,
      include: {
        company: true,
      },
      orderBy,
    });

    return NextResponse.json(salaries);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
