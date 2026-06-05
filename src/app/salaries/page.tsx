import { prisma } from "@/lib/prisma";
import Link from "next/link";
import FilterToolbar from "./FilterToolbar";
import { Prisma } from "@prisma/client";

export default async function SalariesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const company = typeof params.company === 'string' ? params.company : undefined;
  const location = typeof params.location === 'string' ? params.location : undefined;
  const level = typeof params.level === 'string' ? params.level : undefined;
  const sort = typeof params.sort === 'string' ? params.sort : 'newest';

  // Build Prisma where clause
  const where: Prisma.SalaryWhereInput = {};

  if (search) {
    where.OR = [
      { role: { contains: search, mode: 'insensitive' } },
      { company: { name: { contains: search, mode: 'insensitive' } } },
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

  // Build Prisma orderBy
  let orderBy: Prisma.SalaryOrderByWithRelationInput = { postedAt: 'desc' };
  if (sort === 'highest') {
    orderBy = { totalCompensation: 'desc' };
  } else if (sort === 'lowest') {
    orderBy = { totalCompensation: 'asc' };
  } else if (sort === 'newest') {
    orderBy = { postedAt: 'desc' };
  }

  // Fetch unique values for filters
  const [uniqueCompaniesData, uniqueLocationsData, uniqueLevelsData] = await Promise.all([
    prisma.company.findMany({
      select: { name: true },
      distinct: ['name'],
      orderBy: { name: 'asc' },
    }),
    prisma.salary.findMany({
      select: { location: true },
      distinct: ['location'],
      where: { location: { not: null } },
      orderBy: { location: 'asc' },
    }),
    prisma.salary.findMany({
      select: { level: true },
      distinct: ['level'],
      where: { level: { not: null } },
      orderBy: { level: 'asc' },
    }),
  ]);

  const companies = uniqueCompaniesData.map(c => c.name);
  const locations = uniqueLocationsData.map(s => s.location).filter(Boolean) as string[];
  const levels = uniqueLevelsData.map(s => s.level).filter(Boolean) as string[];

  // Fetch filtered salaries
  const salaries = await prisma.salary.findMany({
    where,
    include: {
      company: true,
    },
    orderBy,
  });

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#222222] tracking-tight">Salary Explorer</h1>
        </div>

        <FilterToolbar 
          companies={companies}
          locations={locations}
          levels={levels}
        />

        <div className="mb-4">
          <p className="text-sm font-medium text-[#484848]">
            Showing {salaries.length} salary {salaries.length === 1 ? 'record' : 'records'}
          </p>
        </div>
        
        {salaries.length > 0 ? (
          <div className="bg-white shadow-sm overflow-hidden sm:rounded-lg border border-[#EBEBEB]">
            <ul className="divide-y divide-[#EBEBEB]">
              {salaries.map((salary) => (
                <li key={salary.id}>
                  <div className="px-4 py-6 sm:px-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                          {salary.role}
                        </p>
                        <Link 
                          href={`/companies/${salary.company.slug}`}
                          className="text-xl font-bold text-[#222222] hover:underline mt-1"
                        >
                          {salary.company.name}
                        </Link>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                        <p className="px-4 py-2 text-2xl font-bold text-[#222222] bg-gray-50 rounded-lg border border-[#EBEBEB]">
                          ${salary.totalCompensation.toLocaleString()}
                        </p>
                        <p className="mt-2 text-xs font-semibold text-[#484848] uppercase tracking-wider">
                          Total TC • {salary.experienceYears} YOE • {salary.level}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 sm:flex sm:justify-between items-end">
                      <div className="text-sm text-[#484848] font-medium">
                        <div className="flex space-x-6">
                          <span>Base: <span className="text-[#222222]">${salary.baseSalary.toLocaleString()}</span></span>
                          <span>Bonus: <span className="text-[#222222]">${salary.bonus.toLocaleString()}</span></span>
                          <span>Stock: <span className="text-[#222222]">${salary.stock.toLocaleString()}</span></span>
                        </div>
                        <p className="mt-2 flex items-center">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs border border-[#EBEBEB]">{salary.location || 'Remote'}</span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-xs font-medium text-[#717171] sm:mt-0">
                        <p>
                          Posted on {new Date(salary.postedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-lg border border-dashed border-[#EBEBEB]">
            <p className="text-[#484848] text-lg font-medium">No salary records match the selected filters.</p>
            <Link 
              href="/salaries"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-bold underline underline-offset-4"
            >
              Clear all filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
