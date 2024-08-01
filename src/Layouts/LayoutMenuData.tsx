import React, { useEffect, useState } from "react";
import { getItem } from "Components/emus/emus";
import { useNavigate } from "react-router-dom";
import {
  ChannelPartnerr,
  contactus,
  dashboard,
  dpr,
  employee,
  expanse,
  expanseReport,
  inquiry,
  master,
  partnerWithUs,
  project,
  Redevelopmentt,
  report,
  roleEnums,
  service,
  stackHolder,
  stock,
  stockReport,
  stockType,
  taskAllocation,
} from "Components/constants/common";

const NavData = () => {
  const role = getItem("role");
  const history = useNavigate();
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [isService, setIsService] = useState<boolean>(false);
  const [isEmployee, setIsEmployee] = useState<boolean>(false);
  const [isStock, setIsStock] = useState<boolean>(false);
  const [isTaskAllocation, setIsTaskAllocation] = useState<boolean>(false);
  const [isExpanse, setIsExpanse] = useState<boolean>(false);
  const [isCurrentState, setIsCurrentState] = useState("Dashboard");
  const [isProject, setIsProject] = useState<boolean>(false);
  const [isStockType, setIsStockType] = useState<boolean>(false);
  const [isReport, setIsReport] = useState<boolean>(false);
  const [isInquiry, setIsInquiry] = useState<boolean>(false);

  function updateIconSidebar(e: any) {
    if (e && e.target && e.target.getAttribute("sub-items")) {
      const ul: any = document.getElementById("two-column-menu");
      const iconItems: any = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        let id = item.getAttribute("sub-items");
        const getID = document.getElementById(id) as HTMLElement;
        if (getID) getID.classList.remove("show");
        document.body.classList.remove("menu");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (isCurrentState !== dashboard) {
      setIsDashboard(false);
    }
    if (isCurrentState !== service) {
      setIsService(false);
    }
    if (isCurrentState !== stock) {
      setIsStock(false);
    }
    if (isCurrentState !== employee) {
      setIsEmployee(false);
    }
    if (isCurrentState !== taskAllocation) {
      setIsTaskAllocation(false);
    }
    if (isCurrentState !== expanse) {
      setIsExpanse(false);
    }
    if (isCurrentState !== project) {
      setIsProject(false);
    }
    if (isCurrentState !== stockType) {
      setIsStockType(false);
    }
    if (isCurrentState !== report) {
      setIsReport(false);
    }
    if (isCurrentState !== inquiry) {
      setIsInquiry(false);
    }
  }, [
    history,
    isCurrentState,
    isDashboard,
    isStock,
    isTaskAllocation,
    isExpanse,
    isService,
    isEmployee,
    isProject,
    isStockType,
    isReport,
    isInquiry
  ]);

  if (role === roleEnums?.Manager) {
    const menuItems: any = [
      {
        label: "Menu",
        isHeader: true,
      },
      //commented if needed in future
      // {
      //   id: "dashboard",
      //   label: dashboard,
      //   icon: "ri-dashboard-2-line",
      //   link: "/dashboard",
      //   stateVariables: isDashboard,
      //   click: function (e: any) {
      //     e.preventDefault();
      //     setIsDashboard(!isDashboard);
      //     setIsCurrentState(dashboard);
      //     updateIconSidebar(e);
      //   },
      // },
      {
        id: "taskAllocation",
        label: taskAllocation,
        icon: "ri-calendar-check-line",
        link: "/task-allocation",
        click: function (e: any) {
          e.preventDefault();
          setIsTaskAllocation(!isTaskAllocation);
          setIsCurrentState(taskAllocation);
          updateIconSidebar(e);
        },
        stateVariables: isTaskAllocation,
      },
      {
        id: "stock",
        label: stock,
        icon: "ri-file-list-3-line",
        link: "/stock",
        click: function (e: any) {
          e.preventDefault();
          setIsStock(!isStock);
          setIsCurrentState(stock);
          updateIconSidebar(e);
        },
        stateVariables: isStock,
      },
      {
        id: "expanse",
        label: expanse,
        icon: "ri-hand-coin-line",
        link: "/expense",
        click: function (e: any) {
          e.preventDefault();
          setIsExpanse(!isExpanse);
          setIsCurrentState(expanse);
          updateIconSidebar(e);
        },
        stateVariables: isExpanse,
      },
      {
        id: "report",
        label: report,
        icon: "ri-file-chart-line",
        link: "/report",
        click: function (e: any) {
          e.preventDefault();
          setIsReport(!isReport);
          setIsCurrentState(report);
          updateIconSidebar(e);
        },
        stateVariables: isReport,
        subItems: [
          {
            id: "DPR",
            label: dpr,
            link: "/report",
            parentId: "report",
          },
          {
            id: "Stock",
            label: stockReport,
            link: "/stockReport",
            parentId: "report",
          },
          {
            id: "expanse",
            label: expanseReport,
            link: "/expenseReport",
            parentId: "report",
          },
        ]
      },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
  } else {
    const menuItems: any = [
      {
        label: "Menu",
        isHeader: true,
      },
      //commented if needed in future
      // {
      //   id: "dashboard",
      //   label: dashboard,
      //   icon: "ri-dashboard-2-line",
      //   link: "/dashboard",
      //   stateVariables: isDashboard,
      //   click: function (e: any) {
      //     e.preventDefault();
      //     setIsDashboard(!isDashboard);
      //     setIsCurrentState(dashboard);
      //     updateIconSidebar(e);
      //   },
      // },
      {
        id: "Service",
        label: master,
        icon: "ri-apps-2-line",
        link: "/#",
        click: function (e: any) {
          e.preventDefault();
          setIsService(!isService);
          setIsCurrentState(service);
          updateIconSidebar(e);
        },
        stateVariables: isService,
        subItems: [
          {
            id: "Service",
            label: service,
            link: "/master-services",
            parentId: "Service",
          },
          {
            id: "Employee",
            label: stackHolder,
            link: "/stack-holder",
            parentId: "Service",
          },
          {
            id: "Project",
            label: project,
            link: "/project",
            parentId: "Service",
          },
          {
            id: "StockType",
            label: stockType,
            link: "/stocktype",
            parentId: "Service",
          },
        ],
      },
      {
        id: "taskAllocation",
        label: taskAllocation,
        icon: "ri-calendar-check-line",
        link: "/task-allocation",
        click: function (e: any) {
          e.preventDefault();
          setIsTaskAllocation(!isTaskAllocation);
          setIsCurrentState(taskAllocation);
          updateIconSidebar(e);
        },
        stateVariables: isTaskAllocation,
      },
      {
        id: "stock",
        label: stock,
        icon: "ri-file-list-3-line",
        link: "/stock",
        click: function (e: any) {
          e.preventDefault();
          setIsStock(!isStock);
          setIsCurrentState(stock);
          updateIconSidebar(e);
        },
        stateVariables: isStock,
      },
      {
        id: "expanse",
        label: expanse,
        icon: "ri-hand-coin-line",
        link: "/expense",
        click: function (e: any) {
          e.preventDefault();
          setIsExpanse(!isExpanse);
          setIsCurrentState(expanse);
          updateIconSidebar(e);
        },
        stateVariables: isExpanse,
      },
      {
        id: "report",
        label: report,
        icon: "ri-file-chart-line",
        link: "/report",
        click: function (e: any) {
          e.preventDefault();
          setIsReport(!isReport);
          setIsCurrentState(report);
          updateIconSidebar(e);
        },
        stateVariables: isReport,
        subItems: [
          {
            id: "DPR",
            label: dpr,
            link: "/report",
            parentId: "report",
          },
          {
            id: "Stock",
            label: stockReport,
            link: "/stockReport",
            parentId: "report",
          },
          {
            id: "expanse",
            label: expanseReport,
            link: "/expenseReport",
            parentId: "report",
          },
        ]
      },
      {
        id: "Inquiry",
        label: inquiry,
        icon: "ri-survey-line",
        link: "/contactus",
        click: function (e: any) {
          e.preventDefault();
          setIsInquiry(!isInquiry);
          setIsCurrentState(inquiry);
          updateIconSidebar(e);
        },
        stateVariables: isInquiry,
        subItems: [
          {
            id: "ContactUs",
            label: contactus,
            link: "/contactus",
            parentId: "Inquiry",
          },
          {
            id: "PatnerWith Us",
            label: partnerWithUs,
            link: "/partnerwithus",
            parentId: "Inquiry",
          },
          {
            id: "ChannelPartner",
            label: ChannelPartnerr,
            link: "/channelpartner",
            parentId: "Inquiry",
          },
          {
            id: "Redevelopment",
            label: Redevelopmentt,
            link: "/redevelopment",
            parentId: "Inquiry",
          },
        ]
      },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
  }
};
export default NavData;