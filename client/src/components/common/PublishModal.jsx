import Input from "./Input";
import Button from "./Button";
import { cancelPublishPage, schedulePublishPage, updatePublishPage } from "../../services/operations/publishAPI";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const PublishModal = ({
    handlePublish,
    handleSubmit,
    register,
    errors,
    oldPublishDate,
    oldPublishTime,  
    id,
    token
}) => {
    const dispatch= useDispatch();
    const {loading}= useSelector(state=> state.page);
    const navigate= useNavigate();
  const submit1 = async(data) => {
    if(oldPublishDate && oldPublishTime){
        await dispatch(updatePublishPage(id,data,token))
        handlePublish();
    }else{
        await dispatch(schedulePublishPage(id, data,token))
        handlePublish();
    }
    navigate("/pages")
  };

  const cancelPublishHandler=async()=>{
    await dispatch(cancelPublishPage(id,token))
    handlePublish()
  }

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black-50 backdrop-blur-md z-50 `}
    >
      <form onSubmit={handleSubmit(submit1)}>
        <div className="bg-white w-full md:w-[500px] rounded-lg shadow-lg flex flex-col gap-6">
          <div className="bg-[#111024] flex justify-between items-center px-6 py-4 rounded-t-lg">
            <h2 className="text-xl text-white font-semibold">Publish</h2>
            <button onClick={handlePublish}>
             <AiOutlineClose className="w-6 h-6 text-white"/>
            </button>
          </div>
          <div className="px-6">
            <Input
              star="true"
              label="Publish Date"
              name="publishDate"
              type="date"
              defaultValue={oldPublishDate ? oldPublishDate.toString().split('T')[0] : ''}
              errors={errors?.publishDate}
              {...register("publishDate", {
                required: "Publish date is required",
              })}
            />
          </div>

          <div className="px-6">
            <Input
              star="true"
              label="Publish Time"
              name="publishTime"
              type="time"
              defaultValue={oldPublishTime? oldPublishTime:''}
              {...register("publishTime", {
                required: "Publish time is required",
              })}
            />
          </div>

          <div className="flex justify-end py-4 px-6 gap-4">
            <Button className="!text-[#201F37] !bg-transparent !hover:bg-transparent border" onClick={cancelPublishHandler} loading={loading}>
              Cancel Publish
            </Button>
            <Button type="submit" className="!bg-[#059669] !hover:bg-[#059700]" loading={loading}>
              Publish
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PublishModal;
