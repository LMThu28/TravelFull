import { MessageOutlined, AuditOutlined,BankFilled, ContainerOutlined, BarsOutlined, DashboardOutlined, FundProjectionScreenOutlined, FileDoneOutlined, ShoppingOutlined, UserOutlined, HeatMapOutlined, SafetyCertificateOutlined, RocketOutlined, HotelOutlined, BedOutlined, ApartmentOutlined, CompassOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import "./sidebar.css";

const { Sider } = Layout;

function Sidebar() {

  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState([]);

  const menuSidebarAdmin = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />
    },
    {
      key: "account-management",
      title: "Quản Lý Tài Khoản",
      link: "/account-management",
      icon: <UserOutlined />
    },
    {
      key: "asset-list",
      title: "Quản lý danh mục",
      link: "/asset-list",
      icon: <ShoppingOutlined />
    },
    {
      key: "news-list",
      title: "Quản lý tin tức",
      link: "/news-list",
      icon: <MessageOutlined />
    },
    {
      key: "tours-management",
      title: "Quản lý Tours",
      link: "/tours-management",
      icon: <CompassOutlined />
    },
    {
      key: "tour-schedules",
      title: "Quản lý Lịch trình Tours",
      link: "/tour-schedules",
      icon: <RocketOutlined />
    },
    {
      key: "tour-categories",
      title: "Danh mục Tours",
      link: "/tour-categories",
      icon: <BarsOutlined />
    },
    {
      key: "tour-bookings",
      title: "Quản lý đặt Tours",
      link: "/tour-bookings",
      icon: <ShoppingOutlined />
    },
    {
      key: "hotels-management",
      title: "Quản lý khách sạn",
      link: "/hotels-management",
      icon: <AuditOutlined />
    },
    {
      key: "room-types-management",
      title: "Quản lý loại phòng",
      link: "/room-types-management",
      icon: <BankFilled />
    },
    {
      key: "rooms-management",
      title: "Quản lý phòng",
      link: "/rooms-management",
      icon: <ApartmentOutlined />
    },
    {
      key: "service-management",
      title: "Quản lý dịch vụ",
      link: "/service-management",
      icon: <ContainerOutlined />
    },
    {
      key: "ticket-management",
      title: "Quản lý đặt Hotel",
      link: "/ticket-management",
      icon: <ShoppingOutlined />
    },
  ];


  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [])



  const navigate = (link, key) => {
    history.push(link);
  }

  useEffect(() => {
  })

  return (
    <Sider
      className={'ant-layout-sider-trigger'}
      width={230}
      style={{
        position: "fixed",
        top: 70,
        height: 'calc(100% - 60px)',
        left: 0,
        padding: 0,
        zIndex: 1,
        marginTop: 0,
        boxShadow: " 0 1px 4px -1px rgb(0 0 0 / 15%)",
        overflowY: 'auto',
        background: '#FFFFFF'
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname.split("/")[1]]}
        defaultOpenKeys={['account']}
        style={{ height: '100%', borderRight: 0, backgroundColor: "#FFFFFF" }}
        theme='light'
      >

        { user.role === "isAdmin" ? (
          menuSidebarAdmin.map((map) => (
            <Menu.Item
              onClick={() => navigate(map.link, map.key)}
              key={map.key}
              icon={map.icon}
              className="customeClass"
            >
              {map.title}
            </Menu.Item>
          ))
        ) : null}
      </Menu>

    </Sider >
  );
}

export default Sidebar;