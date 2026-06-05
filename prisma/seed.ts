import { prisma } from '../src/lib/prisma'

const COMPANIES = [
  { name: 'Google', slug: 'google', industry: 'Technology', hq: 'Mountain View, CA', founded: 1998, size: '100,000+', tier: 'T1' },
  { name: 'Amazon', slug: 'amazon', industry: 'E-commerce', hq: 'Seattle, WA', founded: 1994, size: '1,000,000+', tier: 'T1' },
  { name: 'Meta', slug: 'meta', industry: 'Social Media', hq: 'Menlo Park, CA', founded: 2004, size: '60,000+', tier: 'T1' },
  { name: 'Microsoft', slug: 'microsoft', industry: 'Technology', hq: 'Redmond, WA', founded: 1975, size: '200,000+', tier: 'T1' },
  { name: 'NVIDIA', slug: 'nvidia', industry: 'Semiconductors', hq: 'Santa Clara, CA', founded: 1993, size: '20,000+', tier: 'T1' },
  { name: 'Flipkart', slug: 'flipkart', industry: 'E-commerce', hq: 'Bengaluru, India', founded: 2007, size: '30,000+', tier: 'T2' },
  { name: 'Meesho', slug: 'meesho', industry: 'Social Commerce', hq: 'Bengaluru, India', founded: 2015, size: '5,000+', tier: 'T2' },
  { name: 'Razorpay', slug: 'razorpay', industry: 'Fintech', hq: 'Bengaluru, India', founded: 2014, size: '2,000+', tier: 'T2' },
  { name: 'Zepto', slug: 'zepto', industry: 'Quick Commerce', hq: 'Mumbai, India', founded: 2021, size: '1,000+', tier: 'T2' },
  { name: 'TCS', slug: 'tcs', industry: 'IT Services', hq: 'Mumbai, India', founded: 1968, size: '600,000+', tier: 'T3' },
  { name: 'Infosys', slug: 'infosys', industry: 'IT Services', hq: 'Bengaluru, India', founded: 1981, size: '300,000+', tier: 'T3' },
  { name: 'Wipro', slug: 'wipro', industry: 'IT Services', hq: 'Bengaluru, India', founded: 1945, size: '250,000+', tier: 'T3' },
]

const LOCATIONS = ['Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi']
const ROLES = ['Software Engineer', 'Backend Engineer', 'Frontend Engineer', 'Fullstack Engineer', 'Data Scientist', 'DevOps Engineer']
const LEVELS = ['L3', 'L4', 'L5', 'L6', 'Principal']

function getRandom(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function main() {
  console.log('Clearing database...')
  await prisma.salary.deleteMany({})
  await prisma.company.deleteMany({})

  console.log('Seeding companies...')
  const createdCompanies = await Promise.all(
    COMPANIES.map((c) =>
      prisma.company.create({
        data: {
          name: c.name,
          slug: c.slug,
          industry: c.industry,
          headquarters: c.hq,
          foundedYear: c.founded,
          headcountRange: c.size,
        },
      })
    )
  )

  console.log('Seeding 80 salary records...')
  const salaryPromises = []

  for (let i = 0; i < 80; i++) {
    const companyData = getRandom(COMPANIES)
    const dbCompany = createdCompanies.find((c) => c.slug === companyData.slug)!
    const location = getRandom(LOCATIONS)
    const role = getRandom(ROLES)
    let level = getRandom(LEVELS)
    
    // Ensure at least 3 Principal level records
    if (i < 3) level = 'Principal'
    // Ensure L3/L4 for some
    if (i >= 3 && i < 10) level = 'L3'

    let base = 0, bonus = 0, stock = 0

    if (companyData.tier === 'T1') {
      // FAANG / High Tier
      const multipliers: Record<string, number> = { 'L3': 1, 'L4': 1.5, 'L5': 2.2, 'L6': 3.5, 'Principal': 5 }
      const mult = multipliers[level]
      base = Math.floor((1500000 + Math.random() * 500000) * mult)
      bonus = Math.floor(base * (0.1 + Math.random() * 0.1))
      stock = Math.floor(base * (0.2 + Math.random() * 0.5))

      // Special case: Very high equity (NVIDIA/Meta style)
      if (i === 10 || (companyData.slug === 'nvidia' && Math.random() > 0.7)) {
        stock = base * 2 
      }
    } else if (companyData.tier === 'T2') {
      // Unicorns
      const multipliers: Record<string, number> = { 'L3': 1, 'L4': 1.4, 'L5': 2, 'L6': 3, 'Principal': 4.5 }
      const mult = multipliers[level]
      base = Math.floor((1200000 + Math.random() * 400000) * mult)
      bonus = Math.floor(base * (0.05 + Math.random() * 0.1))
      stock = Math.floor(base * (0.1 + Math.random() * 0.4))

      // Special case: Zero bonus record
      if (i === 20) bonus = 0
    } else {
      // Service Tier
      const multipliers: Record<string, number> = { 'L3': 1, 'L4': 1.8, 'L5': 3, 'L6': 5, 'Principal': 8 }
      const mult = multipliers[level]
      base = Math.floor((400000 + Math.random() * 200000) * mult)
      bonus = Math.floor(base * (0.05 + Math.random() * 0.05))
      stock = 0 // Service companies usually zero stock for most

      // Special case: Zero stock record is already default here, but ensure one specific
      if (i === 30) stock = 0
    }

    salaryPromises.push(
      prisma.salary.create({
        data: {
          role: level === 'Principal' ? `Principal ${role}` : role,
          level,
          location,
          currency: 'INR',
          experienceYears: level === 'L3' ? Math.floor(Math.random() * 3) : level === 'L4' ? 3 + Math.floor(Math.random() * 4) : 7 + Math.floor(Math.random() * 10),
          baseSalary: base,
          bonus: bonus,
          stock: stock,
          totalCompensation: base + bonus + stock,
          companyId: dbCompany.id,
          postedAt: new Date(Date.now() - Math.random() * 10000000000),
        },
      })
    )
  }

  await Promise.all(salaryPromises)
  console.log('Seeding successful!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
