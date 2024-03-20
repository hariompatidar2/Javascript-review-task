import { useDispatch, useSelector } from "react-redux";
import CTAButton from "../components/common/CTAButton";
import PageCard from "../components/common/PageCard";
import { useEffect } from "react";
import { getAllPublishedPages } from "../services/operations/pageAPI";
import Spinner from "../components/common/Spinner";
import logo from "../assets/rapid-logo.svg";

const Home = () => {
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
  return (
    <div className="w-full h-full min-h-screen max-w-[1200px] mx-auto flex items-center justify-center flex-col gap-10">
      <div className="w-full flex justify-between px-4 py-2 border-b">
        <img
          src={logo}
          alt="Rapid page builder"
          loading="lazy"
          className="w-16"
        />
        <div className="flex gap-3 items-center">
          <CTAButton text="Signup" link="/signup" />
          <CTAButton text="Login" link="/login" />
        </div>
      </div>
      <p className="text-[2.5rem] leading-[3rem] md:text-[3.5vmax] md:leading-[4vmax]">
        Welcome to
        <span className="font-semibold bg-gradient-to-b from-blue-700 to-white text-transparent bg-clip-text">
          {" "}
          Rapid Page Builder.
        </span>
      </p>

      <div className=" flex gap-2 sm:gap-5 flex-wrap mx-auto">
        {publishedPages.map((page) => (
          <PageCard page={page} key={page._id} />
        ))}
      </div>
    </div>
  );
};

export default Home;
