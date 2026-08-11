import React, { useState } from "react";
import { Breadcrumb, Button, Layout, theme } from "antd";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Home, LogOut, MenuIcon } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";

const { Header, Content } = Layout;

const DashboardLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    const toastId = toast.loading("Loading...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    dispatch(logout());
    toast.success("LogOut", { id: toastId, duration: 500, position: "bottom-right" });
  };

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div className="max-w-7xl mx-auto px-2  overflow-x-hidden">
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Layout>
            <Header
              style={{ padding: "0 12px", background: colorBgContainer }}
              className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap"
            >
              {/* Left Side */}
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <Button
                  type="text"
                  icon={<MenuIcon />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ width: 44, height: 44 }}
                  className="shrink-0"
                />
                <Home className="w-4 h-4 shrink-0 hidden sm:block" />
                <Breadcrumb
                  className="truncate"
                  items={[{ title: "Home" }, { title: "Dashboard" }]}
                />
              </div>

              {/* Right Side */}
              <button
                className="flex items-center gap-1 px-3 py-2 h-10 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-300 shrink-0"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span className="hidden xs:inline">Logout</span>
              </button>
            </Header>
            <Content
              style={{
                padding: "12px",
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
              className="overflow-x-auto"
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default DashboardLayout;