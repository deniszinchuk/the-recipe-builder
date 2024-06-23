import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import RecordList from "./RecordList";
const Mongo = () => {
  return (
    <div className="w-full p-6">
      <Navbar />
      <Outlet />
      <RecordList/>
    </div>
  );
};
export default Mongo;