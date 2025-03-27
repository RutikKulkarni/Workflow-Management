# Workflow Management System

This is a simple Workflow Management System built to demonstrate front-end development skills using Next.js, TypeScript, and Tailwind CSS. The app fetches workflow data from an external API and provides a clean, modern UI for managing workflows. User authentication is handled using localStorage, ensuring persistence across sessions.

## Key Features

- **Login & Persistent Authentication:** Users log in once, and session data is stored in localStorage for automatic authentication.
- **Workflow Management:** Fetches workflow data from an external API and displays it in a structured table with pagination.
- **Search Functionality:** Allows users to search workflows by name or ID.
- **Responsive UI:** Styled with Tailwind CSS for a sleek and modern look.

## Technologies Used

- **Next.js 14:** React framework with App Router for routing and SSR.
- **TypeScript:** For type-safe development.
- **Tailwind CSS:** For utility-first styling.
- **localStorage:** For persisting user authentication.
- **API:** Fetching workflow data from [Beeceptor API](https://workflows.free.beeceptor.com/data).

## Live URL

The app is deployed at:
**https://workflow-management-system.vercel.app**

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RutikKulkarni/Workflow-Management/
   cd Workflow-Management
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Visit `/login` to enter credentials.
- After login, you’ll be redirected to the home page (`/`), where workflow data is displayed.
- Search workflows by name or ID using the search bar.
- Pagination allows navigating through multiple workflow entries.
- Authentication persists via localStorage, so users stay logged in even after a page refresh.
