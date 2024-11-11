import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  dashboard,
  deal,
  employee,
  project,
  stackHolder,
} from "Components/constants/common";
import { getItem } from "Components/emus/emus";

const NavData = () => {
  const history = useNavigate();
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [isDealer, setIsDealer] = useState<boolean>(false);
  const [isDeal, setIsDeal] = useState<boolean>(false);
  const [isEmployee, setIsEmployee] = useState<boolean>(false);
  const [isCurrentState, setIsCurrentState] = useState("Dashboard");
  const [isProject, setIsProject] = useState<boolean>(false);
  let role = getItem("role");

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
    if (isCurrentState !== stackHolder) {
      setIsDealer(false);
    }
    if (isCurrentState !== deal) {
      setIsDeal(false);
    }
    if (isCurrentState !== employee) {
      setIsEmployee(false);
    }
    if (isCurrentState !== project) {
      setIsProject(false);
    }
  }, [history, isCurrentState, isDashboard, isDealer, isEmployee, isProject]);

  let menuItems: any;
  if (role === "Admin") {
    menuItems = [
      {
        label: "Menu",
        isHeader: true,
      },
      {
        id: "dashBoard",
        label: dashboard,
        icon: "ri-calendar-check-line",
        link: "/",
        click: function (e: any) {
          e.preventDefault();
          setIsCurrentState(dashboard);
          updateIconSidebar(e);
        },
        stateVariables: isDashboard,
      },
      {
        id: "Dealer",
        label: stackHolder,
        icon: "ri-apps-2-line",
        link: "/dealer",
        click: function (e: any) {
          e.preventDefault();
          setIsDealer(!isDealer);
          setIsCurrentState(stackHolder);
          updateIconSidebar(e);
        },
        stateVariables: isDealer,
      },
      {
        id: "Deal",
        label: deal,
        icon: "ri-apps-2-line",
        link: "/deal",
        click: function (e: any) {
          e.preventDefault();
          setIsDeal(!isDeal);
          setIsCurrentState(deal);
          updateIconSidebar(e);
        },
        stateVariables: isDeal,
      },
    ];
  }

  if (role === "Dealer") {
    menuItems = [
      {
        label: "Menu",
        isHeader: true,
      },
      {
        id: "dashBoard",
        label: dashboard,
        icon: "ri-calendar-check-line",
        link: "/",
        click: function (e: any) {
          e.preventDefault();
          setIsCurrentState(dashboard);
          updateIconSidebar(e);
        },
        stateVariables: isDashboard,
      },
      {
        id: "Deal",
        label: deal,
        icon: "ri-apps-2-line",
        link: "/deal",
        click: function (e: any) {
          e.preventDefault();
          setIsDeal(!isDeal);
          setIsCurrentState(deal);
          updateIconSidebar(e);
        },
        stateVariables: isDeal,
      },
    ];
  }

  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default NavData;
