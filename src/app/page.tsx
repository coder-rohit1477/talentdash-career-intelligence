import { prisma } from "@/lib/prisma";
import Link from "next/link";

const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default async function Home() {
  // Fetch statistics
  const [salaryCount, companyCount, maxTCResult, maxExpResult] = await Promise.all([
    prisma.salary.count(),
    prisma.company.count(),
    prisma.salary.aggregate({
      _max: {
        totalCompensation: true,
      },
    }),
    prisma.salary.aggregate({
      _max: {
        experienceYears: true,
      },
    }),
  ]);

  // Fetch featured companies
  const featuredCompanies = await prisma.company.findMany({
    take: 8,
    include: {
      salaries: {
        select: {
          totalCompensation: true,
        },
      },
    },
    orderBy: {
      salaries: {
        _count: 'desc',
      },
    },
  });

  const processedCompanies = featuredCompanies.map(company => {
    const avgTC = company.salaries.length > 0
      ? company.salaries.reduce((acc, curr) => acc + curr.totalCompensation, 0) / company.salaries.length
      : 0;
    
    return {
      ...company,
      avgTC,
      salaryCount: company.salaries.length,
    };
  });

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Hero Section */}
      <div className="bg-white border-b border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#222222]">
            Salary Intelligence <br />
            <span className="text-[#FF5A5F]">For Tech Professionals</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-[#484848] font-medium">
            Anonymous, verified compensation data from top tech companies. 
            Know your market value and negotiate with confidence.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/salaries"
              className="px-8 py-4 bg-[#FF5A5F] hover:bg-[#E04F54] text-white text-lg font-bold rounded-lg transition-colors shadow-md"
            >
              Explore Salaries
            </Link>
            <Link
              href="/compare"
              className="px-8 py-4 bg-white border-2 border-[#EBEBEB] text-[#222222] hover:bg-gray-50 text-lg font-bold rounded-lg transition-colors"
            >
              Compare Companies
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-xl border border-[#EBEBEB] shadow-lg">
            <span className="text-[10px] font-bold text-[#717171] uppercase tracking-widest mb-2 block">Total Salary Records</span>
            <span className="text-3xl font-bold text-[#222222]">{salaryCount.toLocaleString()}</span>
          </div>
          <div className="bg-white p-8 rounded-xl border border-[#EBEBEB] shadow-lg">
            <span className="text-[10px] font-bold text-[#717171] uppercase tracking-widest mb-2 block">Total Companies</span>
            <span className="text-3xl font-bold text-[#222222]">{companyCount.toLocaleString()}</span>
          </div>
          <div className="bg-white p-8 rounded-xl border border-[#EBEBEB] shadow-lg">
            <span className="text-[10px] font-bold text-[#717171] uppercase tracking-widest mb-2 block">Highest Total Comp</span>
            <span className="text-3xl font-bold text-emerald-600">{formatINR(maxTCResult._max.totalCompensation || 0)}</span>
          </div>
          <div className="bg-white p-8 rounded-xl border border-[#EBEBEB] shadow-lg">
            <span className="text-[10px] font-bold text-[#717171] uppercase tracking-widest mb-2 block">Max Experience</span>
            <span className="text-3xl font-bold text-[#222222]">{maxExpResult._max.experienceYears || 0} YOE</span>
          </div>
        </div>
      </div>

      {/* Featured Companies Section */}
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#222222] tracking-tight">Featured Companies</h2>
            <p className="text-[#484848] font-medium mt-2">Explore compensation trends at top-tier organizations.</p>
          </div>
          <Link href="/salaries" className="text-[#FF5A5F] font-bold hover:underline underline-offset-4">
            View all companies →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processedCompanies.map((company) => (
            <div key={company.id} className="bg-white rounded-xl border border-[#EBEBEB] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-[#222222] mb-1">{company.name}</h3>
                <p className="text-sm font-medium text-[#717171] mb-6">{company.industry}</p>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#484848] uppercase tracking-widest block mb-1">Avg. Total Comp</span>
                    <span className="text-lg font-bold text-emerald-600">{formatINR(company.avgTC)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#484848] uppercase tracking-widest block mb-1">Salary Records</span>
                    <span className="text-sm font-bold text-[#222222]">{company.salaryCount} Records</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-[#EBEBEB] bg-gray-50/50 rounded-b-xl">
                <Link 
                  href={`/companies/${company.slug}`}
                  className="block w-full text-center py-2 text-sm font-bold text-[#FF5A5F] hover:text-[#E04F54] transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
