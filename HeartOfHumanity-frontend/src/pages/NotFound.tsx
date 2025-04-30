import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-relief-lightGray">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-8xl font-bold text-relief-blue mb-6">404</div>
          <h1 className="text-3xl font-bold mb-4 text-relief-darkGray">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="bg-relief-blue hover:bg-blue-600 inline-flex items-center gap-2">
            <a href="/">
              <Home className="h-5 w-5" />
              Return to Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
