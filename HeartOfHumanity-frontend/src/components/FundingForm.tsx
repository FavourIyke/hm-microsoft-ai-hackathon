
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { PiggyBank, WalletCards } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const fundingOptions = [
  {
    id: "water",
    title: "Water Supply",
    description: "Fund clean water initiatives for disaster-affected regions",
    amount: 500
  },
  {
    id: "shelter",
    title: "Emergency Shelter",
    description: "Provide temporary shelters for displaced families",
    amount: 1000
  },
  {
    id: "medical",
    title: "Medical Aid",
    description: "Support medical teams in crisis zones",
    amount: 750
  },
  {
    id: "food",
    title: "Food Distribution",
    description: "Fund food supplies for communities in need",
    amount: 600
  }
];

export const FundingForm = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Funding Submitted",
        description: "Thank you for your support! We'll be in touch soon.",
      });
      navigate('/dashboard');
    }, 1500);
  };

  const selectedOption = fundingOptions.find(option => option.id === selectedProject);
  const displayAmount = selectedOption?.amount || "";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Support a Relief Project</h1>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-6 w-6 text-relief-blue" />
            Funding Information
          </CardTitle>
          <CardDescription>
            Your contribution helps provide vital resources to people in crisis
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project">Select Project to Fund</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {fundingOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.title} - ${option.amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProject && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{selectedOption?.title}</h3>
                <p className="text-gray-600 mb-2">{selectedOption?.description}</p>
                <div className="flex justify-between items-center">
                  <span>Suggested Amount:</span>
                  <span className="font-semibold text-relief-blue">${displayAmount}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="customAmount">Custom Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="customAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Your name" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Your email address" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization (Optional)</Label>
              <Input 
                id="organization" 
                value={organization} 
                onChange={(e) => setOrganization(e.target.value)} 
                placeholder="Your organization name" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea 
                id="message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Add a message with your funding" 
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-relief-blue hover:bg-blue-600 flex items-center gap-2"
              disabled={isLoading || (!selectedProject && !customAmount)}
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <WalletCards className="h-4 w-4" /> 
                  Submit Funding
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default FundingForm;
