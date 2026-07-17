import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthContext";

export const metadata: Metadata = {
  title: "Drogo Flow — Visual Diagram Builder",
  description: "Build beautiful flowcharts with drag-and-drop, code editing, 3D visualization, and more. Export to PNG, SVG, PDF, and Markdown.",
  keywords: ["flowchart", "diagram", "mermaid", "drag and drop", "3d visualization", "flow builder"],
  openGraph: {
    title: "Drogo Flow — Visual Diagram Builder",
    description: "Build beautiful flowcharts with drag-and-drop, code editing, 3D visualization, and full export support.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
