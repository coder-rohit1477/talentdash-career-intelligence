import { prisma } from "@/lib/prisma";
import CompanySelector from "./CompanySelector";
import Link from "next/link";

interface ComparisonMetrics {
  name: string;
  industry: string | null;
  avgTC: number;
  maxTC: number;
  minTC: number;
  count: number;
  avgExp: number;
}

const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const slugA = typeof params.a === 'string' ? params.a : undefined;
  const slugB = typeof params.b === 'string' ? params.b : undefined;

  const companiesList = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  let comparisonData: [ComparisonMetrics, ComparisonMetrics] | null = null;
  let error: string | null = null;

  if (slugA && slugB) {
    if (slugA === slugB) {
      error = "Please select two different companies.";
    } else {
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

      if (companyA && companyB) {
        const getMetrics = (company: any): ComparisonMetrics => {
          const salaries = company.salaries;
          const count = salaries.length;
          const avgTC = count > 0 ? salaries.reduce((acc: number, s: any) => acc + s.totalCompensation, 0) / count : 0;
          const maxTC = count > 0 ? Math.max(...salaries.map((s: any) => s.totalCompensation)) : 0;
          const minTC = count > 0 ? Math.min(...salaries.map((s: any) => s.totalCompensation)) : 0;
          const avgExp = count > 0 ? salaries.reduce((acc: number, s: any) => acc + s.experienceYears, 0) / count : 0;

          return {
            name: company.name,
            industry: company.industry,
            avgTC,
            maxTC,
            minTC,
            count,
            avgExp,
          };
        };

        comparisonData = [getMetrics(companyA), getMetrics(companyB)];
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#222222] tracking-tight">Compare Companies</h1>
          <p className="text-[#484848] mt-2 font-medium">Select two companies to compare compensation packages, levels, and benefits side-by-side.</p>
        </div>

        <CompanySelector companies={companiesList} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 font-medium">
            {error}
          </div>
        )}

        {comparisonData ? (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-[#EBEBEB] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#EBEBEB]">
                      <th className="py-6 px-8 text-left text-xs font-bold text-[#484848] uppercase tracking-wider w-1/3">Metric</th>
                      <th className="py-6 px-8 text-center text-xl font-bold text-[#222222] w-1/3 border-x border-[#EBEBEB]">
                        <div className="flex flex-col items-center gap-2">
                          {comparisonData[0].name}
                          {comparisonData[0].avgTC > comparisonData[1].avgTC && (
                            <div className="flex flex-col items-center">
                              <div className="bg-[#FF5A5F] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                                🏆 Top Paying
                              </div>
                              <span className="text-[9px] text-[#FF5A5F] font-bold mt-1 uppercase tracking-tighter">
                                Highest Average Compensation
                              </span>
                            </div>
                          )}
                        </div>
                      </th>
                      <th className="py-6 px-8 text-center text-xl font-bold text-[#222222] w-1/3">
                        <div className="flex flex-col items-center gap-2">
                          {comparisonData[1].name}
                          {comparisonData[1].avgTC > comparisonData[0].avgTC && (
                            <div className="flex flex-col items-center">
                              <div className="bg-[#FF5A5F] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                                🏆 Top Paying
                              </div>
                              <span className="text-[9px] text-[#FF5A5F] font-bold mt-1 uppercase tracking-tighter">
                                Highest Average Compensation
                              </span>
                            </div>
                          )}
                        </div>
                      </th>

                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBEBEB]">
                    {/* Industry */}
                    <tr>
                      <td className="py-6 px-8 text-sm font-bold text-[#484848] bg-gray-50/30">Industry</td>
                      <td className="py-6 px-8 text-center text-sm font-medium text-[#222222] border-x border-[#EBEBEB]">{comparisonData[0].industry || 'N/A'}</td>
                      <td className="py-6 px-8 text-center text-sm font-medium text-[#222222]">{comparisonData[1].industry || 'N/A'}</td>
                    </tr>
                    {/* Avg TC */}
                    <tr>
                      <td className="py-6 px-8 text-sm font-bold text-[#484848] bg-gray-50/30">Avg. Total Comp</td>
                      <td className={`py-6 px-8 text-center text-lg font-bold border-x border-[#EBEBEB] ${comparisonData[0].avgTC > comparisonData[1].avgTC ? 'text-green-600 bg-green-50/30' : 'text-[#222222]'}`}>
                        {formatINR(comparisonData[0].avgTC)}
                      </td>
                      <td className={`py-6 px-8 text-center text-lg font-bold ${comparisonData[1].avgTC > comparisonData[0].avgTC ? 'text-green-600 bg-green-50/30' : 'text-[#222222]'}`}>
                        {formatINR(comparisonData[1].avgTC)}
                      </td>
                    </tr>
                    {/* Max TC */}
                    <tr>
                      <td className="py-6 px-8 text-sm font-bold text-[#484848] bg-gray-50/30">Highest TC</td>
                      <td className={`py-6 px-8 text-center text-lg font-bold border-x border-[#EBEBEB] ${comparisonData[0].maxTC > comparisonData[1].maxTC ? 'text-blue-600 bg-blue-50/30' : 'text-[#222222]'}`}>
                        {formatINR(comparisonData[0].maxTC)}
                      </td>
                      <td className={`py-6 px-8 text-center text-lg font-bold ${comparisonData[1].maxTC > comparisonData[0].maxTC ? 'text-blue-600 bg-blue-50/30' : 'text-[#222222]'}`}>
                        {formatINR(comparisonData[1].maxTC)}
                      </td>
                    </tr>
                    {/* Min TC */}
                    <tr>
                      <td className="py-6 px-8 text-sm font-bold text-[#484848] bg-gray-50/30">Lowest TC</td>
                      <td className="py-6 px-8 text-center text-lg font-bold text-[#222222] border-x border-[#EBEBEB]">{formatINR(comparisonData[0].minTC)}</td>
                      <td className="py-6 px-8 text-center text-lg font-bold text-[#222222]">{formatINR(comparisonData[1].minTC)}</td>
                    </tr>
                    {/* Records */}
                    <tr>
                      <td className="py-6 px-8 text-sm font-bold text-[#484848] bg-gray-50/30">Salary Records</td>
                      <td className="py-6 px-8 text-center text-sm font-bold text-[#222222] border-x border-[#EBEBEB]">{comparisonData[0].count}</td>
                      <td className="py-6 px-8 text-center text-sm font-bold text-[#222222]">{comparisonData[1].count}</td>
                    </tr>
                    {/* Avg Exp */}
                    <tr>
                      <td className="py-6 px-8 text-sm font-bold text-[#484848] bg-gray-50/30">Avg. Experience</td>
                      <td className="py-6 px-8 text-center text-sm font-bold text-[#222222] border-x border-[#EBEBEB]">{comparisonData[0].avgExp.toFixed(1)} YOE</td>
                      <td className="py-6 px-8 text-center text-sm font-bold text-[#222222]">{comparisonData[1].avgExp.toFixed(1)} YOE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comparison Insights */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-[#222222] mb-6">Comparison Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avg TC Difference */}
                <div className="bg-white p-6 rounded-xl border border-[#EBEBEB] shadow-sm">
                  <p className="text-xs font-bold text-[#484848] uppercase tracking-wider mb-2">Average TC Difference</p>
                  <p className="text-[#222222] font-medium">
                    {comparisonData[0].avgTC !== comparisonData[1].avgTC ? (
                      <>
                        <span className="font-bold text-[#222222]">
                          {comparisonData[0].avgTC > comparisonData[1].avgTC ? comparisonData[0].name : comparisonData[1].name}
                        </span>
                        {" pays "}
                        <span className="font-bold text-green-600">
                          {formatINR(Math.abs(comparisonData[0].avgTC - comparisonData[1].avgTC))}
                        </span>
                        {" more on average than "}
                        <span className="font-bold text-[#222222]">
                          {comparisonData[0].avgTC > comparisonData[1].avgTC ? comparisonData[1].name : comparisonData[0].name}
                        </span>.
                      </>
                    ) : (
                      "Both companies have the same average total compensation."
                    )}
                  </p>
                </div>

                {/* Highest TC Difference */}
                <div className="bg-white p-6 rounded-xl border border-[#EBEBEB] shadow-sm">
                  <p className="text-xs font-bold text-[#484848] uppercase tracking-wider mb-2">Highest TC Difference</p>
                  <p className="text-[#222222] font-medium">
                    {comparisonData[0].maxTC !== comparisonData[1].maxTC ? (
                      <>
                        <span className="font-bold text-[#222222]">
                          {comparisonData[0].maxTC > comparisonData[1].maxTC ? comparisonData[0].name : comparisonData[1].name}
                        </span>
                        {"'s highest compensation is "}
                        <span className="font-bold text-blue-600">
                          {formatINR(Math.abs(comparisonData[0].maxTC - comparisonData[1].maxTC))}
                        </span>
                        {" higher."}
                      </>
                    ) : (
                      "Both companies have the same highest total compensation."
                    )}
                  </p>
                </div>

                {/* Salary Record Difference */}
                <div className="bg-white p-6 rounded-xl border border-[#EBEBEB] shadow-sm">
                  <p className="text-xs font-bold text-[#484848] uppercase tracking-wider mb-2">Salary Record Difference</p>
                  <p className="text-[#222222] font-medium">
                    {comparisonData[0].count !== comparisonData[1].count ? (
                      <>
                        <span className="font-bold text-[#222222]">
                          {comparisonData[0].count > comparisonData[1].count ? comparisonData[0].name : comparisonData[1].name}
                        </span>
                        {" has "}
                        <span className="font-bold text-[#222222]">
                          {Math.abs(comparisonData[0].count - comparisonData[1].count)}
                        </span>
                        {` more salary ${Math.abs(comparisonData[0].count - comparisonData[1].count) === 1 ? 'record' : 'records'}.`}
                      </>
                    ) : (
                      "Both companies have the same number of salary records."
                    )}
                  </p>
                </div>

                {/* Experience Difference */}
                <div className="bg-white p-6 rounded-xl border border-[#EBEBEB] shadow-sm">
                  <p className="text-xs font-bold text-[#484848] uppercase tracking-wider mb-2">Experience Difference</p>
                  <p className="text-[#222222] font-medium">
                    {comparisonData[0].avgExp !== comparisonData[1].avgExp ? (
                      <>
                        <span className="font-bold text-[#222222]">
                          {comparisonData[0].avgExp > comparisonData[1].avgExp ? comparisonData[0].name : comparisonData[1].name}
                        </span>
                        {"'s employees have "}
                        <span className="font-bold text-[#222222]">
                          {Math.abs(comparisonData[0].avgExp - comparisonData[1].avgExp).toFixed(1)}
                        </span>
                        {" more years of experience on average."}
                      </>
                    ) : (
                      "Both companies have the same average experience years."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : !error && (
          <div className="bg-white p-16 text-center rounded-xl border border-dashed border-[#EBEBEB] shadow-sm">
            <div className="max-w-md mx-auto">
              <p className="text-[#484848] text-xl font-bold mb-2">Ready to compare?</p>
              <p className="text-[#717171] font-medium">Select two companies above and click the Compare button to see their detailed compensation breakdown side-by-side.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
