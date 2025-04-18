
import { useEffect, useState } from "react";
import { List, Card, Button, Popconfirm, message } from "antd";
import { motion } from "framer-motion";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const categories = [
  {
    name: "General Queries",
    color: "from-purple-400 via-pink-500 to-red-500",
  },
  {
    name: "Product Features Queries",
    color: "from-green-400 via-blue-500 to-purple-500",
  },
  {
    name: "Product Pricing Queries",
    color: "from-yellow-400 via-orange-500 to-red-500",
  },
  {
    name: "Product Feature Implementation Requests",
    color: "from-teal-400 via-cyan-500 to-blue-500",
  },
];

export default function ViewRequests() {
  const [data, setData] = useState([]);

  const fetchRequests = async () => {
    try {
      // const userId = sessionStorage.getItem("token");
      // const res = await axios.get(`http://localhost:3001/customer/view/${userId}`);

      const token = sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/customer/view", {
headers: { Authorization: `Bearer ${token}` },
});



      setData(res.data.customer); // ✅ ONLY this is needed
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      message.error("Unable to load requests.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getCategoryColor = (categoryName) => {
    const category = categories.find((c) => c.name === categoryName);
    return category ? category.color : "from-gray-300 to-gray-500";
  };

  const handleEdit = (index) => {
    message.info(`Edit request in category: ${data[index].category}`);
    // Logic to open edit modal
  };

  const handleDelete =async (index,id) => {
    const newData = [...data];
    message.success(`Deleted request in: ${newData[index].category}`);
    newData.splice(index, 1);
    setData(newData);

      try {
        await axios.delete(`http://localhost:3001/customer/delete/${id}`);
        setData((prevData) => prevData.filter((item) => item._id !== id));
        message.success("Request deleted successfully.");
      } catch (err) {
        console.error("Delete failed:", err);
        message.error("Failed to delete request.");
      }
    
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Submitted Requests</h2>

      <List
        itemLayout="vertical"
        dataSource={data}
        locale={{ emptyText: "No requests submitted yet." }}
        renderItem={(item, index) => {
          const gradientClass = getCategoryColor(item.category);
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={item._id}
            >
              <Card
                className="mb-4 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
                title={
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradientClass}`}
                    >
                      {item.category}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(index)}
                        className="hover:text-blue-500"
                      />
                      <Popconfirm
                        title="Are you sure you want to delete this request?"
                        onConfirm={() => handleDelete(index,item._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          className="hover:text-red-500"
                        />
                      </Popconfirm>
                    </div>
                  </div>
                }
                bordered={false}
              >
                <p className="text-gray-700">{item.description}</p>

                {item.response && (
                  <div className="mt-4 p-4 border-l-4 border-blue-500 bg-blue-50 text-gray-800 rounded-lg">
                    <h4 className="font-semibold text-blue-600">Response:</h4>
                    <p>{item.response}</p>
                  </div>
                )}
              </Card>
              <br />
            </motion.div>
          );
        }}
      />
    </div>
  );
}
