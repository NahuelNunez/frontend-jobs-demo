import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "../../ui/button";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-xl font-bold text-gray-800 hover:text-blue-600"
            >
              Jobs
            </Link>
            <Link
              to="/postulaciones"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              📋 Postulaciones
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/mis-postulaciones"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  📝 Mis Postulaciones
                </Link>
                <Link
                  to="/chat"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  💬 Chat
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  👤 Perfil
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  {user?.email} ({user?.role})
                </span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link to="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
