# **App Name**: Agafarma Tuparendi

## Core Features:

- Google Authentication: Secure user authentication using Firebase Authentication with Google Sign-In, restricted to two specific Gmail accounts.
- Access Control: Validation of user email against a whitelist, stored in `src/config/authorized-emails.ts`, to ensure only authorized users gain access.
- Dashboard: Main dashboard accessible after login, featuring a sidebar menu for navigation between different sections.
- PDF Generation: Generate PDF documents for judicial budgets, expired processes, and returns, incorporating the Agafarma logo, date/time of generation, and user's name, using jsPDF and html2canvas.
- Protected Routes: Implement route protection to redirect unauthenticated users to the login page and unauthorized users to the access denied page.

## Style Guidelines:

- Primary color: Deep blue (#1A237E) to convey trust and reliability, fitting for a financial application. This will contrast nicely in a light color scheme.
- Background color: Light grayish-blue (#E8EAF6), a desaturated version of the primary color for a calm, professional backdrop.
- Accent color: Muted purple (#7B1FA2), an analogous hue, to draw attention to key interactive elements.
- Font: 'Inter', a sans-serif font that looks modern, machined, objective, and neutral.
- Use clear, minimalist icons for the sidebar buttons, each representing its respective page (judicial budget, expired items, returns).
- Header with Agafarma logo on the left and the app title ('Agafarma Tuparendi') beside it, maintaining a clean and straightforward design.
- Subtle loading animations during PDF generation and page transitions to enhance user experience.