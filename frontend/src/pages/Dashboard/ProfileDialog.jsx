import { useState } from "react";
import axios from "axios";
import { Modal, Tabs, Input, Button } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { FaInstagram, FaYoutube, FaLinkedin, FaGithub } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
// import { submitprofileForm } from "./dashboardutils";
import { message } from "antd";

export default function ProfileDialog({ visible, onClose }) {
    
  const [activeTab, setActiveTab] = useState("1");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    github: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = async () => {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/addprofile`, formData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    message.success("Profile added successfully!");
    alert("Profile added successfully!");
    onClose();
    console.log("Profile added successfully:", response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Profile submission failed";

    message.error(errorMessage);
    alert(errorMessage);
    console.error("Profile submission failed:", errorMessage);
  }
};

  

  return (
    <Modal
      title="Add New Profile"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} centered>
        <Tabs.TabPane tab="Basic" key="1">
          <div className="space-y-4">
            <Input prefix={<IoMdPerson />} name="name" placeholder="Name" onChange={handleChange} />
            <Input prefix={<MailOutlined />} name="email" placeholder="Email" onChange={handleChange} />
            <Input prefix={<PhoneOutlined />} name="phone" placeholder="Phone" onChange={handleChange} />
            <Input prefix={<HomeOutlined />} name="address1" placeholder="Address Line 1" onChange={handleChange} />
            <Input prefix={<EnvironmentOutlined />} name="address2" placeholder="Address Line 2" onChange={handleChange} />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="primary" onClick={() => setActiveTab("2")}>
              Next
            </Button>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Social" key="2">
          <div className="space-y-4">
            <Input prefix={<FaInstagram className="text-pink-500" />} name="instagram" placeholder="Instagram Link" onChange={handleChange} />
            <Input prefix={<FaYoutube className="text-red-500" />} name="youtube" placeholder="YouTube Link" onChange={handleChange} />
            <Input prefix={<FaLinkedin className="text-blue-500" />} name="linkedin" placeholder="LinkedIn Link" onChange={handleChange} />
            <Input prefix={<FaGithub className="text-gray-700" />} name="github" placeholder="GitHub Link" onChange={handleChange} />
          </div>
          <div className="flex justify-between mt-4">
            <Button onClick={() => setActiveTab("1")} className="mr-2">
              Back
            </Button>
            <Button
              type="primary"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg rounded-lg"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}
