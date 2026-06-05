import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SalarySearch from "./SalarySearch";

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

  // Fetch unique roles and locations for search dropdowns
  const [uniqueRolesData, uniqueLocationsData] = await Promise.all([
    prisma.salary.findMany({
      select: { role: true },
      distinct: ['role'],
      orderBy: { role: 'asc' },
    }),
    prisma.salary.findMany({
      select: { location: true },
      distinct: ['location'],
      where: { location: { not: null } },
      orderBy: { location: 'asc' },
    }),
  ]);

  const roles = uniqueRolesData.map(s => s.role);
  const locations = uniqueLocationsData.map(s => s.location).filter(Boolean) as string[];

  // Fetch featured companies
  const featuredCompaniesResult = await prisma.company.findMany({
    include: {
      salaries: {
        select: {
          totalCompensation: true,
          role: true,
        },
      },
    },
  });

  const processedCompanies = featuredCompaniesResult.map(company => {
    const avgTC = company.salaries.length > 0
      ? company.salaries.reduce((acc, curr) => acc + curr.totalCompensation, 0) / company.salaries.length
      : 0;
    
    // Get unique roles (up to 3)
    const roles = Array.from(new Set(company.salaries.map(s => s.role))).slice(0, 3);
    
    return {
      ...company,
      avgTC,
      salaryCount: company.salaries.length,
      roles,
    };
  })
  .sort((a, b) => b.avgTC - a.avgTC)
  .slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Hero Section */}
      <div className="bg-white border-b border-[#EBEBEB] pb-24">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#222222]">
            Salary Intelligence <br />
            <span className="text-[#FF5A5F]">For Tech Professionals</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-[#484848] font-medium leading-relaxed">
            Anonymous, verified compensation data from top tech companies. <br className="hidden md:block" />
            Know your market value and negotiate with confidence.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/salaries"
              className="px-8 py-4 bg-[#FF5A5F] hover:bg-[#E04F54] text-white text-lg font-bold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Explore Salaries
            </Link>
            <Link
              href="/compare"
              className="px-8 py-4 bg-white border-2 border-[#EBEBEB] text-[#222222] hover:bg-gray-50 text-lg font-bold rounded-lg transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Compare Companies
            </Link>
          </div>
        </div>
      </div>

      <SalarySearch roles={roles} locations={locations} />

      {/* Trending Searches Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mt-4">
          <p className="text-xs font-bold text-[#717171] uppercase tracking-[0.2em] mb-4">Trending Searches</p>
          <div className="flex flex-wrap justify-center items-center gap-3 max-w-4xl mx-auto">
            {[
              { label: "Software Engineer", href: "/salaries?search=Software+Engineer" },
              { label: "Data Scientist", href: "/salaries?search=Data+Scientist" },
              { label: "Product Manager", href: "/salaries?search=Product+Manager" },
              { label: "Backend Engineer", href: "/salaries?search=Backend+Engineer" },
              { label: "Frontend Engineer", href: "/salaries?search=Frontend+Engineer" },
              { label: "DevOps Engineer", href: "/salaries?search=DevOps+Engineer" },
              { label: "Machine Learning Engineer", href: "/salaries?search=Machine+Learning+Engineer" },
              { label: "Remote Jobs", href: "/salaries?location=Remote" },
            ].map((tag) => (
              <Link
                key={tag.label}
                href={tag.href}
                className="px-6 py-2 bg-white border border-[#EBEBEB] rounded-full text-xs font-bold text-[#484848] hover:border-[#FF5A5F] hover:text-[#FF5A5F] hover:shadow-sm transition-all whitespace-nowrap"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-10 rounded-2xl border border-[#EBEBEB] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
            <span className="text-[11px] font-extrabold text-[#717171] uppercase tracking-[0.2em] mb-4">Total Records</span>
            <span className="text-5xl font-black text-[#222222]">{salaryCount.toLocaleString()}</span>
            <span className="text-xs font-bold text-[#484848] mt-2 opacity-60">Verified Submissions</span>
          </div>
          <div className="bg-white p-10 rounded-2xl border border-[#EBEBEB] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
            <span className="text-[11px] font-extrabold text-[#717171] uppercase tracking-[0.2em] mb-4">Top Companies</span>
            <span className="text-5xl font-black text-[#222222]">{companyCount.toLocaleString()}</span>
            <span className="text-xs font-bold text-[#484848] mt-2 opacity-60">Global Tech Network</span>
          </div>
          <div className="bg-white p-10 rounded-2xl border border-[#EBEBEB] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
            <span className="text-[11px] font-extrabold text-[#717171] uppercase tracking-[0.2em] mb-4">Highest TC</span>
            <span className="text-4xl font-black text-emerald-600 truncate max-w-full">{formatINR(maxTCResult._max.totalCompensation || 0)}</span>
            <span className="text-xs font-bold text-[#484848] mt-2 opacity-60">Annual Benchmark</span>
          </div>
          <div className="bg-white p-10 rounded-2xl border border-[#EBEBEB] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
            <span className="text-[11px] font-extrabold text-[#717171] uppercase tracking-[0.2em] mb-4">Max Experience</span>
            <span className="text-5xl font-black text-[#222222]">{maxExpResult._max.experienceYears || 0}</span>
            <span className="text-xs font-bold text-[#484848] mt-2 opacity-60">Years of Expertise</span>
          </div>
        </div>
      </div>

      {/* Featured Companies Section */}
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-[#222222] tracking-tight">Featured Companies</h2>
            <p className="text-[#484848] text-lg font-medium mt-2">Explore elite compensation data from global tech leaders.</p>
          </div>
          <Link 
            href="/salaries" 
            className="group flex items-center text-[#FF5A5F] font-bold hover:text-[#E04F54] transition-colors"
          >
            Explore all companies 
            <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {processedCompanies.map((company) => (
            <div key={company.id} className="group bg-white rounded-2xl border border-[#EBEBEB] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-2">
              <div className="p-8 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#222222] group-hover:text-[#FF5A5F] transition-colors">{company.name}</h3>
                    <p className="text-xs font-extrabold text-[#717171] uppercase tracking-[0.1em] mt-1">{company.industry}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#484848] uppercase tracking-widest block mb-2">Avg. Total Comp</span>
                    <span className="text-2xl font-black text-emerald-600">{formatINR(company.avgTC)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-[#484848] uppercase tracking-widest block mb-2">Common Roles</span>
                    <div className="flex flex-wrap gap-2">
                      {company.roles.map(role => (
                        <span key={role} className="px-2 py-1 bg-gray-50 border border-[#EBEBEB] rounded text-[10px] font-bold text-[#484848]">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-[#EBEBEB] bg-gray-50/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#717171] uppercase tracking-tighter">{company.salaryCount} Verified Records</span>
                </div>
                <Link 
                  href={`/companies/${company.slug}`}
                  className="block w-full text-center py-4 bg-white border-2 border-[#EBEBEB] hover:border-[#FF5A5F] hover:text-[#FF5A5F] rounded-xl text-sm font-bold text-[#222222] transition-all"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-[#EBEBEB] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-[#222222] tracking-tight mb-8">
            Ready to explore compensation insights?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/salaries"
              className="px-10 py-4 bg-[#FF5A5F] hover:bg-[#E04F54] text-white text-lg font-bold rounded-lg transition-all shadow-md"
            >
              Explore Salaries
            </Link>
            <Link
              href="/compare"
              className="px-10 py-4 bg-white border-2 border-[#EBEBEB] text-[#222222] hover:bg-gray-50 text-lg font-bold rounded-lg transition-all"
            >
              Compare Companies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
