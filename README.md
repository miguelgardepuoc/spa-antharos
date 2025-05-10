# Antharos Human Resources Platform

## Overview

Antharos is a comprehensive human resources platform built with React, TypeScript, and Vite. The platform serves two main purposes:

1. **External portal** for job seekers to browse positions and submit applications
2. **Internal portal** for employees with role-based access (Employee, Department Head, Company Management)

## Features

### External Portal

- Browse job offers
- Apply to positions with resume/CV upload

### Internal Portal

**Employee Access**
- Browse job offers

**Department Head Access**
- Manage job offers of department (posting, editing and removing)
- Manage candidates
- Manage employees of department

**Company Management Access**
- Manage job offers (posting, editing and removing)
- Manage employees
- Manage departments
- Access comprehensive people analytics with company statistics

## Technology Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **State Management**: React Hooks (useState, useEffect) and Context API
- **Styling**: CSS
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/miguelgardepuoc/spa-antharos
cd antharos

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
# Build the application
npm run build
# or
yarn build
```

## Role-Based Access Control

Antharos implements role-based access control with the following roles:

- `CANDIDATE`: External job applicants
- `EMPLOYEE`: Basic staff members
- `DEPARTMENT_HEAD`: Managers of specific departments
- `COMPANY_MANAGEMENT`: Executive-level management

Each role has progressively more access to system features.