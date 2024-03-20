import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPublishedPages } from "../services/operations/pageAPI";
import landingImage from "../assets/landing.svg";
import CTAButton from "../components/common/CTAButton";
import Spinner from "../components/common/Spinner";
import PageCard from "../components/common/PageCard";

const Dashboard = () => {
  const { loading, publishedPages } = useSelector((state) => state.page);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(getAllPublishedPages({ status: "Published" }));
    };
    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="w-full min-h-screen grid place-items-center">
        <Spinner className={"border-black w-10 h-10"} />
      </div>
    );
  }

  if (!publishedPages || publishedPages.length === 0) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center flex-col py-10 px-2">
        <div className="w-[80%] max-md:w-[90%] flex items-center justify-between gap-10 p-8 border rounded-lg max-w-[1100px] flex-wrap-reverse">
          <div className="flex flex-col gap-8 w-[50%-36px] p-8">
            <div className="flex flex-col gap-4">
              <h1 className="heading">No Pages Found.</h1>
              <p className="paragraph">
                Looks like you don’t have any pages yet. Let’s add a new page.
              </p>
            </div>
            <CTAButton
              link={"/createPage"}
              text={"+ Add Page"}
              className="max-w-max"
            />
          </div>
          <div className="w-[50%-36px]">
            <img src={landingImage} alt="Landing" loading="lazy" className="" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-5 p-2">
    <div className="px-4 py-3 border-b">
      <h3 className="heading1 max-md:ml-10">All Published Pages</h3>
    </div>
      <div className="w-full h-full flex gap-2 sm:gap-5 flex-wrap md:w-full mx-auto">
        {publishedPages.map((page) => (
            <PageCard page={page} key={page._id}/>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
