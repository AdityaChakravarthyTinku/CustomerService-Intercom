import { Layout, Tabs, Avatar } from "antd";
import { FileAddOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import MakeRequest from "./MakeRequest";
import ViewRequests from "./ViewRequests";
import { useState } from "react";

const { Header, Content } = Layout;

export default function App() {
  const [activeKey, setActiveKey] = useState("1");

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header className="bg-blue-600 flex items-center justify-between px-6 shadow-md">
        <div className="text-white text-2xl font-semibold tracking-wide">
          Tensor Go
        </div>

        <Avatar icon={<UserOutlined />} className="bg-white text-blue-600" />
      </Header>
      {/* 
      <Content className="flex flex-col items-center justify-start py-5 px-4">
        <div className="w-full h-[85vh] max-w-3xl">
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            centered
            type="card"
            size="large"
            items={[
              {
                label: (
                  <span className="text-base">
                    <FileAddOutlined /> Make Request
                  </span>
                ),
                key: "1",
                children: <MakeRequest />,
              },
              {
                label: (
                  <span className="text-base">
                    <EyeOutlined /> View Requests
                  </span>
                ),
                key: "2",
                children: <ViewRequests />,
              },
            ]}
          />
        </div>
      </Content> */}
      <Content className="flex flex-col items-center justify-start grow py-5 px-4">
        <div className="w-full h-full">
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            centered
            type="card"
            size="large"
            className="h-full"
            items={[
              {
                label: (
                  <span className="text-base">
                    <FileAddOutlined /> Make Request
                  </span>
                ),
                key: "1",
                children: <MakeRequest />,
              },
              {
                label: (
                  <span className="text-base">
                    <EyeOutlined /> View Requests
                  </span>
                ),
                key: "2",
                children: <ViewRequests />,
              },
            ]}
          />
        </div>
      </Content>
    </Layout>
  );
}
