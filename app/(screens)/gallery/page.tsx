import Loader from "@/components/Loader";
import dynamic from "next/dynamic";

// Dynamic import with loader
const Gallery = dynamic(() => import("./Gallery"), {
  loading: () => <Loader />,
});
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery  | Sports Apparel",
  description: "Gallery for the latest sports apparel.",
};

const page = () => {
  return (
    <>
      <Gallery />
    </>
  );
};

export default page;
