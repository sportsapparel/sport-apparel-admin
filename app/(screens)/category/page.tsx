import Loader from "@/components/Loader";
import dynamic from "next/dynamic";

// Dynamic import with loader
const Category = dynamic(() => import("./Category"), {
  loading: () => <Loader />,
});
const page = () => {
  return (
    <>
      <Category />
    </>
  );
};

export default page;
