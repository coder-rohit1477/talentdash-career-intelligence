'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Company {
  id: string;
  name: string;
  slug: string;
}

interface CompanySelectorProps {
  companies: Company[];
}

export default function CompanySelector({ companies }: CompanySelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [companyA, setCompanyA] = useState(searchParams.get('a') || '');
  const [companyB, setCompanyB] = useState(searchParams.get('b') || '');

  // Set defaults if not present
  useEffect(() => {
    if (!searchParams.get('a') && !searchParams.get('b')) {
      const google = companies.find(c => c.name.toLowerCase() === 'google')?.slug || '';
      const amazon = companies.find(c => c.name.toLowerCase() === 'amazon')?.slug || '';
      setCompanyA(google);
      setCompanyB(amazon);
    }
  }, [companies, searchParams]);

  const handleCompare = () => {
    if (companyA && companyB) {
      router.push(`/compare?a=${companyA}&b=${companyB}`);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-[#EBEBEB] mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        {/* Company A */}
        <div className="flex flex-col space-y-3">
          <label htmlFor="companyA" className="text-xs font-bold text-[#484848] uppercase tracking-wider">Company A</label>
          <select
            id="companyA"
            className="w-full border-2 border-[#EBEBEB] rounded-md px-4 py-3 text-base text-[#222222] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-medium"
            value={companyA}
            onChange={(e) => setCompanyA(e.target.value)}
          >
            <option value="" disabled>Select first company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.slug} className="text-[#222222]">
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Company B */}
        <div className="flex flex-col space-y-3">
          <label htmlFor="companyB" className="text-xs font-bold text-[#484848] uppercase tracking-wider">Company B</label>
          <select
            id="companyB"
            className="w-full border-2 border-[#EBEBEB] rounded-md px-4 py-3 text-base text-[#222222] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-medium"
            value={companyB}
            onChange={(e) => setCompanyB(e.target.value)}
          >
            <option value="" disabled>Select second company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.slug} className="text-[#222222]">
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleCompare}
          disabled={!companyA || !companyB}
          className="px-12 py-3 bg-[#FF5A5F] hover:bg-[#E04F54] text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-lg"
        >
          Compare
        </button>
      </div>
    </div>
  );
}
