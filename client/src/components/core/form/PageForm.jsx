import { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import Button from "../../common/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../../common/Input";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  createPage,
  deletePage,
  getPageByIdOrSlug,
  updatePage,
} from "../../../services/operations/pageAPI";
import PublishModal from "../../common/PublishModal";

const toolbarOptions = [
  [{ header: "1" }, { header: "2" }, { font: [] }],
  [{ size: [] }],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  ["link", "image", "video"],
  ["clean"],
];

const PageForm = ({ isUpdate }) => {
  const { register, handleSubmit, formState, setValue,getValues } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { loading, currentPage } = useSelector((state) => state.page);
  const [attachments, setAttachments] = useState([]);
  const dispatch = useDispatch();
  // const [body, setBody] = useState("");
  const params = useParams();
  const [publishModal, setPublishModal] = useState(false);

  useEffect(() => {
    const setData = async () => {
      if (isUpdate && !currentPage) {
        await dispatch(getPageByIdOrSlug(params.id));
      }
    };
    setData();

    if (isUpdate && currentPage) {
      setValue("title", currentPage.title);
      setValue("description", currentPage.description);
      setValue("slug", currentPage.slug);
      setValue("showAuthor", currentPage.showAuthor);
      // setBody(currentPage.content);
      setValue("content", currentPage.content);
      setAttachments(() => currentPage.attachments);
    }
  }, [isUpdate, currentPage]);

  const handleCancel = () => {
    navigate(-1);
  };

  const submit = async (data) => {
    if (isUpdate) {
      if (!data.attachments) {
        data.attachments = currentPage.attachments;
      }
      await dispatch(updatePage(currentPage._id, data, navigate, token));
    } else {
      await dispatch(createPage(data, navigate, token));
    }
  };

  const handleEditorChange = (content) => {
    setValue("content", content);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
    setValue("attachments", [...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
    setValue("attachments", newAttachments);
  };

  const deletePageHandler = async () => {
    await dispatch(deletePage(currentPage._id, token));
    navigate(-1);
  };

  const handlePublish = () => {
    setPublishModal((prev) => !prev);
  };

  const handlePreview = () => {
    navigate("/pages/" + currentPage.slug);
  };

  return (
    <div className="w-full h-full">
      <form onSubmit={handleSubmit(submit)}>
        {/* top section  */}
        <div className="flex justify-between py-6 px-8 gap-2 flex-wrap border-b">
          <div className="flex items-center gap-2 max-md:ml-7">
            <h1 className="heading1">
              {isUpdate ? "Edit Page" : "Create Page"}
            </h1>
            <p
              className={`py-1 px-2 rounded max-w-max  ${
                currentPage?.status === "Scheduled"
                  ? "text-[#2563EB] bg-[#EFF6FF]"
                  : currentPage?.status === "Published"
                  ? "text-[#059669] bg-[#ECFDF5]"
                  : "text-[#D97706] bg-[#FFFBEB]"
              }`}
            >
              {isUpdate && currentPage?.status ? currentPage?.status : "Draft"}
            </p>
          </div>
          <div className="flex gap-4">
            {isUpdate && (
              <div className="border rounded-md p-2 cursor-pointer group relative">
                <BsThreeDots className="w-6 h-6" />
                <div className="border rounded bg-white absolute top-[40px] right-2 invisible group-hover:visible">
                  <p
                    className="paragraph border-b py-2 pl-3 pr-4 hover:bg-[#EEF2FF] cursor-pointer"
                    onClick={handlePreview}
                  >
                    Preview
                  </p>
                  <p
                    className="paragraph !text-[#DC2626] py-2 pl-3 pr-4 hover:bg-[#EEF2FF] cursor-pointer"
                    onClick={() => deletePageHandler()}
                  >
                    Delete
                  </p>
                </div>
              </div>
            )}

            <Button
              className="bg-transparent hover:bg-transparent border !text-[#201F37]"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isUpdate ? "Update" : "Save"}
            </Button>
            {isUpdate && currentPage?.status !== "Published" && (
              <Button
                className="!bg-[#059669] !hover:bg-[rgb(5,155,105)]"
                onClick={handlePublish}
              >
                Publish
              </Button>
            )}
          </div>
        </div>

        {/* form section  */}
        <div className="w-full h-full flex flex-wrap">
          <div className="w-full md:w-[70%] md:border-r max-md:border-b p-6 flex flex-col gap-8">
            <Input
              star="true"
              label="Title"
              placeholder="Enter title"
              name="title"
              type="text"
              errors={errors?.title}
              {...register("title", {
                required: "Title is required",
              })}
            />

            <Input
              star="true"
              label="Sub Title"
              placeholder="Enter sub title"
              name="description"
              type="text"
              errors={errors?.description}
              {...register("description", {
                required: "Sub title is required",
              })}
            />

            <div>
              <label htmlFor="content" className="paragraph">
                Body <sup className="text-[#DA0128]">*</sup>
              </label>
              <ReactQuill
                theme="snow"
                name="content"
                modules={{ toolbar: toolbarOptions }}
                value={getValues("content")}
                className="react-quill"
                onChange={handleEditorChange}
              />
              {errors?.content && (
                <span className="text-xs text-[#DA0128]">
                  {errors?.content.message}
                </span>
              )}
            </div>

            <div
              className={`flex flex-col ${
                attachments.length > 0 ? "gap-2" : "gap-1"
              }`}
            >
              <label className="paragraph" htmlFor="attachments">
                Attachments
              </label>
              <div className="flex gap-2 flex-wrap">
                {attachments.map((file, index) => (
                  <div key={index} className="relative group/item">
                    <img
                      src={file.url ? file.url : URL.createObjectURL(file)}
                      alt={`Attachment ${index + 1}`}
                      className="w-16 h-16 md:w-24 md:h-24 object-cover border rounded-lg group-hover/item:blur-[2px] group-hover/item:border"
                    />
                    <Button
                      type="button"
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-1 bg-transparent hover:bg-transparent text-red-400 border border-red-400 hover:text-red-600 hover:border-red-600 rounded-lg invisible group-hover/item:visible"
                      onClick={() => removeAttachment(index)}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
              <Input
                labelClassName="hidden"
                $id="attachments"
                placeholder=""
                name="attachments"
                type="file"
                errors={errors?.attachments}
                onChange={handleFileChange}
                multiple
                accept=".jpg, .jpeg, .png, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
              />
              <p className="paragraph">
                Supported files:{" "}
                <span className="uppercase">
                  .jpg, .jpeg, .png, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx
                </span>
              </p>
            </div>
          </div>
          <div className="w-full md:w-[30%] flex flex-col gap-6 px-3 pb-6">
            <div className="py-3.5 px-4 border-b">
              <h1 className="heading1">Configurations</h1>
            </div>
            <Input
              star="true"
              label="URL"
              placeholder="homepage"
              name="slug"
              type="text"
              errors={errors?.slug}
              {...register("slug", {
                required: "URL is required",
                pattern: {
                  value: /^[a-zA-Z0-9$-]+$/,
                  message: "URL may not contain special characters",
                },
              })}
            />

            <Input
              label="Author"
              type="text"
              disabled
              defaultValue={`${user.firstName} ${user.lastName}`}
            />

            <div className="flex gap-2">
              <div className="w-full flex gap-2 items-center">
                <div className="">
                  <Input
                    $id={"showAuthor"}
                    type="checkbox"
                    divClassName="!m-0"
                    labelClassName="!p-0"
                    {...register("showAuthor")}
                  />
                </div>

                <label className="w-fit" htmlFor={"showAuthor"}>
                  Show Author
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
      {publishModal && (
        <PublishModal
          handlePublish={handlePublish}
          oldPublishDate={currentPage?.publishDate}
          oldPublishTime={currentPage?.publishTime}
          handleSubmit={handleSubmit}
          register={register}
          errors={errors}
          id={currentPage?._id}
          token={token}
        />
      )}
    </div>
  );
};

export default PageForm;
