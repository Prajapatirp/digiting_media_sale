import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  dashboard,
  employee,
  master,
  project,
  service,
  stackHolder,
  taskAllocation,
} from "Components/constants/common";

const NavData = () => {
  const history = useNavigate();
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [isService, setIsService] = useState<boolean>(false);
  const [isEmployee, setIsEmployee] = useState<boolean>(false);
  const [isTaskAllocation, setIsTaskAllocation] = useState<boolean>(false);
  const [isCurrentState, setIsCurrentState] = useState("Dashboard");
  const [isProject, setIsProject] = useState<boolean>(false);

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
    if (isCurrentState !== employee) {
      setIsEmployee(false);
    }
    if (isCurrentState !== taskAllocation) {
      setIsTaskAllocation(false);
    }
    if (isCurrentState !== project) {
      setIsProject(false);
    }
  }, [
    history,
    isCurrentState,
    isDashboard,
    isTaskAllocation,
    isService,
    isEmployee,
    isProject,
  ]);
  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
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
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default NavData;
