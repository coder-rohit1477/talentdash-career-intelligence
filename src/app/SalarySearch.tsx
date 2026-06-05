'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SalarySearchProps {
  roles: string[];
  locations: string[];
}

export default function SalarySearch({ roles, locations }: SalarySearchProps) {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (role) params.set('search', role);
    if (location) params.set('location', location);
    // Experience is not yet supported by the salaries page logic, 
    // but we can pass it for future-proofing or ignore it as per constraints.
    router.push(`/salaries?${params.toString()}`);
  };

  const experienceLevels = [
    "0-2 Years",
    "3-5 Years",
    "6-10 Years",
    "10+ Years"
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
      <div className="bg-white p-2 rounded-2xl border border-[#EBEBEB] shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Job Title */}
          <div className="flex flex-col">
            <select
              className="w-full bg-white px-6 py-4 text-sm font-bold text-[#222222] focus:outline-none rounded-xl hover:bg-gray-50 transition-colors appearance-none cursor-pointer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Job Title</option>
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col border-t md:border-t-0 md:border-l border-[#EBEBEB]">
            <select
              className="w-full bg-white px-6 py-4 text-sm font-bold text-[#222222] focus:outline-none rounded-xl hover:bg-gray-50 transition-colors appearance-none cursor-pointer"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Location</option>
              {locations.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div className="flex flex-col border-t md:border-t-0 md:border-l border-[#EBEBEB]">
            <select
              className="w-full bg-white px-6 py-4 text-sm font-bold text-[#222222] focus:outline-none rounded-xl hover:bg-gray-50 transition-colors appearance-none cursor-pointer"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="">Experience</option>
              {experienceLevels.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="p-1">
            <button
              onClick={handleSearch}
              className="w-full h-full bg-[#FF5A5F] hover:bg-[#E04F54] text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-md py-4 md:py-0"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
