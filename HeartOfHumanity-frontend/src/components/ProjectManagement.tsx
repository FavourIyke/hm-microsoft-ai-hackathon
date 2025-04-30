
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  FileCheck, 
  FolderOpen, 
  List, 
  Lock, 
  Users 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Project types
type ProjectVisibility = "public" | "private";

type ProjectUpdate = {
  id: string;
  date: string;
  content: string;
  author: string;
};

type ProjectExpense = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  status: "pending" | "approved" | "rejected";
};

type ManagedProject = {
  id: string;
  title: string;
  description: string;
  location: string;
  target: number;
  raised: number;
  remainingDays: number;
  imageUrl?: string;
  visibility: ProjectVisibility;
  updates: ProjectUpdate[];
  expenses: ProjectExpense[];
  team: string[];
  status: "active" | "completed" | "paused";
};

// Mock data for managed projects
const mockManagedProjects: ManagedProject[] = [
  {
    id: "project-1",
    title: "Clean Water for Flood Victims",
    description: "Providing clean water solutions for 500 families affected by recent floods.",
    location: "Coastal Region",
    target: 10000,
    raised: 6500,
    remainingDays: 15,
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop",
    visibility: "public",
    updates: [
      {
        id: "update-1",
        date: "2025-04-15",
        content: "We've successfully distributed water filters to 200 families in the most affected areas.",
        author: "Project Manager"
      },
      {
        id: "update-2",
        date: "2025-04-22",
        content: "Completed water quality testing in 3 villages. Results show significant improvement.",
        author: "Field Coordinator"
      }
    ],
    expenses: [
      {
        id: "exp-1",
        date: "2025-04-10",
        description: "Purchase of 200 water filters",
        amount: 2000,
        category: "Equipment",
        status: "approved"
      },
      {
        id: "exp-2",
        date: "2025-04-12",
        description: "Transportation of equipment to coastal villages",
        amount: 500,
        category: "Logistics",
        status: "approved"
      },
      {
        id: "exp-3",
        date: "2025-04-20",
        description: "Hiring local assistants for distribution",
        amount: 800,
        category: "Personnel",
        status: "pending"
      }
    ],
    team: ["John Doe (Manager)", "Jane Smith (Field Officer)", "Mike Johnson (Logistics)"],
    status: "active"
  },
  {
    id: "project-2",
    title: "Emergency Shelters",
    description: "Building temporary shelters for families displaced by the earthquake.",
    location: "Mountain Province",
    target: 15000,
    raised: 4200,
    remainingDays: 30,
    imageUrl: "https://images.unsplash.com/photo-1469571486292-b53601d4966f?q=80&w=2670&auto=format&fit=crop",
    visibility: "private",
    updates: [
      {
        id: "update-1",
        date: "2025-04-05",
        content: "Site preparation completed for the first 10 shelters.",
        author: "Construction Manager"
      }
    ],
    expenses: [
      {
        id: "exp-1",
        date: "2025-04-01",
        description: "Building materials for 10 shelters",
        amount: 3000,
        category: "Materials",
        status: "approved"
      }
    ],
    team: ["Alex Brown (Project Lead)", "Sarah Wilson (Community Liaison)"],
    status: "active"
  }
];

