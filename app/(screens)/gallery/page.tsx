import Loader from "@/components/Loader";
import dynamic from "next/dynamic";

// Dynamic import with loader
const Gallery = dynamic(() => import("./Gallery"), {
  loading: () => <Loader />,
});
const page = () => {
  return (
    <>
      <Gallery />
    </>
  );
};

export default page;
