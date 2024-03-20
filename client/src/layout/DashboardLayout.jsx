import { Outlet } from "react-router-dom"
import Navbar from "../components/common/Navbar"

const DashboardLayout = () => {
  return (
    <div className="flex">
    <Navbar/>
    <div className="ml-[64px] max-md:m-0 w-full h-full">
        <Outlet/>
    </div>
    </div>
  )
}

export default DashboardLayout