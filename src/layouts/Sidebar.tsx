import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { useAppSelector } from "../redux/hooks";
import { adminPaths } from "../routes/admin.routes";
import { Layout, Menu } from "antd";
import React from "react";
import { customerPaths } from "../routes/customer.routes";
import { sidebarItemsGenerator } from "@/utils/sidebarItemsGenerator";
import useIsMobile from "@/pages/dashboard/admin/orders/useIsMobile";


const { Sider } = Layout;

const userRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  VENDOR: "VENDOR",
  CUSTOMER: "CUSTOMER",
};

const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const user = useAppSelector(selectCurrentUser);
  const isMobile = useIsMobile();

  let sidebarItems;

  switch (user!.role) {
    case userRole.SUPER_ADMIN:
      sidebarItems = sidebarItemsGenerator(adminPaths, "admin");
      break;
    case userRole.ADMIN:
      sidebarItems = sidebarItemsGenerator(adminPaths, "admin");
      break;
    case userRole.CUSTOMER:
      sidebarItems = sidebarItemsGenerator(customerPaths, "user");
      break;
    default:
      break;
  }

  return (
    <>
      {/* Backdrop — only shown on mobile while the sidebar is open */}
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 999,
          }}
        />
      )}

      <Sider
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
        style={
          isMobile
            ? {
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 1000,
                height: "100vh",
                boxShadow: collapsed ? "none" : "2px 0 12px rgba(0,0,0,0.15)",
              }
            : undefined
        }
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0, paddingTop: "60px" }}
          items={sidebarItems}
          onClick={() => {
            if (isMobile) setCollapsed(true); // auto-close after navigating
          }}
        />
        <div className="mt-auto border-t border-charcoal/10"></div>
      </Sider>
    </>
  );
};

export default Sidebar;