"use client";
import { Pagination } from "@/components/Common";
import DataTable from "@/components/DataTable";
import CreateCategoryForm from "@/components/Forms/CreateCategoryForm";
import IconModalButton from "@/components/IconModalButton";
import Modal from "@/components/Modal";
import SearchBar from "@/components/SearchBar";
import { useFetchData } from "@/hooks/useFetchData";
import { useFilteredData } from "@/hooks/useFilteredData";
import { DeleteContactById, fetchContactData } from "@/lib/apiFuntions";
import { ContactData } from "@/types";
import { ContactColumns } from "@/types/columns";
import { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  // const headerActions = (
  //   <>
  //     <Button className="rounded" onClick={() => setIsOpen(true)}>
  //       Add New Category <span className="fa fa-plus"></span>
  //     </Button>
  //   </>
  // );

  const {
    data: categories,
    loading,
    refetch,
  } = useFetchData<ContactData[]>(fetchContactData);
  const {
    filteredData: filterCategoryData,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,

    totalPages,
  } = useFilteredData<ContactData>(categories || [], {
    searchKeys: ["name", "slug"],

    itemsPerPage: 5,
  });

  const DeleteContact = async (id: number) => {
    try {
      setIsDeleteLoading(true);
      const res = await DeleteContactById(id);
      toast.success(res.data.message);
      setIsDeleteLoading(false);
      await refetch();
      console.log(res);
    } catch (error) {
      setIsDeleteLoading(false);
      toast.error((error as any) || "Internal Server Error");
      console.log(error);
    }
  };
  const actions = (item: ContactData) => (
    <div className="space-x-2 ">
      <IconModalButton
        // buttonText="Save"
        buttonIcon={
          <>
            <div className="border border-textColor rounded-full p-1">
              <i className="fa fa-trash p-1 text-textColor"></i>
            </div>
          </>
        } // Custom icon
        modalTitle="Confirm Delete"
        modalMessage="Are you sure you want to Delete?"
        onSave={() => DeleteContact(item.id)}
        loading={isDeleteLoading}
        // bypassModal={true} // Bypass the modal
      />
    </div>
  );

  return (
    <>
      <main className="space-y-4">
        {/* <PageHeader
          title="List of Categories"
          description="Here you can access your Categories and add them. "
          actions={headerActions}
        /> */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search..."
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
          columns={ContactColumns}
          data={filterCategoryData}
          loading={loading || isDeleteLoading}
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

export default Contact;
