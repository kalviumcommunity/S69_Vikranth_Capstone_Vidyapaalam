
// import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// const AppLayout = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-grow">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default AppLayout;

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState } from "react";
import AuthModals from "../auth/AuthModals.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("signin");

  const openModal = (type) => {
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        user={user}
        onSignIn={() => openModal("signin")}
        onSignUp={() => openModal("signup")}
        onLogout={logout}
      />

      {/* Auth modals live here so any page can open them */}
      <AuthModals
        isOpen={isOpen}
        modalType={modalType}
        onClose={closeModal}
        onSwitchModal={setModalType}
      />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default AppLayout;
