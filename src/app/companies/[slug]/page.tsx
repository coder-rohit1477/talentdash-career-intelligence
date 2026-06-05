import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      salaries: {
        orderBy: {
          totalCompensation: 'desc',
        },
      },
    },
  });

  if (!company) {
    notFound();
  }

  const count = company.salaries.length;
  const avgTC = count > 0 ? company.salaries.reduce((acc, curr) => acc + curr.totalCompensation, 0) / count : 0;
  const maxTC = count > 0 ? Math.max(...company.salaries.map(s => s.totalCompensation)) : 0;
  const minTC = count > 0 ? Math.min(...company.salaries.map(s => s.totalCompensation)) : 0;

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Company Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#EBEBEB] p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex-grow">
              <h1 className="text-5xl font-bold text-[#222222] tracking-tight">{company.name}</h1>
              <p className="text-xl font-medium text-[#484848] mt-2">{company.industry}</p>
              
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                  <span className="font-bold block text-[#717171] uppercase text-[10px] tracking-widest mb-1">Headquarters</span>
                  <span className="text-[#222222] font-semibold">{company.headquarters || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-bold block text-[#717171] uppercase text-[10px] tracking-widest mb-1">Founded</span>
                  <span className="text-[#222222] font-semibold">{company.foundedYear || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-bold block text-[#717171] uppercase text-[10px] tracking-widest mb-1">Headcount</span>
                  <span className="text-[#222222] font-semibold">{company.headcountRange || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-[#EBEBEB] shadow-sm">
            <span className="text-[10px] font-bold text-[#484848] uppercase tracking-widest mb-2 block">Avg. Total Comp</span>
            <span className="text-2xl font-bold text-[#222222]">{formatINR(avgTC)}</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#EBEBEB] shadow-sm">
            <span className="text-[10px] font-bold text-[#484848] uppercase tracking-widest mb-2 block">Highest Total Comp</span>
            <span className="text-2xl font-bold text-[#222222]">{formatINR(maxTC)}</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#EBEBEB] shadow-sm">
            <span className="text-[10px] font-bold text-[#484848] uppercase tracking-widest mb-2 block">Lowest Total Comp</span>
            <span className="text-2xl font-bold text-[#222222]">{formatINR(minTC)}</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#EBEBEB] shadow-sm">
            <span className="text-[10px] font-bold text-[#484848] uppercase tracking-widest mb-2 block">Salary Records</span>
            <span className="text-2xl font-bold text-[#222222]">{count} Salary Records</span>
          </div>
        </div>

        {/* Level Distribution Section */}
        <div className="bg-white p-8 rounded-xl border border-[#EBEBEB] shadow-sm mb-12">
          <h3 className="text-xl font-bold text-[#222222] mb-6 tracking-tight">Level Distribution</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {['L3', 'L4', 'L5', 'L6', 'Principal'].map((levelName) => {
              const levelCount = company.salaries.filter(s => s.level === levelName).length;
              const percentage = count > 0 ? (levelCount / count) * 100 : 0;
              
              return (
                <div key={levelName} className="flex flex-col">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-[#222222]">{levelName}</span>
                    <span className="text-xs font-bold text-[#717171]">{levelCount} {levelCount === 1 ? 'record' : 'records'}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-[#FF5A5F] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-[#484848] mt-2 uppercase tracking-widest">
                    {percentage.toFixed(1)}% of total
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#222222] tracking-tight">Salaries at {company.name}</h2>
          <p className="text-[#484848] font-medium mt-1">Detailed breakdown of roles and compensation packages.</p>
        </div>
        
        <div className="bg-white shadow-sm overflow-hidden rounded-xl border border-[#EBEBEB]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#EBEBEB]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#484848] uppercase tracking-widest">Role & Level</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#484848] uppercase tracking-widest">Experience</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#484848] uppercase tracking-widest">Base / Bonus / Stock</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#484848] uppercase tracking-widest">Total Comp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#EBEBEB]">
                {company.salaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#222222]">{salary.role}</div>
                      <div className="text-xs font-semibold text-[#717171] mt-0.5">{salary.level} • {salary.location || 'Remote'}</div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-bold text-[#222222]">{salary.experienceYears} YOE</td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-[#484848]">
                      <div className="flex gap-3">
                        <span>{formatINR(salary.baseSalary)}</span>
                        <span className="text-gray-300">|</span>
                        <span>{formatINR(salary.bonus)}</span>
                        <span className="text-gray-300">|</span>
                        <span>{formatINR(salary.stock)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-bold text-emerald-600">
                      {formatINR(salary.totalCompensation)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
