
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mic, Send, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { AIInsights } from "@/components/AIInsights";
import { useToast } from "@/components/ui/use-toast";

export const AnonymousReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [reportText, setReportText] = useState("");
  const [location, setLocation] = useState("");
  const [crisisType, setCrisisType] = useState("flood");
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentToContact, setConsentToContact] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [insights, setInsights] = useState<null | {
    recommendations: string[];
    summary: string;
  }>(null);
  
  const handleRecording = () => {
    // In a real application, this would use the Web Speech API
    // or another voice recording library
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Mock starting recording
      setTimeout(() => {
        setReportText(prev => 
          prev + " There are 20 families here, they lost homes after the flood. We have no drinking water."
        );
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleSubmit = async () => {
    if (!reportText.trim() || !location.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a description and location of the crisis.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Mock API call delay
    setTimeout(() => {
      // Mock AI processing response
      const mockInsights = {
        recommendations: [
          "Send 50 water containers (10L each)",
          "Dispatch mobile shelter units for 20 families",
          "Send medical team to check for waterborne diseases"
        ],
        summary: "Flood disaster affecting 20 families. Urgent water needs. Housing destroyed. Medical assistance may be required."
      };
      
      setInsights(mockInsights);
      setIsSubmitting(false);
      
      toast({
        title: "Report submitted successfully",
        description: "Thank you for your report. It has been processed and will be reviewed by our team.",
        action: (
          <div className="w-full flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        ),
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Anonymous Crisis Report</h1>
          <p className="text-muted-foreground">
            Submit a report about a crisis situation. No account required.
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Submit Crisis Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location" className="mb-2 block">Location</Label>
                <Input
                  id="location"
                  placeholder="Where is this happening? (City, District, Area)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mb-4"
                />
              </div>

              <div>
                <Label htmlFor="crisis-type" className="mb-2 block">Crisis Type</Label>
                <RadioGroup 
                  value={crisisType} 
                  onValueChange={setCrisisType}
                  className="flex flex-wrap gap-4 mb-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flood" id="flood" />
                    <Label htmlFor="flood">Flood</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="conflict" id="conflict" />
                    <Label htmlFor="conflict">Conflict</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="earthquake" id="earthquake" />
                    <Label htmlFor="earthquake">Earthquake</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="report-text" className="mb-2 block">Description</Label>
                <Textarea
                  id="report-text"
                  placeholder="Describe the situation in detail (e.g., 'There are 20 families here, they lost homes after the flood. We have no drinking water.')"
                  className="min-h-[150px]"
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:gap-4 space-y-2 sm:space-y-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  className={`flex items-center gap-2 ${isRecording ? 'bg-red-100 text-red-600 border-red-300' : ''}`}
                  onClick={handleRecording}
                >
                  {isRecording ? (
                    <>
                      <span className="animate-pulse">●</span> Recording...
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" /> Voice Input
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button"
                  className="flex items-center gap-2 bg-relief-blue hover:bg-blue-600 flex-grow"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !reportText.trim() || !location.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id="contact-consent" 
                    checked={consentToContact}
                    onCheckedChange={(checked) => {
                      setConsentToContact(checked === true);
                    }}
                  />
                  <Label htmlFor="contact-consent">
                    I'm willing to be contacted for more information (optional)
                  </Label>
                </div>
                
                {consentToContact && (
                  <div>
                    <Input
                      placeholder="Phone number or email (optional)"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm">
                  Your report will be submitted anonymously unless you provide contact information. 
                  An NGO representative may follow up if you've provided contact details.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {insights && <AIInsights insights={insights} />}

          <div className="text-center mt-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-relief-blue hover:text-relief-blue hover:bg-blue-50"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousReport;
