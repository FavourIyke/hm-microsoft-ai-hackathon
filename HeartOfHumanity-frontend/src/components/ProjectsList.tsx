
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { HandCoins } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  location: string;
  target: number;
  raised: number;
  remainingDays: number;
  imageUrl?: string;
};

const mockProjects: Project[] = [
  {
    id: "project-1",
    title: "Clean Water for Flood Victims",
    description: "Providing clean water solutions for 500 families affected by recent floods.",
    location: "Coastal Region",
    target: 10000,
    raised: 6500,
    remainingDays: 15,
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "project-2",
    title: "Emergency Shelters",
    description: "Building temporary shelters for families displaced by the earthquake.",
    location: "Mountain Province",
    target: 15000,
    raised: 4200,
    remainingDays: 30,
    imageUrl: "https://images.unsplash.com/photo-1469571486292-b53601d4966f?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "project-3",
    title: "Medical Supplies for Rural Clinics",
    description: "Supplying essential medical equipment to clinics in remote villages.",
    location: "Eastern Districts",
    target: 8000,
    raised: 5600,
    remainingDays: 7,
    imageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2532&auto=format&fit=crop"
  },
];

export const ProjectsList = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Active Relief Projects</h2>
        <Button 
          onClick={() => navigate('/funding')}
          className="bg-relief-blue hover:bg-blue-600"
        >
          <HandCoins className="mr-2 h-4 w-4" />
          Fund a Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden flex flex-col">
            {project.imageUrl && (
              <div className="h-40 overflow-hidden">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <CardDescription>{project.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600 mb-4">{project.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Raised: ${project.raised.toLocaleString()}</span>
                  <span>Goal: ${project.target.toLocaleString()}</span>
                </div>
                <Progress value={(project.raised / project.target) * 100} className="h-2" />
                <p className="text-xs text-gray-500 text-right">{project.remainingDays} days remaining</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-relief-orange hover:bg-orange-600"
                onClick={() => navigate(`/funding?project=${project.id}`)}
              >
                Support This Project
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
