import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { useProfile } from "../Components/Hooks/UserHooks";

const AuthProtected = (props: any) => {
  const dispatch: any = useDispatch();
  const { userProfile, loading, token } = useProfile();

  useEffect(() => {
    if (userProfile && !loading && token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else if (!userProfile && loading && !token) {
      sessionStorage.removeItem("authUser");
    }
  }, [token, userProfile, loading, dispatch]);

  /*
    Navigate is un-auth access protected routes via url
    */

  if (!userProfile && loading && !token) {
    return <Navigate to={{ pathname: "/login" }} />;
  }

  return <>{props.children}</>;
};

export default AuthProtected;
