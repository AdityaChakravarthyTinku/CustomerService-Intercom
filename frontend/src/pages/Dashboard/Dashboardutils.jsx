import { DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { Input, Avatar, Badge, Button, Menu, Dropdown } from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { TbTransactionDollar } from "react-icons/tb";
import { SlLike } from "react-icons/sl";
import { LuUsersRound } from "react-icons/lu";
import { useState } from "react";
import ProfileDialog from "./ProfileDialog";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

const revenueData = [
  { name: "Week 1", guest: 400, user: 300 },
  { name: "Week 2", guest: 300, user: 400 },
  { name: "Week 3", guest: 200, user: 300 },
  { name: "Week 4", guest: 300, user: 400 },
];

const productData = [
  { name: "Basic Tees", value: 55, color: "#22C55E" },
  { name: "Custom Short Pants", value: 31, color: "#FACC15" },
  { name: "Super Hoodies", value: 14, color: "#EF4444" },
];
export default function Dashboardutils(image) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("====================================");
  console.log(image.image.image);
  console.log("====================================");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await api.get('/auth/logout');
      console.log(response.data);
      
      sessionStorage.removeItem("token");

      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const menu = (
    <Menu className="rounded-lg shadow-lg border border-gray-200">
      <Menu.Item
        key="profile"
        icon={<UserOutlined className="text-blue-500" />}
      >
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined className="text-red-500" />}
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex-1 px-4 md:px-8  md:py-4 space-y-5 overflow-auto h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center bg-transparent shadow p-4 rounded-2xl">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-full md:w-64"
          />
          <Badge count={3}>
            <BellOutlined className="text-xl cursor-pointer" />
          </Badge>
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            placement="bottomRight"
            arrow
          >
            <Avatar
              src={
                image?.image?.image ||
                "https://e7.pngegg.com/pngimages/778/849/png-clipart-computer-icons-user-login-avatar-small-icons-angle-heroes.png"
              }
              size={40}
              shape="circle"
              className="cursor-pointer border border-gray-300 shadow-sm hover:shadow-md transition-all"
            />
          </Dropdown>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: DollarSign,
            title: "Total Revenues",
            value: "$2,129,430",
            color: "bg-green-300",
            percentage: "+2.5%",
          },
          {
            icon: TbTransactionDollar,
            title: "Total Transactions",
            value: "1,520",
            color: "bg-[#d7bf8a]",
            percentage: "+1.7%",
          },
          {
            icon: SlLike,
            title: "Total Likes",
            value: "9,721",
            color: "bg-[#dea7ab]",
            percentage: "+1.4%",
          },
          {
            icon: LuUsersRound,
            title: "Total Users",
            value: "9,721",
            color: "bg-[#abade7]",
            percentage: "+1.4%",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-xl shadow-md flex flex-col space-y-2"
          >
            <div className="flex flex-col items-start">
              <div className={`${item.color} p-3 rounded-full`}>
                <item.icon className="text-white w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold text-gray-700">{item.value}</p>
              <div className="bg-green-100 text-green-600 text-sm px-2 py-1 rounded-lg">
                {item.percentage}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {/* Bar Chart */}
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold">Activities</h2>
          <p className="text-gray-500 text-sm">May - June 2021</p>
          <br />
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="guest" fill="#EF4444" radius={[10, 10, 0, 0]} />
              <Bar dataKey="user" fill="#22C55E" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Top Products</h2>
            <p className="text-gray-500 text-sm">May - June 2021</p>
          </div>
          <br></br>
          <div className="flex items-center">
            <ResponsiveContainer width={300} height={260}>
              <PieChart>
                <Pie
                  data={productData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={130}
                  innerRadius={100}
                  stroke="none"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="ml-8 space-y-6">
              {productData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <div>
                    <p className="text-xl font-semibold text-gray-900">
                      {entry.name}
                    </p>
                    <p className="text-xs text-gray-500">{entry.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Profile Button */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center w-full h-full">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined style={{ fontSize: "4rem", color: "white" }} />}
            style={{
              width: "10rem",
              height: "10rem",
              backgroundColor: "#d9d0d0",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "all 0.3s ease-in-out",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#c9c5c5";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#d9d0d0";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onClick={() => setIsModalOpen(true)}
          />

          <p className="text-gray-500 text-sm mt-2">Add Profile</p>
        </div>

        <ProfileDialog
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
