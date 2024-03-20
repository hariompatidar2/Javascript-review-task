import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../services/operations/authAPI";
import { deletePage, getAllPages } from "../services/operations/pageAPI";
import CTAButton from "../components/common/CTAButton";
import Input from "../components/common/Input";
import Spinner from "../components/common/Spinner";
import { formatDate } from "../utils/formatDate";
import Button from "../components/common/Button";
import { BsThreeDots } from "react-icons/bs";
import { setCurrentPage } from "../slices/pageSlice";
import { useNavigate } from "react-router-dom";

const AllPages = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const { token, allUsers } = useSelector((state) => state.auth);
  const { allPages, loading } = useSelector((state) => state.page);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllUsers(token));
    dispatch(getAllPages({}));
  }, [dispatch, token]);

  const onSubmit = (data) => {
    dispatch(getAllPages(data));
  };

  const handleEdit = async (id, index) => {
    await dispatch(setCurrentPage(allPages[index]));
    navigate(`/editPage/${id}`);
  };
  const handleDelete = async (id) => {
    await dispatch(deletePage(id, token));
  };

  return (
    <div className="w-full h-full">
      {/* Header Section */}
      <div className="flex justify-between items-center py-6 px-8 gap-2 flex-wrap border-b">
        <div className="flex flex-col gap-2 max-md:ml-7">
          <h1 className="heading1">Pages</h1>
          <p className="paragraph">Create and publish pages.</p>
        </div>
        <CTAButton
          link={"/createPage"}
          text={"+ Add Page"}
          className="max-w-max flex items-center justify-center"
        />
      </div>

      {/* Search and Filters */}
      <div className="w-full h-full p-6 flex flex-col gap-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex gap-2 flex-wrap justify-between">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Search"
                divClassName="!m-0 w-[240px] md:w-[360px]"
                labelClassName="!p-0"
                {...register("search")}
              />
              <p className="paragraph px-4">{allPages.length} records</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="w-fit paragraph" htmlFor={"status"}>
                  Status
                </label>
                <select
                  className="max-w-max p-2 rounded-lg outline-none bg-white"
                  id={"status"}
                  name={"status"}
                  {...register("status")}
                  defaultValue={"all"}
                >
                  <option value={"all"}>All</option>
                  <option value={"Draft"}>Draft</option>
                  <option value={"Scheduled"}>Scheduled</option>
                  <option value={"Published"}>Published</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-fit paragraph" htmlFor={"createdBy"}>
                  Created By
                </label>
                <select
                  className=" p-2 rounded-lg outline-none bg-white"
                  id={"createdBy"}
                  name={"createdBy"}
                  {...register("createdBy")}
                  defaultValue={"all"}
                >
                  <option value={"all"}>All</option>
                  {allUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit">Apply</Button>
            </div>
          </div>
        </form>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="w-full h-full grid place-items-center">
          <Spinner className={"!border-black w-10 h-10"} />
        </div>
      ) : allPages.length ? (
        <div className="w-full h-full px-6">
          <table className="min-w-full ">
            <thead>
              <tr className="border-b">
                <th className="table-heading">Title</th>
                <th className="table-heading">URL</th>
                <th className="table-heading">Created By</th>
                <th className="table-heading">Created At</th>
                <th className="table-heading">Modified By</th>
                <th className="table-heading">Modified At</th>
                <th className="table-heading">Status</th>
              </tr>
            </thead>
            <tbody>
              {allPages.map((page, index) => (
                <tr key={page?._id} className="border-b">
                  <td className="table-data flex gap-2 justify-between items-center pr-2 group/item ">
                    {page?.title}{" "}
                    <div className="relative group/edit">
                      <BsThreeDots className="w-10 h-10 p-2 border rounded-lg invisible group-hover/item:visible" />
                      <div className="border rounded bg-white absolute top-[40px] right-3 invisible group-hover/edit:visible">
                        <p
                          className="paragraph border-b py-2 pl-3 pr-4 hover:bg-[#EEF2FF] cursor-pointer"
                          onClick={() => handleEdit(page._id, index)}
                        >
                          Edit
                        </p>
                        <p
                          className="text-[#DC2626] py-2 pl-3 pr-4 hover:bg-[#EEF2FF] cursor-pointer"
                          onClick={() => handleDelete(page._id)}
                        >
                          Delete
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="table-data">{page?.slug}</td>
                  <td className="table-data">
                    {page?.createdBy?.firstName} {page?.createdBy?.lastName}
                  </td>
                  <td className="table-data">{formatDate(page?.createdAt)}</td>
                  <td className="table-data">
                    {page?.updatedBy?.firstName} {page?.updatedBy?.lastName}
                  </td>
                  <td className="table-data">{formatDate(page?.updatedAt)}</td>
                  <td className="py-[13px] text-sm font-medium">
                    <p
                      className={`py-1 px-2 rounded max-w-max ${
                        page?.status === "Draft"
                          ? "text-[#D97706] bg-[#FFFBEB]"
                          : page?.status === "Scheduled"
                          ? "text-[#2563EB] bg-[#EFF6FF]"
                          : page?.status === "Published"
                          ? "text-[#059669] bg-[#ECFDF5]"
                          : ""
                      }`}
                    >
                      {page?.status}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="paragraph text-center">No records found.</p>
      )}
    </div>
  );
};

export default AllPages;
