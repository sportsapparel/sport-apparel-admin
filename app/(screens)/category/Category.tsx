"use client";
import { PageHeader, Pagination } from "@/components/Common";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { useFetchData } from "@/hooks/useFetchData";
import { useFilteredData } from "@/hooks/useFilteredData";
import { CategoryData } from "@/types";
import { CategoryColumn } from "@/types/columns";
import Button from "@/components/Button";
import CreateCategoryForm from "@/components/Forms/CreateCategoryForm";
import IconModalButton from "@/components/IconModalButton";
import SearchBar from "@/components/SearchBar";
import { fetchCatgoriesData } from "@/lib/apiFuntions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CategoryPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const headerActions = (
    <>
      <Button className="rounded" onClick={() => setIsOpen(true)}>
        Add New Category <span className="fa fa-plus"></span>
      </Button>
    </>
  );

  const {
    data: categories,
    loading,
    refetch,
  } = useFetchData<CategoryData[]>(fetchCatgoriesData);
  const {
    filteredData: filterCategoryData,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,

    totalPages,
  } = useFilteredData<CategoryData>(categories || [], {
    searchKeys: ["name", "slug"],

    itemsPerPage: 5,
  });
  const actions = (item: CategoryData) => (
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
          title="List of Categories"
          description="Here you can access your Categories and add them. "
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
          <CreateCategoryForm refetch={refetch} setIsOpen={setIsOpen} />
        </Modal>
      </main>
    </>
  );
};

export default CategoryPage;
