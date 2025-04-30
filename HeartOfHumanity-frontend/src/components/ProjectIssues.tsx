
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for reports with project associations
const mockReports = [
  {
    id: "1",
    location: "Riverside District, Zone 2",
    createdAt: "2023-04-14T10:30:00Z",
    status: "pending",
    summary: "20 families affected by flooding, need water and shelter",
    issueType: "flooding",
    projectId: "project-1"
  },
  {
    id: "2",
    location: "Northern Hills, Zone 1",
    createdAt: "2023-04-13T16:45:00Z",
    status: "in_progress",
    summary: "Food shortage affecting 50 people, medical supplies needed",
    issueType: "food_shortage",
    projectId: "project-2"
  },
  {
    id: "3",
    location: "Eastern Village, Zone 3",
    createdAt: "2023-04-12T08:15:00Z",
    status: "completed",
    summary: "Temporary shelters set up for 15 families after storm",
    issueType: "shelter",
    projectId: "project-2"
  },
  {
    id: "4",
    location: "Central Market, Zone 1",
    createdAt: "2023-04-10T13:20:00Z",
    status: "in_progress",
    summary: "Water contamination affecting 100 people, clean water supply needed",
    issueType: "water_quality",
    projectId: "project-1"
  },
  {
    id: "5",
    location: "Riverside District, Zone 3",
    createdAt: "2023-04-10T09:20:00Z",
    status: "pending",
    summary: "Flooding reported, 5 families need immediate assistance",
    issueType: "flooding",
    projectId: "project-1"
  },
  {
    id: "7",
    location: "Northern Hills, Zone 2",
    createdAt: "2023-04-11T11:30:00Z",
    status: "pending",
    summary: "Food shortage affecting 20 elderly residents",
    issueType: "food_shortage",
    projectId: "project-2"
  },
  {
    id: "9",
    location: "Riverside District, Zone 1",
    createdAt: "2023-04-09T14:15:00Z",
    status: "in_progress",
    summary: "Flooding damaged 10 homes, residents need shelter",
    issueType: "flooding",
    projectId: "project-1"
  }
];

// Mock project data
const projects = [
  {
    id: "project-1",
    title: "Clean Water for Flood Victims",
  },
  {
    id: "project-2",
    title: "Emergency Shelters",
  },
  {
    id: "project-3",
    title: "Medical Supplies for Rural Clinics",
  }
];

// Group reports by project and then by issue type
const groupReportsByProject = () => {
  const projectsMap: Record<string, any> = {};
  
  projects.forEach(project => {
    projectsMap[project.id] = {
      projectInfo: project,
      issueTypes: {},
      totalIssues: 0
    };
  });
  
  mockReports.forEach(report => {
    if (!report.projectId || !projectsMap[report.projectId]) return;
    
    const project = projectsMap[report.projectId];
    
    // Increment total issues count for the project
    project.totalIssues += 1;
    
    // Group by issue type within project
    if (!project.issueTypes[report.issueType]) {
      project.issueTypes[report.issueType] = {
        reports: [],
        count: 0,
        statuses: { pending: 0, in_progress: 0, completed: 0 }
      };
    }
    
    // Add report to the issue type group
    project.issueTypes[report.issueType].reports.push(report);
    project.issueTypes[report.issueType].count += 1;
    project.issueTypes[report.issueType].statuses[report.status] += 1;
  });
  
  return projectsMap;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case "in_progress":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    default:
      return null;
  }
};

const formatIssueType = (issueType: string) => {
  return issueType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const ProjectIssues = () => {
  const projectsWithIssues = groupReportsByProject();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedIssueType, setSelectedIssueType] = useState<string | null>(null);
  
  const handleBackToProjects = () => {
    setSelectedProject(null);
    setSelectedIssueType(null);
  };
  
  const handleBackToIssueTypes = () => {
    setSelectedIssueType(null);
  };

  // Render reports for a specific issue type in a project
  if (selectedProject && selectedIssueType) {
    const issueReports = projectsWithIssues[selectedProject]?.issueTypes[selectedIssueType]?.reports || [];
    const projectTitle = projectsWithIssues[selectedProject]?.projectInfo?.title;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" onClick={handleBackToIssueTypes}>← Back to Issue Types</Button>
          <h2 className="text-xl font-semibold">
            {formatIssueType(selectedIssueType)} Issues for {projectTitle}
            <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded-full">
              {issueReports.length} reports
            </span>
          </h2>
        </div>
        
        {issueReports.map((report) => (
          <Link key={report.id} to={`/reports/${report.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{report.location}</h3>
                    <p className="text-gray-600 text-sm">{report.summary}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    <Badge className={
                      report.status === "pending" ? "bg-yellow-500" : 
                      report.status === "in_progress" ? "bg-blue-500" : 
                      "bg-green-600"
                    }>
                      {report.status === "in_progress" ? "In Progress" : 
                       report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  }

  // Render issue types for a specific project
  if (selectedProject) {
    const projectData = projectsWithIssues[selectedProject];
    const issueTypes = Object.keys(projectData.issueTypes);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" onClick={handleBackToProjects}>← Back to Projects</Button>
          <h2 className="text-xl font-semibold">
            Issues for {projectData.projectInfo.title}
            <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded-full">
              {projectData.totalIssues} total reports
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issueTypes.map((issueType) => {
            const issueData = projectData.issueTypes[issueType];
            const { pending, in_progress, completed } = issueData.statuses;
            
            return (
              <Card 
                key={issueType} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedIssueType(issueType)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <div>{formatIssueType(issueType)}</div>
                    <Badge className="bg-relief-blue">{issueData.count}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      <span>Pending: {pending}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span>In Progress: {in_progress}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-green-600"></span>
                      <span>Completed: {completed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Render all projects with issue counts
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Issues Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(projectsWithIssues).map(([projectId, projectData]) => (
          <Card 
            key={projectId} 
            className={`hover:shadow-md transition-shadow cursor-pointer ${
              projectData.totalIssues > 0 ? '' : 'opacity-50'
            }`}
            onClick={() => projectData.totalIssues > 0 && setSelectedProject(projectId)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>{projectData.projectInfo.title}</div>
                <Badge className="bg-relief-blue">{projectData.totalIssues}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projectData.totalIssues > 0 ? (
                <div className="space-y-2">
                  {Object.entries(projectData.issueTypes).slice(0, 3).map(([issueType, data]: [string, any]) => (
                    <div key={issueType} className="flex justify-between text-sm items-center">
                      <span>{formatIssueType(issueType)}</span>
                      <Badge variant="outline">{data.count} reports</Badge>
                    </div>
                  ))}
                  {Object.keys(projectData.issueTypes).length > 3 && (
                    <div className="text-sm text-gray-500 text-right">
                      +{Object.keys(projectData.issueTypes).length - 3} more issue types
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No issues reported</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectIssues;
