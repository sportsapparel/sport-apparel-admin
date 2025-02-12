import axios from "axios";

export const fetchGallaryData = async () => {
  try {
    const response = await axios.get("/api/gallery");
    console.log("====================================");
    console.log(response, "galleryData");
    console.log("====================================");
    return response.data;
  } catch (error) {
    console.error("Error fetching gallery data:", error);
    throw new Error("Failed to fetch gallery data");
  }
};
export const deleteImages = async ({ imageUrls }: { imageUrls: string[] }) => {
  try {
    const response = await axios.delete("/api/gallery", {
      data: { imageUrls }, // Send payload in the `data` field
    });
    return response;
  } catch (error) {
    console.error("Error deleting images:", error);
    throw new Error("Failed to delete images");
  }
};
export const deleteAllImages = async () => {
  try {
    const response = await axios.delete("/api/gallery", {
      data: { deleteAll: true }, // Send payload in the `data` field
    });
    return response;
  } catch (error) {
    console.error("Error deleting all images:", error);
    throw new Error("Failed to delete all images");
  }
};
// export const fetchCatgoriesData = async () => {};
export const fetchCatgoriesData = async () => {
  try {
    const res = await axios.get("/api/category", {
      headers: {
        cache: "no-store",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching categories data:", error);
    throw new Error("Failed to fetch categories data");
  }
};
export const fetchSubCatgoriesDataByCategoryId = async (id: number) => {
  try {
    const res = await axios.get(`/api/subcategories/${id}`, {
      headers: {
        cache: "no-store",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching categories data:", error);
    throw new Error("Failed to fetch categories data");
  }
};

// export const fetchCatgoriesData = async () => {};
export const fetchProducts = async () => {
  try {
    const res = await axios.get("/api/products", {
      headers: {
        cache: "no-store",
      },
    });
    return res.data.products;
  } catch (error) {
    console.error("Error fetching categories data:", error);
    throw new Error("Failed to fetch categories data");
  }
};
