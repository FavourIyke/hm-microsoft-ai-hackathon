
import { AuthForm } from "@/components/AuthForm";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  
  const handleAnonymousReporting = () => {
    navigate("/report-anonymously");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <AuthForm />
        
        <div className="mt-8 text-center">
          <div className="mb-4 text-gray-600">
            <p className="text-lg font-medium mb-2">Affected by a crisis?</p>
            <p>You can submit a report without creating an account</p>
          </div>
          <Button 
            variant="outline" 
            className="border-relief-blue text-relief-blue hover:bg-relief-blue hover:text-white"
            onClick={handleAnonymousReporting}
          >
            Submit Anonymous Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
