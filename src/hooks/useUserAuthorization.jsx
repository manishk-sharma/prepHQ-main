import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../components/AuthContext";
import UserAuthorizeModal from "../authorization-modals/UserAuthorizeModal";

const useUserAuthorization = () => {
  const { isAuthenticated } = useAuth();

  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const authorize = () => {
    if (isAuthenticated) return true;

    setOpen(true);
    return false;
  };

  const handleLogin = () => {
    setOpen(false);

    navigate("/login", {
      state: {
        from: location.pathname + location.search,
      },
    });
  };

  const authorizationModal = (
    <UserAuthorizeModal
      open={open}
      close={() => setOpen(false)}
      onLogin={handleLogin}
    />
  );

  return {
    authorize,
    authorizationModal,
  };
};

export default useUserAuthorization;