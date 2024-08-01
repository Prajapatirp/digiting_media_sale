import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { clearSessionStorage, enms } from "Components/emus/emus";
import { viewProfile } from "api/usersApi";
import { jwtDecode } from "jwt-decode";
import { configImage } from "config";
import profileImg from "../../assets/image/Iphone.jpg";
import { useProfile } from "pages/Manager Profile/ProfileContext";

const ProfileDropdown = () => {
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const { value } = useProfile();
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const[profileIamge,setProfileIamge]= useState('');

  useEffect(() => {
    const token = sessionStorage.getItem(enms.AuthUser);
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userIdFromToken = decodedToken.id;
      handleViewProfile(userIdFromToken);
    }
  }, []);
  const handleViewProfile = (userId: number) => {
    viewProfile(userId)
      .then((response) => {
        const { name, profile_image } = response.data;
        setUserName(name);
        setProfileIamge(profile_image)
        setRole(sessionStorage.getItem("role") || "");
        value && value.setProfileData({ ...value.value, profile_image });
      })
      .catch((error) => {
        return error;
      });
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  let ProfileImg = value ||  profileIamge
  
  return (
    <Dropdown
      isOpen={isProfileDropdown}
      toggle={toggleProfileDropdown}
      className="ms-sm-3 header-item topbar-user"
    >
      <DropdownToggle tag="button" type="button" className="btn">
        <span className="d-flex align-items-center">
          <img
            className="rounded-circle header-profile-user"
            src={
              role === enms.AuthManager && ProfileImg
                ? `${configImage?.api?.API_URL}/${ProfileImg}`
                : profileImg
            }
            alt="Header Avatar"
          />
          <span className="text-start ms-xl-2">
            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
              {userName}
            </span>
            <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
              {role?.length > 0
                ? role === enms.AuthManager
                  ? "Manager"
                  : "Admin"
                : null}
            </span>
          </span>
        </span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        <h6 className="dropdown-header">Welcome {userName}!</h6>
        {role === enms.AuthManager && (
          <DropdownItem className="p-0">
            <Link to="/profile" className="dropdown-item">
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Profile</span>
            </Link>
          </DropdownItem>
        )}
        <div className="dropdown-divider"></div>
        <DropdownItem className="p-0">
          <Link to="/login" className="dropdown-item" onClick={() => clearSessionStorage()}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
