
import { Home, TrendingUp, Users, Menu } from "lucide-react";
import { SettingOutlined } from "@ant-design/icons";
import { GrSchedules } from "react-icons/gr";
import { useState } from "react";

import Dashboardutils from "./Dashboardutils";
import User from "./User";

export default function Dashboard(image) {
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-4"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`z-50  fixed inset-y-0 left-0 transform bg-blue-600 text-white p-6 space-y-6 w-64 md:w-[15vw] md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:h-screen flex flex-col justify-between`}
      >
        <h1 className="text-2xl font-bold md:mb-15">Board.</h1>

        <nav className="space-y-5 md:space-y-15 mt-6">
          {[
            { name: "Dashboard", icon: Home },
            { name: "Transactions", icon: TrendingUp },
            { name: "Schedules", icon: GrSchedules },
            { name: "Users", icon: Users },
            { name: "Settings", icon: SettingOutlined },
          ].map((item, index) => (
            <a
              key={index}
              className={`flex items-center space-x-2 cursor-pointer ${
                selectedTab === item.name ? "font-bold text-yellow-500" : ""
              }`}
              onClick={() => {
                setSelectedTab(item.name);
                setMenuOpen(false); // Hide menu on selection (Mobile UX)
              }}
            >
              <item.icon /> <span>{item.name}</span>
            </a>
          ))}
        </nav>

        <div className="space-y-3 mt-auto flex flex-col">
          <a className="cursor-pointer text-white">Help</a>
          <a className="cursor-pointer text-white">Contact Us</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-screen">
        {selectedTab === "Users" ? (
          <User />
        ) : (
          <Dashboardutils image={image} />
        )}
      </div>
    </div>
  );
}
