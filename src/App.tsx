import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import {
  Landing,
  Login,
  Register,
  ContratadorHome,
  ContratadorChat,
  ContratadorPerfil,
  ContratadorPostulaciones,
} from "./modules";
import { ProveedorHome } from "./modules/proveedor/ProveedorHome";

import { ProveedorCreatePost } from "./modules/proveedor/pages/ProveedorCreatePost";
import { ProveedorChats } from "./modules/proveedor/pages/ProveedorChats";
import { ProveedorPerfil } from "./modules/proveedor/pages/ProveedorPerfil";
import { RegisterVerifiyEmail } from "./modules/auth/pages/RegisterVerifiyEmail";
import { RegisterSuccessfulVerified } from "./modules/auth/pages/RegisterSuccessfulVerified";
import { ForgotPassword } from "./modules/auth/pages/ForgotPassword";
import { ResetPassword } from "./modules/auth/pages/ResetPassword";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/register/verifyEmail",
      element: <RegisterVerifiyEmail />,
    },
    {
      path: "/register/verify-email",
      element: <RegisterSuccessfulVerified />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/provider",
      element: (
        <ProtectedRoute>
          <ProveedorHome />
        </ProtectedRoute>
      ),
    },

    {
      path: "/provider/create-post",
      element: (
        <ProtectedRoute>
          <ProveedorCreatePost />
        </ProtectedRoute>
      ),
    },

    {
      path: "/provider/chats",
      element: (
        <ProtectedRoute>
          <ProveedorChats />
        </ProtectedRoute>
      ),
    },
    {
      path: "/provider/profile",
      element: (
        <ProtectedRoute>
          <ProveedorPerfil />
        </ProtectedRoute>
      ),
    },

    {
      path: "/contractor",
      element: (
        <ProtectedRoute>
          <ContratadorHome />
        </ProtectedRoute>
      ),
    },
    {
      path: "/contractor/chats",
      element: (
        <ProtectedRoute>
          <ContratadorChat />
        </ProtectedRoute>
      ),
    },
    {
      path: "/contractor/posts",
      element: (
        <ProtectedRoute>
          <ContratadorPostulaciones />
        </ProtectedRoute>
      ),
    },
    {
      path: "/contractor/profile",
      element: (
        <ProtectedRoute>
          <ContratadorPerfil />
        </ProtectedRoute>
      ),
    },
  ]);
  return (
    <>
      <Toaster richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
