import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, MapPin } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-relief-blue text-white py-4 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            ReliefLink
          </Link>
        </div>

        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:bg-blue-600 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <nav className={`absolute md:static top-16 left-0 right-0 bg-relief-blue md:bg-transparent z-50 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row md:items-center p-4 md:p-0 gap-4">
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/dashboard" className="hover:underline block py-2 md:py-0">
                    Dashboard
                  </Link>
                </li>
                
                <li>
                  <Link to="/reports" className="hover:underline block py-2 md:py-0">
                    All Reports
                  </Link>
                </li>
                
                <li>
                  <Link to="/poverty-map" className="hover:underline flex items-center gap-1 py-2 md:py-0">
                    <MapPin className="h-4 w-4" />
                    Poverty Map
                  </Link>
                </li>
                
                <li>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-blue-600 flex items-center gap-2 w-full justify-start md:w-auto"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </li>
                
                <li className="font-bold py-2 md:py-0">
                  {user?.name} ({user?.role === "admin" ? "Admin" : "Field Worker"})
                </li>
              </>
            )}
            
            {!isAuthenticated && (
              <>
                <li>
                  <Link to="/login">
                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-relief-blue">
                      Login
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/poverty-map" className="hover:underline flex items-center gap-1 py-2 md:py-0">
                    <MapPin className="h-4 w-4" />
                    Poverty Map
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
