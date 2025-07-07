import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Index from "./Pages/Index";
import Navbar from "./Components/NavBar/navbar.tsx";
import AboutUs from "./Pages/AboutUs/about-us.tsx";
import LoginModal from "./Components/AuthModals/loginModal.tsx";
import RegisterModal from "./Components/AuthModals/registerModal.tsx";
import Game from "./Pages/Game/game.tsx";
import Rules from "./Pages/Rules/rules.tsx";
import Lobby from "./Pages/Lobby/lobby.tsx";
import Dress from "./Pages/Dress/dress.tsx";
import Votes from "./Pages/Votes/votes.tsx";
import Winner from "./Pages/Winner/winner.tsx";
import Profile from "./Pages/Profile/profile.tsx";
import NotFound from "./Pages/NotFound/not-found.tsx";
import LogoutPage from "./Pages/Logout/logout.tsx";
import Admin from "./Pages/AdminDashboard/admin.tsx";
import AdminUsers from "./Pages/AdminUsers/adminusers.tsx";
import AdminReports from "./Pages/AdminReports/adminreports.tsx";
import AdminGames from "./Pages/AdminGames/admingames.tsx";
import Forbidden from "./Pages/Forbbiden/forbidden.tsx";
import { SparkleCursor } from "./Components/SparkleCursor/SparkleCursor.tsx";
import AuthProvider from "./auth/AuthProvider.tsx";
function App() {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);

  // Funciones para abrir/cerrar modales
  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);
  const openRegisterModal = () => setShowRegisterModal(true);
  const closeRegisterModal = () => setShowRegisterModal(false);

  return (
    <>
      <SparkleCursor />
      <BrowserRouter>
        <AuthProvider>
          <Navbar openLoginModal={openLoginModal} />
          <LoginModal
            isOpen={showLoginModal}
            onClose={closeLoginModal}
            onRegisterClick={() => {
              closeLoginModal();
              openRegisterModal();
            }}
            onLoginSuccess={() => closeLoginModal()}
          />
          <RegisterModal
            isOpen={showRegisterModal}
            onClose={closeRegisterModal}
            onLoginClick={() => {
              closeRegisterModal();
              openLoginModal();
            }}
            onRegisterSuccess={() => closeRegisterModal()}
          />
          <Routes>
            <Route
              path={"/"}
              element={<Index openRegisterModal={openRegisterModal} />}
            />
            <Route path={"/about-us"} element={<AboutUs />} />
            <Route path={"/game"} element={<Game />} />
            <Route path={"/rules"} element={<Rules />} />
            <Route path={"/profile"} element={<Profile />} />

            <Route path="/lobby/:numero" element={<Lobby />} />
            <Route path={"/votes/:id_lobby"} element={<Votes />} />
            <Route path={"/dress/:id_lobby"} element={<Dress />} />
            <Route path={"/winner/:id_lobby"} element={<Winner />} />

            <Route path={"/admin"} element={<Admin />} />
            <Route path={"/admin/users"} element={<AdminUsers />} />
            <Route path={"/admin/reports"} element={<AdminReports />} />
            <Route path={"/admin/games"} element={<AdminGames />} />

            <Route path={"/logout"} element={<LogoutPage />} />
            <Route path={"/forbidden"} element={<Forbidden />} />
            <Route path={"*"} element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
