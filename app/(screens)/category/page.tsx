import Loader from "@/components/Loader";
import dynamic from "next/dynamic";

// Dynamic import with loader
const Category = dynamic(() => import("./Category"), {
  loading: () => <Loader />,
});
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Category | Sports Apparel",
  description: "Category for the latest sports apparel.",
};

const page = () => {
  return (
    <>
      <Category />
    </>
  );
};

export default page;
