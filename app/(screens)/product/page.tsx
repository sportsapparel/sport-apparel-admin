import Loader from "@/components/Loader";
import dynamic from "next/dynamic";

// Dynamic import with loader
const Product = dynamic(() => import("./Product"), {
  loading: () => <Loader />,
});
const page = () => {
  return (
    <>
      <Product />
    </>
  );
};

export default page;
