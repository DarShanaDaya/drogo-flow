import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthContext";

export const metadata: Metadata = {
  title: "Drogo Flow – Flow Chart Diagram Maker | Cheaper than MermaidOnline.live",
  description: "Drag & drop + Text + 3D View + Graph + Flow. Export MD, PNG, JPEG, SVG, PDF, Git. Sharable. 60% cheaper than mermaidonline.live. Built with Mermaid JS, Next.js, Vercel hostable.",
  keywords: ["mermaid", "flowchart", "diagram", "drag drop", "3d view", "graph view", "cheap alternative", "mermaidonline.live alternative"],
  openGraph: {
    title: "Drogo Flow – Cheaper Mermaid Diagram Maker",
    description: "$4.9 vs $8.9, $39.9 vs $99.9, $2.9/mo vs $4.9/mo – Same features, better price, plus 3D view",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
