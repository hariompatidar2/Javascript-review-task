import React from "react";
import { Link } from "react-router-dom";

const PageCard = ({ page }) => {
  return (
    <Link
      to={`/pages/${page?.slug}`}
      className="flex flex-col justify-between gap-2 border rounded-lg px-4 py-6 w-full md:w-[350px]"
    >
      <div className="flex flex-col gap-2">
        <h1 className="heading1">
          {page?.title.length > 50 ? page?.title.substring(0, 50) : page?.title}
        </h1>
        <p className="paragraph">
          {page?.description.length > 200
            ? page?.description.substring(0, 200)
            : page?.description}
        </p>
      </div>
      {page?.showAuthor && (
        <div className="flex items-center gap-2 border rounded-md px-6 py-4">
          <img
            src={page?.createdBy?.profileImage}
            alt="Rapid"
            loading="lazy"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col gap-1">
            <h1 className="heading1">
              {page.createdBy?.firstName} {page.createdBy?.lastName}
            </h1>
            <p className="paragraph">{page.createdBy?.email}</p>
          </div>
        </div>
      )}
    </Link>
  );
};

export default PageCard;
