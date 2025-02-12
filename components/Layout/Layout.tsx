"use client";
import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { MobileSidebar } from "./MobileSidebar";
import { navigation, teams, userNavigation } from "./navigationItems";
import { Sidebar } from "./Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <MobileSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigation={navigation}
          teams={teams}
        />

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <Sidebar navigation={navigation} teams={teams} />
        </div>

        <div className="lg:pl-72">
          <Header
            userNavigation={userNavigation}
            onSidebarOpen={() => setSidebarOpen(true)}
          />

          <main className="py-10">
            <div
              suppressHydrationWarning
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
