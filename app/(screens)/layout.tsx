import type { Metadata } from "next";
import Layout from "@/components/Layout/Layout";

export const metadata: Metadata = {
  title: "Dashboard | Sports Apparel",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
