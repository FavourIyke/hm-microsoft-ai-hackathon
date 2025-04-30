
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { CrisisReportForm } from "@/components/CrisisReportForm";
import { ReportsList } from "@/components/ReportsList";
import { DataVisuals } from "@/components/DataVisuals";
import { ProjectsList } from "@/components/ProjectsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export const Dashboard = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {user?.role === "admin" ? "Admin Dashboard" : "Field Worker Dashboard"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="submit" className="mb-8">
              <TabsList className="mb-4 w-full grid grid-cols-3">
                <TabsTrigger value="submit">Submit Report</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              <TabsContent value="submit">
                <CrisisReportForm />
              </TabsContent>
              <TabsContent value="analytics">
                <DataVisuals />
              </TabsContent>
              <TabsContent value="projects">
                <ProjectsList />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-md">
              <CardContent className="p-0">
                <ReportsList />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
