"use client";
import Button from "@/components/Button";
import { PageHeader, Pagination } from "@/components/Common";
import DataTable from "@/components/DataTable";
import SubCategoryFrom from "@/components/Forms/CreateSubCategoryForm";
import IconModalButton from "@/components/IconModalButton";
import Modal from "@/components/Modal";
import SearchBar from "@/components/SearchBar";
import { useFetchData } from "@/hooks/useFetchData";
import { useFilteredData } from "@/hooks/useFilteredData";
import { fetchSubCatgoriesDataByCategoryId } from "@/lib/apiFuntions";
import { SubCategoryData } from "@/types";
import { CategoryColumn } from "@/types/columns";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

const CategoryPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  const router = useRouter();
  const headerActions = (
    <>
      <Button className="rounded" onClick={() => setIsOpen(true)}>
        Add New Sub Category <span className="fa fa-plus"></span>
      </Button>
    </>
  );

  const fetchSubCatgories = useMemo(() => {
    if (typeof id === "string") {
      return () => fetchSubCatgoriesDataByCategoryId(Number(id));
    }
    return null;
  }, [id]);

  const {
    data: subcategories = {} as SubCategoryData,
    loading,
    // error,
    refetch,
  } = useFetchData<SubCategoryData>(
    fetchSubCatgories ?? (() => Promise.reject(new Error("Invalid user ID")))
  );
  const handleRefetch = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to refetch data:", error);
    }
  }, [refetch]);
  const {
    filteredData: filterCategoryData,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,

    totalPages,
  } = useFilteredData<SubCategoryData>(
    Array.isArray(subcategories) ? subcategories : [],
    {
      searchKeys: ["name", "slug"],

      itemsPerPage: 5,
    }
  );
  const actions = (item: SubCategoryData) => (
    <div className="space-x-2 ">
      <IconModalButton
        // buttonText="Save"
        buttonIcon={
          <>
            <div className="border border-textColor rounded-full p-1">
              <i className="fa fa-eye p-1 text-textColor"></i>
            </div>
          </>
        } // Custom icon
        modalTitle="Confirm Update"
        modalMessage="Are you sure you want to update?"
        onSave={() => router.push(`/sub-categories/${item?.id}`)}
        loading={false}
        bypassModal={true} // Bypass the modal
      />
    </div>
  );

  return (
    <>
      <main className="space-y-4">
        <PageHeader
          title="List of Sub Categories"
          description="Here you can access your Sub Categories and add them. "
          actions={headerActions}
        />
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name , slug"
          // filters={[
          //   {
          //     key: "name",
          //     options: filterOptions.contractType,
          //     placeholder: "All Types",
          //   },
          // ]}
          // selectedFilters={selectedFilters}
          // onFilterChange={setFilter}
        />

        <DataTable
          columns={CategoryColumn}
          data={filterCategoryData}
          loading={loading}
          actions={actions}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Optional Title"
          maxWidth="max-w-2xl"
        >
          <SubCategoryFrom
            refetch={handleRefetch}
            setIsOpen={setIsOpen}
            categoryId={Number(id)}
          />
        </Modal>
      </main>
    </>
  );
};

export default CategoryPage;
