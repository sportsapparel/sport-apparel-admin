"use client";
import { InfoCard, PageHeader } from "@/components/Common";
import { Stat } from "@/components/Layout/types";
import Loader from "@/components/Loader";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchDashboardStats } from "@/lib/apiFuntions";
import dynamic from "next/dynamic";
import Head from "next/head";

// Dynamic import with loader
const Contact = dynamic(() => import("./Contact"), {
  loading: () => <Loader />,
});

const Page = () => {
  const { data: stats, loading } = useFetchData<Stat[]>(fetchDashboardStats);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {loading
          ? // Render 5 skeleton loaders
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="bg-white/70 rounded-2xl p-6 shadow-md transition-shadow duration-200 hover:shadow-lg flex gap-3 text-wrap space-y-2"
              >
                <div className="animate-pulse flex gap-3">
                  {/* Icon Skeleton */}
                  <div className="h-8 w-8 bg-gray-300 rounded-full"></div>

                  <div className="flex flex-col space-y-2">
                    {/* Label Skeleton */}
                    <div className="h-4 w-20 bg-gray-300 rounded-md"></div>
                    {/* Value Skeleton */}
                    <div className="h-8 w-28 bg-gray-300 rounded-md"></div>
                  </div>
                </div>
              </div>
            ))
          : stats?.map((stat, index) => (
              <InfoCard
                key={index}
                label={stat?.label || ""}
                value={stat?.value || 0}
                icon={stat.icon}
                isLoading={loading}
              />
            ))}
      </div>

      <PageHeader title="Contact Messages" />
      {/* Contact Form */}
      <Contact />
    </>
  );
};

export default Page;
