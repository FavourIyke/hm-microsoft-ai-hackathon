import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, ArrowLeft, AlertCircle } from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";

// Group reports by issue type
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Open":
      return <Badge className="bg-yellow-500">Pending</Badge>;
    case "in_progress":
      return <Badge className="bg-blue-500">Resources Dispatched</Badge>;
    case "completed":
      return <Badge className="bg-green-600">Completed</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const formatIssueType = (issueType: string) => {
  return issueType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);  // To store the fetched report
  const [relatedReports, setRelatedReports] = useState<any[]>([]);  // To store related reports
  const [isLoading, setIsLoading] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state

  useEffect(() => {
    // Fetch report data
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{ data: { issue: any; related_issues: any[] } }>(`http://localhost:3000/issues/${id}`);
        const fetchedReport = response.data.data.issue; // Adjusted to match the correct property structure

        setReport(fetchedReport);
        setRelatedReports(response.data.data.related_issues || []);  // Adjusted to match the correct property name
      } catch (err) {
        setError("Failed to fetch report details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchReportData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading report details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>{error}</p>
      </div>
    );
  }

  if (!report) {
    return <Navigate to="/reports" replace />;
  }

  // Count total reports for this issue type
  const totalReportsForIssueType = relatedReports.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/reports">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Crisis Report Details</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-9 w-5 text-gray-500" />
                  {report.address}, {report.city}, {report.state}
                </div>
                {getStatusBadge(report.status)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              {new Date(report.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Title</h3>
              <p>{report.action_title}</p>
            </div>

            <div className="space-y-2">
            <h3 className="font-semibold">Estimated Cost</h3>
            <p>${new Intl.NumberFormat().format(report.estimated_cost)}</p>
            </div>

            
            <div className="space-y-2">
              <h3 className="font-semibold">Summary</h3>
              <p>{report.description}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              <p>{report.description}</p>
            </div>

          <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <div>
              <span className="font-medium">Priority:</span>{" "}
              <Badge className="bg-blue-500 ml-1">
                {report.priority}
              </Badge>
              {totalReportsForIssueType > 0 && (
              <span className="ml-2 text-sm text-blue-700">
               {totalReportsForIssueType} other report(s) have been made on this.
              </span>
              )}
            </div>
          </div>

          <div className="pt-2">
          <h3 className="font-semibold mb-2">Support this Project <span role="img" aria-label="green-heart">💚</span></h3>
          <Link to={`/funding?project=${report.projectId}`}>
          <Button variant="outline" className="text-relief-blue border-relief-blue">
           Fund Project
          </Button>
          </Link>
          </div>


            <div className="space-y-2">
              <h3 className="font-semibold">Resource Deployment Progress</h3>
              <div className="w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span>Status</span>
                  <span>{report.progress}%</span>
                </div>
                <Progress value={report.progress} className="h-2" />
              </div>
            </div>

          </CardContent>
        </Card>

        {relatedReports.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Related Reports ({totalReportsForIssueType})</h2>
            <div className="space-y-4">
              {relatedReports.map((relatedReport) => (
                <Link key={relatedReport.id} to={`/reports/${relatedReport.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{relatedReport.address}</h3>
                          <p className="text-sm text-gray-600">{relatedReport.related_summary}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          {getStatusBadge(relatedReport.status)}
                          <span className="text-xs text-gray-500 mt-1">
                            {new Date(relatedReport.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDetails;
