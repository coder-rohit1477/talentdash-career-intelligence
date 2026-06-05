# TalentDash Career Intelligence Platform

A full-stack salary intelligence platform built for the TalentDash Engineering Trial Task.

The platform enables professionals to explore compensation trends, compare leading technology companies, and analyze salary data across different experience levels, locations, and organizations.

---

## Live Demo

Deployment link : https://talentdash-career-intelligence-12k5j9dob.vercel.app/

---

## Project Overview

TalentDash provides a centralized platform for compensation intelligence.

Users can:

* Explore salary records across top technology companies
* Compare compensation metrics between companies
* Analyze company-specific salary trends
* View compensation breakdowns (Base, Bonus, Stock)
* Explore level-based salary distributions

The application is powered by PostgreSQL and Prisma ORM with dynamic data fetching throughout the platform.

---

## Features

### Homepage

* Salary intelligence focused landing page
* Dynamic platform statistics
* Featured company showcase
* Direct navigation to company profiles

### Salary Explorer

* Search salary records
* Filter by company
* Filter by location
* Filter by experience level
* Compensation sorting
* Dynamic salary listings

### Company Details

* Company profile information
* Average total compensation
* Highest total compensation
* Lowest total compensation
* Salary record counts
* Level distribution analytics
* Company-specific salary explorer

### Company Comparison

* Side-by-side company comparison
* Compensation analytics
* Winner identification
* Compensation insights
* Experience comparison

---

## API Endpoints

### GET /api/salaries

Returns all salary records.

Example:

GET /api/salaries

---

### GET /api/companies/[slug]

Returns company details and associated salary information.

Example:

GET /api/companies/google

---

### GET /api/compare

Compares two companies using query parameters.

Example:

GET /api/compare?a=google&b=amazon

---

## Tech Stack

### Frontend

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS

### Backend

* Next.js Route Handlers
* Prisma ORM

### Database

* PostgreSQL (Neon)

### Deployment

* Vercel

---

## Database Design

### Company

Fields:

* id
* name
* slug
* industry
* headquarters
* foundedYear
* headcountRange

### Salary

Fields:

* role
* level
* location
* experienceYears
* baseSalary
* bonus
* stock
* totalCompensation

Relationships:

* One Company → Many Salary Records

---

## Seed Data

The database contains:

* 12 Technology Companies
* 80 Salary Records
* Multiple Experience Levels
* Multiple Locations
* Multiple Compensation Structures

Companies Included:

* Google
* Amazon
* Meta
* Microsoft
* NVIDIA
* Flipkart
* Meesho
* Razorpay
* Zepto
* TCS
* Infosys
* Wipro

---

## Architecture Decisions

### Why Next.js App Router

Next.js App Router was selected for modern routing, server-side rendering capabilities, and simplified data fetching.

### Why Prisma ORM

Prisma provides type-safe database access and a clean developer experience while working with PostgreSQL.

### Why PostgreSQL

A relational model fits compensation analytics naturally because salary records are strongly associated with companies.

### Why Dynamic Routes

Dynamic company pages allow each company profile to be generated from database data without creating individual pages manually.

### Why API Route Handlers

API route handlers separate presentation logic from data access and provide a reusable backend layer.

---

## Trade-Offs

Given the trial task timeline, the implementation prioritized:

* End-to-end functionality
* Compensation analytics
* Company comparison
* Database integration
* Responsive UI

The following were intentionally excluded:

* Authentication
* Salary submission workflows
* User profiles
* Advanced caching
* Real-time updates

---

## Local Development Setup

### 1. Clone Repository

git clone <repository-url>

cd talentdash-career-intelligence

### 2. Install Dependencies

npm install

### 3. Configure Environment Variables

Create a .env file:

DATABASE_URL=your_neon_database_url

### 4. Generate Prisma Client

npx prisma generate

### 5. Run Migrations

npx prisma migrate deploy

### 6. Seed Database

npx prisma db seed

### 7. Start Development Server

npm run dev

---

## Production Verification

The application has been verified using:

* npm run build
* npm run start

Both commands execute successfully.

---

## Future Improvements

* User authentication
* Salary submission workflows
* Advanced search
* Compensation trend visualizations
* Company benchmarking dashboards
* Saved comparisons

---

## Author

Rohit Kumar Yadav

Full Stack Developer Candidate
