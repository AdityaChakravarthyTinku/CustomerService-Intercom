
import { useState } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import { motion } from "framer-motion";
import axios from 'axios'
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

export default function MakeRequest() {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [form] = Form.useForm();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    form.setFieldsValue({ category: category.name });
    setOpen(true);
  };

  // const handleSubmit = (values) => {
  //   console.log("Submitted:", values);
  //   form.resetFields();
  //   setSelectedCategory(categories[0]);
  //   setOpen(false);
  // };

  const handleSubmit = async (values) => {
    try {
      const token = sessionStorage.getItem('token'); // Assuming JWT is stored like this
  
      const payload = {
        name: values.name,
        phone: values.phone,
        category: values.category,
        description: values.details,
        comments: values.comment || '',
      };
  
      const res = await axios.post(
        'http://localhost:3001/customer/add',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Success:', res.data);
      form.resetFields();
      setSelectedCategory(categories[0]);
      setOpen(false);
    } catch (err) {
      console.error('Error submitting request:', err.response?.data || err.message);
    }
  };
  
  return (
    <div className="w-full h-[77vh] flex flex-col justify-center items-center p-6 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            className={`cursor-pointer rounded-xl text-white text-center p-6 font-semibold text-lg shadow-lg bg-gradient-to-r ${cat.color}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat.name}
          </motion.div>
        ))}
      </div>

      <Modal
        title={`Submit Request`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        className="rounded-xl"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4 pt-2"
          // initialValues={{ category: selectedCategory.name }}
          initialValues={{category: selectedCategory.name,phone: ''}}
        >
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select>
              {categories.map((cat, idx) => (
                <Select.Option key={idx} value={cat.name}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Your full name" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter your phone number" },
              {
                        pattern: /^[0-9]{7,15}$/,
                        message: "Digits only (7‑15 long)",
                      },
            ]}
          >
            <Input placeholder="Your phone number" />
          </Form.Item>

          <Form.Item
            label="Request Details"
            name="details"
            rules={[{ required: true, message: "Please describe your request" }]}
          >
            <Input.TextArea rows={4} placeholder="Full request body..." />
          </Form.Item>

          <Form.Item
            label="Comment (optional)"
            name="comment"
          >
            <Input placeholder="Any additional comments..." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              🚀 Submit Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
