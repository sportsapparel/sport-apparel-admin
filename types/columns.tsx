import Image from "next/image";
import { CategoryData, ContactData, ProductData, SubCategoryData } from ".";
import React from "react";

export const CategoryColumn = [
  {
    header: "ID",
    accessor: (item: CategoryData) => item.id,
  },
  {
    header: "NAME",
    accessor: (item: CategoryData) => item.name,
  },
  { header: "DESCRIPTION", accessor: (item: CategoryData) => item.description },
  {
    header: "IMAGE",
    accessor: (item: CategoryData) =>
      item.image ? (
        <Image src={item.image} alt={item.name} height={50} width={50} />
      ) : (
        "No Image"
      ),
  },
  {
    header: "SLUG",
    accessor: (item: CategoryData) => item.slug,
  },
  {
    header: "CREATED AT",
    accessor: (item: CategoryData) => item.createdAt,
  },
];
export const SubCategoryColumn = [
  {
    header: "ID",
    accessor: (item: SubCategoryData) => item.id,
  },
  {
    header: "NAME",
    accessor: (item: SubCategoryData) => item.name,
  },
  {
    header: "DESCRIPTION",
    accessor: (item: SubCategoryData) => item.description,
  },
  {
    header: "IMAGE",
    accessor: (item: SubCategoryData) =>
      item.image ? (
        <Image src={item.image} alt={item.name} height={50} width={50} />
      ) : (
        "No Image"
      ),
  },
  {
    header: "SLUG",
    accessor: (item: SubCategoryData) => item.slug,
  },
  {
    header: "CREATED AT",
    accessor: (item: SubCategoryData) => item.createdAt,
  },
];

export const ProductDatasColumns = [
  {
    header: "ID",
    accessor: (item: ProductData) => item.id,
  },
  {
    header: "Name",
    accessor: (item: ProductData) => item.name,
  },
  {
    header: "Slug",
    accessor: (item: ProductData) => item.slug,
  },
  {
    header: "Description",
    accessor: (item: ProductData) => item.description,
  },
  {
    header: "Details",
    accessor: (item: ProductData) => {
      if (!item.details || Object.keys(item.details).length === 0) {
        return "No details";
      }

      return (
        <div>
          {Object.entries(item.details).map(([key, detail], index) => {
            let content = "";
            if (typeof detail === "string") {
              content = `${key}: ${detail}`;
            } else if (
              typeof detail === "object" &&
              detail.label &&
              detail.value
            ) {
              const value = Array.isArray(detail.value)
                ? detail.value.join(", ")
                : detail.value;
              content = `${detail.label} : ${value}`;
            }

            return content ? (
              <React.Fragment key={key}>
                {index > 0 && <br />}
                {content}
              </React.Fragment>
            ) : null;
          })}
        </div>
      );
    },
  },
  {
    header: "Min Order",
    accessor: (item: ProductData) => item.minOrder || "N/A",
  },
  {
    header: "Delivery Info",
    accessor: (item: ProductData) => item.deliveryInfo || "N/A",
  },
  {
    header: "WhatsApp Number",
    accessor: (item: ProductData) => item.whatsappNumber,
  },
  {
    header: "Is Active",
    accessor: (item: ProductData) => (item.isActive ? "Yes" : "No"),
  },
  {
    header: "Thumbnail",
    accessor: (item: ProductData) =>
      item.thumbnail?.imageUrl ? (
        <Image
          src={item.thumbnail.imageUrl}
          alt={item.thumbnail.originalName || "Product thumbnail"}
          height={50}
          width={50}
        />
      ) : (
        "No Image"
      ),
  },
  {
    header: "Category",
    accessor: (item: ProductData) => item.category.name,
  },
  {
    header: "Category Slug",
    accessor: (item: ProductData) => item.category.slug,
  },
  {
    header: "Subcategory",
    accessor: (item: ProductData) => item.subcategory.name,
  },
  {
    header: "Subcategory Slug",
    accessor: (item: ProductData) => item.subcategory.slug,
  },
  {
    header: "Created At",
    accessor: (item: ProductData) => new Date(item.createdAt).toLocaleString(),
  },
  // New SEO-related columns
  {
    header: "Meta Title",
    accessor: (item: ProductData) => item.metaTitle || "Not Set",
  },
  {
    header: "Meta Description",
    accessor: (item: ProductData) => item.metaDescription || "Not Set",
  },
  {
    header: "Keywords",
    accessor: (item: ProductData) => item.keywords || "Not Set",
  },
  {
    header: "Canonical URL",
    accessor: (item: ProductData) => item.canonicalUrl || "Not Set",
  },
  {
    header: "Structured Data",
    accessor: (item: ProductData) =>
      item.structuredData
        ? JSON.stringify(item.structuredData, null, 2).slice(0, 100) + "..."
        : "Not Set",
  },
];
export const ContactColumns = [
  {
    header: "ID",
    accessor: (item: ContactData) => item.id,
  },
  {
    header: "NAME",
    accessor: (item: ContactData) => item.name,
  },
  {
    header: "EMAIL",
    accessor: (item: ContactData) => item.email,
  },
  {
    header: "SUBJECT",
    accessor: (item: ContactData) => item.subject,
  },
  {
    header: "MESSAGE",
    accessor: (item: ContactData) => item.message,
  },
  {
    header: "CREATED AT",
    accessor: (item: ContactData) =>
      new Date(item.createdAt).toLocaleDateString(),
  },
];
