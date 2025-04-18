import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Tabs, Input, Button, message } from "antd";
import { MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import { FaInstagram, FaYoutube, FaLinkedin, FaGithub } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";

export default function UserProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfiles();
  }, [formData, modalVisible]);

  const fetchProfiles = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/myprofiles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfiles(response.data[0].profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (profile) => {
    setFormData(profile);
    setModalVisible(true);
  };

  const handleDelete = async (profileId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/user/profiles/${profileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfiles(profiles.filter((profile) => profile._id !== profileId));
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem("token");
      let response;
      const updatedData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== "")
      );
      if (formData._id) {
        response = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/user/profiles/${formData._id}`,
          updatedData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfiles(
          profiles.map((p) => (p._id === formData._id ? response.data : p))
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/addprofile`,
          updatedData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfiles([...profiles, response.data]);
      }
      message.success("Profile saved successfully!");
      setModalVisible(false);
    } catch (error) {
      alert(error.response.data?.message)
      message.error("Profile submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center  p-4">
      <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">User Profiles</h2>
          {/* <Button type="primary" onClick={() => setModalVisible(true)}>
            Add Profile
          </Button> */}
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : profiles.length > 0 ? (
            <div className="grid gap-4">
              {profiles.map((profile) => (
                <div
                  key={profile._id}
                  className="p-4 bg-gray-50 rounded-xl shadow-md border border-gray-200"
                >
                  <p className="text-lg font-semibold text-gray-900">
                    {profile.name || "Not Available"}
                  </p>
                  <p className="text-gray-700">Email: {profile.email}</p>
                  <p className="text-gray-700">
                    Phone: {profile.phone || "Not Available"}
                  </p>
                  <p className="text-gray-700">
                    Address 1: {profile.address1 || "Not Available"}
                  </p>
                  <p className="text-gray-700">
                    Address 2: {profile.address2 || "Not Available"}
                  </p>
                  <p className="text-gray-700">
                    Instagram: {profile.instagram || "Not Available"}
                  </p>
                  <p className="text-gray-700">
                    YouTube: {profile.youtube || "Not Available"}
                  </p>
                  <p className="text-gray-700">
                    LinkedIn: {profile.linkedin || "Not Available"}
                  </p>
                  <p className="text-gray-700">
                    GitHub: {profile.github || "Not Available"}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Button onClick={() => handleEdit(profile)}>Edit</Button>
                    <Button danger onClick={() => handleDelete(profile._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No profiles available</p>
          )}
        </div>
      </div>
      <Modal
        title={formData._id ? "Edit Profile" : "Add New Profile"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Tabs defaultActiveKey="1" centered>
          <Tabs.TabPane tab="Basic" key="1">
            <Input
              prefix={<IoMdPerson />}
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              value={formData.email}
              disabled
            />
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <Input
              prefix={<HomeOutlined />}
              placeholder="Address 1"
              value={formData.address1}
              onChange={(e) =>
                setFormData({ ...formData, address1: e.target.value })
              }
            />
            <Input
              placeholder="Address 2"
              value={formData.address2}
              onChange={(e) =>
                setFormData({ ...formData, address2: e.target.value })
              }
            />
            <Input
              prefix={<FaInstagram />}
              placeholder="Instagram"
              value={formData.instagram}
              onChange={(e) =>
                setFormData({ ...formData, instagram: e.target.value })
              }
            />
            <Input
              prefix={<FaYoutube />}
              placeholder="YouTube"
              value={formData.youtube}
              onChange={(e) =>
                setFormData({ ...formData, youtube: e.target.value })
              }
            />
            <Input
              prefix={<FaLinkedin />}
              placeholder="LinkedIn"
              value={formData.linkedin}
              onChange={(e) =>
                setFormData({ ...formData, linkedin: e.target.value })
              }
            />
            <Input
              prefix={<FaGithub />}
              placeholder="GitHub"
              value={formData.github}
              onChange={(e) =>
                setFormData({ ...formData, github: e.target.value })
              }
            />
          </Tabs.TabPane>
        </Tabs>
        <div className="flex justify-end mt-4">
          <Button type="primary" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </Modal>
    </div>
  );
}
