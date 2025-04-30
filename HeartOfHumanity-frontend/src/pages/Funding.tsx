
import { useState } from "react";
import { Header } from "@/components/Header";
import { FundingForm } from "@/components/FundingForm";
import { ProjectManagement } from "@/components/ProjectManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { ProjectIssues } from "@/components/ProjectIssues";

const Funding = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const defaultTab = projectId ? "fund" : "manage";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Relief Project Center</h1>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="fund">Support Projects</TabsTrigger>
            <TabsTrigger value="manage">Manage Projects</TabsTrigger>
            <TabsTrigger value="issues">Project Issues</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fund">
            <FundingForm />
          </TabsContent>
          
          <TabsContent value="manage">
            <ProjectManagement />
          </TabsContent>

          <TabsContent value="issues">
            <ProjectIssues />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Funding;
