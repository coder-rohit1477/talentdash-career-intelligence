'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

interface FilterToolbarProps {
  companies: string[];
  locations: string[];
  levels: string[];
}

export default function FilterToolbar({ companies, locations, levels }: FilterToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '');

  useEffect(() => {
    setSearchValue(searchParams.get('search') ?? '');
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`);
  };

  const handleClearFilters = () => {
    router.push(pathname);
    setSearchValue('');
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    handleFilterChange('search', searchValue);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBEBEB] mb-6">
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Search Input */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="search" className="text-xs font-bold text-[#484848] uppercase tracking-wider">Search</label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Role or Company..."
              className="w-full border-2 border-[#EBEBEB] rounded-md px-3 py-2 text-sm text-[#222222] placeholder:text-[#717171] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onBlur={() => handleSearchSubmit()}
            />
          </div>
        </div>

        {/* Company Dropdown */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="company" className="text-xs font-bold text-[#484848] uppercase tracking-wider">Company</label>
          <select
            id="company"
            className="w-full border-2 border-[#EBEBEB] rounded-md px-3 py-2 text-sm text-[#222222] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            value={searchParams.get('company') ?? ''}
            onChange={(e) => handleFilterChange('company', e.target.value)}
          >
            <option value="" className="text-[#222222]">All Companies</option>
            {companies.map((company) => (
              <option key={company} value={company} className="text-[#222222]">{company}</option>
            ))}
          </select>
        </div>

        {/* Location Dropdown */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="location" className="text-xs font-bold text-[#484848] uppercase tracking-wider">Location</label>
          <select
            id="location"
            className="w-full border-2 border-[#EBEBEB] rounded-md px-3 py-2 text-sm text-[#222222] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            value={searchParams.get('location') ?? ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          >
            <option value="" className="text-[#222222]">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location} className="text-[#222222]">{location}</option>
            ))}
          </select>
        </div>

        {/* Level Dropdown */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="level" className="text-xs font-bold text-[#484848] uppercase tracking-wider">Level</label>
          <select
            id="level"
            className="w-full border-2 border-[#EBEBEB] rounded-md px-3 py-2 text-sm text-[#222222] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            value={searchParams.get('level') ?? ''}
            onChange={(e) => handleFilterChange('level', e.target.value)}
          >
            <option value="" className="text-[#222222]">All Levels</option>
            {levels.map((level) => (
              <option key={level} value={level} className="text-[#222222]">{level}</option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="sort" className="text-xs font-bold text-[#484848] uppercase tracking-wider">Sort By</label>
          <select
            id="sort"
            className="w-full border-2 border-[#EBEBEB] rounded-md px-3 py-2 text-sm text-[#222222] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            value={searchParams.get('sort') ?? 'newest'}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <option value="newest" className="text-[#222222]">Newest</option>
            <option value="highest" className="text-[#222222]">Highest Total Compensation</option>
            <option value="lowest" className="text-[#222222]">Lowest Total Compensation</option>
          </select>
        </div>
      </form>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleClearFilters}
          className="text-sm text-[#484848] hover:text-[#222222] font-bold underline underline-offset-4 flex items-center"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
