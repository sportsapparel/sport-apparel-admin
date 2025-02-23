import Loader from "@/components/Loader";
import dynamic from "next/dynamic";

// Dynamic import with loader
const Product = dynamic(() => import("./Product"), {
  loading: () => <Loader />,
});
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products  | Sports Apparel",
  description: "Products for the latest sports apparel.",
};

const page = () => {
  return (
    <>
      <Product />
    </>
  );
};

export default page;
