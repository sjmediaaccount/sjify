import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SJify — Web Scraping and Automation Cloud',
  description: 'Run, schedule, publish, and monetize containerized web automation Actors. Integrated MCP server for AI agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07090E] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
