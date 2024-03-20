import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getPageByIdOrSlug } from "../services/operations/pageAPI";
import Spinner from "../components/common/Spinner";
import parser from "html-react-parser";

const Page = () => {
  const { loading, currentPage } = useSelector((state) => state.page);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      await dispatch(getPageByIdOrSlug(params.id));
    }
    fetchData();
  }, [params.id, dispatch]);

  if (loading) {
    return (
      <div className="w-full h-full min-h-screen grid place-items-center">
        <Spinner className={"!border-black w-10 h-10"} />
      </div>
    );
  }

  return currentPage ? (
    <div className="w-full h-full py-6 px-2 max-w-[1024px] mx-auto">
      <div className="w-full h-full flex flex-col gap-5 py-6 px-2 md:px-4 border rounded-md">
        <div>
          <h1 className="heading md:!text-[40px] mb-6">{currentPage.title}</h1>
          <p className="paragraph">
            Created At: {new Date(currentPage.createdAt).toLocaleDateString()}
          </p>
        </div>
        <h1 className="heading1 ">{currentPage.description}</h1>
        {currentPage?.showAuthor && (
          <div className="flex items-center gap-2 border rounded-md px-6 py-4">
            <img
              src={currentPage?.createdBy?.profileImage}
              alt="Rapid"
              loading="lazy"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col gap-1">
              <h1 className="heading1">
                {currentPage.createdBy?.firstName}{" "}
                {currentPage.createdBy?.lastName}
              </h1>
              <p className="paragraph">{currentPage.createdBy?.email}</p>
            </div>
          </div>
        )}
        <p className="paragraph">{parser(currentPage.content)}</p>

        {currentPage?.attachments.length>0 && (
          <div className="flex items-center gap-2 border rounded-md px-6 py-4">
            {currentPage.attachments.map((attachment, index) => (
              <a
                key={attachment._id}
                href={attachment.url}
                download={`Attachment_${index + 1}`}
              >
                Attachment {index + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="w-full min-h-screen grid place-items-center">
      <h1 className="heading">No page found with this url slug.</h1>
    </div>
  );
};

export default Page;
