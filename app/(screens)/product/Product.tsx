"use client";
import Button from "@/components/Button";
import { PageHeader, Pagination } from "@/components/Common";
import DataTable from "@/components/DataTable";
import IconModalButton from "@/components/IconModalButton";
import SearchBar from "@/components/SearchBar";
import { useFetchData } from "@/hooks/useFetchData";
import { useFilteredData } from "@/hooks/useFilteredData";
import { fetchProducts } from "@/lib/apiFuntions";
import { ProductData } from "@/types";
import { ProductDatasColumns } from "@/types/columns";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProductPage = () => {
  const router = useRouter();

  const headerActions = (
    <Button className="rounded" onClick={() => router.push("/product/create")}>
      Add New Product <span className="fa fa-plus"></span>
    </Button>
  );

  const {
    data: products,
    loading,
    error,
    refetch,
  } = useFetchData<ProductData[]>(fetchProducts);

  const {
    filteredData: filterProductData,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    totalPages,
  } = useFilteredData<ProductData>(products || [], {
    searchKeys: ["name", "slug", "category.name", "subcategory.name"],
    itemsPerPage: 5,
  });
  const [isLoading, setisLoading] = useState(false);
  const DeleteProduct = async (productId: string) => {
    try {
      setisLoading(true);
      const response = await axios.delete(`/api/products/${productId}`);
      console.log(response);
      refetch();
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
      console.log(error);
    }
  };

  const actions = (item: ProductData) => (
    <div className="space-x-2">
      <IconModalButton
        buttonIcon={
          <div className="border border-textColor rounded-full p-1">
            <i className="fa fa-eye p-1 text-textColor"></i>
          </div>
        }
        modalTitle="View Product Details"
        modalMessage="View details for this product?"
        onSave={() => router.push(`/product/${item.id}`)}
        loading={isLoading}
        bypassModal={true}
      />
      <IconModalButton
        buttonIcon={
          <div className="border border-textColor rounded-full p-1">
            <i className="fa fa-trash p-1 text-textColor"></i>
          </div>
        }
        modalTitle="Delete Product"
        modalMessage="Are you sure you want to delete this product?"
        onSave={() => DeleteProduct(item.id)}
        loading={isLoading}
      />
    </div>
  );

  return (
    <main className="space-y-4">
      <PageHeader
        title="List of Products"
        description="Here you can view and manage your products."
        actions={headerActions}
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by name, slug, category, or subcategory"
      />

      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded">
          Error loading products: {error.message}
        </div>
      )}

      <DataTable
        columns={ProductDatasColumns}
        data={filterProductData}
        loading={loading}
        actions={actions}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
};

export default ProductPage;