export const ProjectManagement = () => {
  const [projects] = useState<ManagedProject[]>(mockManagedProjects);
  const [selectedProject, setSelectedProject] = useState<ManagedProject | null>(null);
  const [visibilityMode, setVisibilityMode] = useState<ProjectVisibility>("public");
  const { toast } = useToast();

  const handleToggleVisibility = (project: ManagedProject) => {
    // In a real app, this would update the database
    toast({
      title: "Visibility Changed",
      description: `Project is now ${project.visibility === "public" ? "private" : "public"}`
    });
  };

  const handleCreateUpdate = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Project update creation will be available in the next release."
    });
  };

  const handleApproveExpense = (expense: ProjectExpense) => {
    toast({
      title: "Expense Approved",
      description: `Expense ${expense.id} has been approved.`
    });
  };

  return (
    <div className="space-y-6">
      {!selectedProject ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <Button className="bg-relief-blue hover:bg-blue-600">
              <FolderOpen className="mr-2 h-4 w-4" />
              Create New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription>{project.location}</CardDescription>
                    </div>
                    <Badge 
                      className={project.status === "active" ? "bg-green-500" : project.status === "paused" ? "bg-amber-500" : "bg-blue-500"}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Raised: ${project.raised.toLocaleString()}</span>
                        <span>Goal: ${project.target.toLocaleString()}</span>
                      </div>
                      <Progress value={(project.raised / project.target) * 100} className="h-2" />
                      <p className="text-xs text-gray-500 text-right">{project.remainingDays} days remaining</p>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{project.team.length} team members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {project.visibility === "public" ? (
                          <span className="flex items-center gap-1">
                            <FileCheck className="h-4 w-4" /> Public
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Lock className="h-4 w-4" /> Private
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-relief-blue hover:bg-blue-600"
                    onClick={() => setSelectedProject(project)}
                  >
                    Manage Project
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => setSelectedProject(null)}
            >
              ← Back to Projects
            </Button>
            <div className="flex items-center gap-2">
              <Badge 
                className={selectedProject.status === "active" ? "bg-green-500" : selectedProject.status === "paused" ? "bg-amber-500" : "bg-blue-500"}
              >
                {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
              </Badge>
              <Button 
                variant={selectedProject.visibility === "public" ? "outline" : "default"}
                className={selectedProject.visibility === "private" ? "bg-relief-blue hover:bg-blue-600" : ""}
                onClick={() => handleToggleVisibility(selectedProject)}
              >
                {selectedProject.visibility === "public" ? (
                  <>
                    <FileCheck className="mr-2 h-4 w-4" /> Public
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" /> Private
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{selectedProject.title}</CardTitle>
              <CardDescription>{selectedProject.location} • {selectedProject.remainingDays} days remaining</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Raised: ${selectedProject.raised.toLocaleString()}</span>
                  <span>Goal: ${selectedProject.target.toLocaleString()}</span>
                </div>
                <Progress value={(selectedProject.raised / selectedProject.target) * 100} className="h-2" />
                <p className="text-gray-600 mt-4">{selectedProject.description}</p>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="updates" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="finances">Finances</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="updates" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Project Updates</h3>
                <Button className="bg-relief-orange hover:bg-orange-600" onClick={handleCreateUpdate}>
                  + New Update
                </Button>
              </div>
              
              {selectedProject.updates.length > 0 ? (
                <div className="space-y-4">
                  {selectedProject.updates.map(update => (
                    <Card key={update.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{update.author}</CardTitle>
                          <CardDescription>{update.date}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{update.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-50">
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <List className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No updates posted yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="finances" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Financial Tracking</h3>
                <Button className="bg-relief-orange hover:bg-orange-600">
                  + Record Expense
                </Button>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProject.expenses.map(expense => (
                        <TableRow key={expense.id}>
                          <TableCell>{expense.date}</TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell>${expense.amount}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                expense.status === "approved" ? "bg-green-500" : 
                                expense.status === "rejected" ? "bg-red-500" : 
                                "bg-amber-500"
                              }
                            >
                              {expense.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {expense.status === "pending" && (
                              <Button 
                                size="sm" 
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => handleApproveExpense(expense)}
                              >
                                Approve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Total Raised</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-relief-blue">
                      ${selectedProject.raised.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Total Spent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-relief-orange">
                      ${selectedProject.expenses
                        .filter(e => e.status === "approved")
                        .reduce((sum, expense) => sum + expense.amount, 0)
                        .toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Remaining Budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-500">
                      ${(selectedProject.raised - 
                        selectedProject.expenses
                          .filter(e => e.status === "approved")
                          .reduce((sum, expense) => sum + expense.amount, 0)
                      ).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Project Team</h3>
                <Button className="bg-relief-orange hover:bg-orange-600">
                  + Add Team Member
                </Button>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {selectedProject.team.map((member, index) => (
                      <li key={index} className="flex items-center justify-between p-3 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-relief-blue text-white flex items-center justify-center">
                            {member.charAt(0)}
                          </div>
                          <span>{member}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Manage Access
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" /> Project Analytics
                  </CardTitle>
                  <CardDescription>Tracking project performance and impact</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6 min-h-[300px]">
                  <div className="text-center text-gray-500">
                    <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="mb-2">Analytics functionality coming soon</p>
                    <p className="text-sm">Track your project's impact, beneficiary reach, and funding milestones</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
