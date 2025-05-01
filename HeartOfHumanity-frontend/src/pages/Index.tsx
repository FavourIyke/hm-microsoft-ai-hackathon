
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ArrowRight, BarChart3, MessageSquare, Shield, HandCoins } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ReportsList } from "@/components/ReportsList";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero section with Reports List */}
      <section className="bg-white py-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse gap-8">
            {/* Recent Crisis Reports on the right */}
            <div className="w-full md:w-1/3 animate-fade-in">
              <ReportsList />
            </div>
            
            {/* Hero content on the left */}
            <div className="w-full md:w-2/3 flex flex-col items-start text-left animate-scale-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-relief-darkGray mb-6">
                HeartOfHumanity
              </h1>
              <p className="text-xl md:text-2xl text-relief-darkGray max-w-3xl mb-8">
               AI with a Mission — Lighting the Path from Struggle to Support, Turning Compassion into Collective Impact.              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-relief-blue hover:bg-blue-600 text-white text-lg py-6 px-8 rounded-lg flex items-center gap-2 shadow-lg transition-all hover:translate-y-[-2px]"
                  onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="h-5 w-5" />
                </Button>
                
                <Button 
                  className="bg-relief-orange hover:bg-relief-orange text-relief-darkGray text-lg py-6 px-8 rounded-lg flex items-center gap-2 shadow-lg transition-all hover:translate-y-[-2px]"
                  onClick={() => navigate("/funding")}
                >
                  Support a Project
                  <HandCoins className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">
      From Urgency to Impact — Intelligent Tools for Real-World Relief
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Effortless Reporting */}
      <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-relief-blue">
        <div className="bg-relief-blue bg-opacity-10 p-4 rounded-full mb-4">
          <MessageSquare className="h-8 w-8 text-relief-blue" />
        </div>
        <h3 className="text-xl font-bold mb-3">Effortless Reporting</h3>
        <p className="text-gray-600">
          Express yourself, speak, type, or record. The system instantly interprets and elevates the urgency of your report to the right eyes.
        </p>
      </div>

      {/* Smart Validation */}
      <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-relief-orange">
        <div className="bg-relief-orange bg-opacity-10 p-4 rounded-full mb-4">
          <Shield className="h-8 w-8 text-relief-orange" />
        </div>
        <h3 className="text-xl font-bold mb-3">Smart Validation</h3>
        <p className="text-gray-600">
          Every report is carefully analyzed, verified and acted upon, ensuring that all needs are swiftly addressed.
        </p>
      </div>

      {/* Live Progress Monitoring */}
      <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-green-600">
        <div className="bg-green-600 bg-opacity-10 p-4 rounded-full mb-4">
          <BarChart3 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-3">Live Progress Monitoring</h3>
        <p className="text-gray-600">
          Track every step, from reported needs to resolved outcomes, with real-time updates and transparent data.
        </p>
      </div>

      {/* Seamless Support Matching */}
      <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-purple-600">
        <div className="bg-purple-600 bg-opacity-10 p-4 rounded-full mb-4">
          <HandCoins className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold mb-3">Seamless Support Matching</h3>
        <p className="text-gray-600">
        Relief projects are matched with the right supporters, turning compassion into lasting change, with the Impact Zones map providing a visual guide to the areas that need help the most.
        </p>
      </div>
    </div>
  </div>
</section>



      {/* Footer */}
      <footer className="bg-relief-darkGray text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2025 ReliefLink. All rights reserved.</p>
          <p className="text-sm text-gray-400">
            Helping NGOs respond to crises with AI-powered insights.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
