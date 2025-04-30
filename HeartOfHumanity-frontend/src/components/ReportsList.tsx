import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock, CheckCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Report {
  id: string;
  description: string;
  status: string;
  state: string;
  created_at: string;
  progress: number;
  related_summary: string;
  report_count: number;
  address?: string; // Added address property
  city?: string;    // Ensure city, state, and country are optional
  country?: string;
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return <Badge className="bg-yellow-500">Pending</Badge>;
    case "in_progress":
      return <Badge className="bg-blue-500">Resources Dispatched</Badge>;
    case "completed":
      return <Badge className="bg-green-600">Completed</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case "in_progress":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    default:
      return null;
  }
};

const getFullAddress = (report: Report) => {
  const { address, city, state, country } = report;
  const addressParts = [address, city, state, country].filter(Boolean);

  if (city === state) {
    addressParts.splice(1, 1); // Remove duplicate city/state
  }

  return addressParts.join(", ") || "Unknown Location";
};

export const ReportsList = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Make a request with pagination parameters
    axios.get<{ status: boolean; data: Report[] }>("http://localhost:3000/issues?page=1&limit=7") // Paginate with page=1 and limit=7
      .then((res) => {
        if (res.data.status && Array.isArray(res.data.data)) {
          setReports(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load reports:", err);
      });
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Recent Crisis Reports</h2>
      
      {reports.map((report) => (
        <Link key={report.id} to={`/reports/${report.id}`} className="block">
          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {getFullAddress(report)}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {new Date(report.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(report.status)}
                  {getStatusBadge(report.status)}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm mb-3">{report.related_summary || report.description}</p>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Resource deployment:</span>
                  <span className="font-medium">{report.progress}%</span>
                </div>
                <Progress value={report.progress} className="h-2" />
              </div>

              {report.report_count > 1 && (
                <div className="mt-3 flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{report.report_count} related reports</span>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}

      <div className="text-center mt-6">
        <Link to="/reports" className="text-blue-600 hover:underline">
          View All Reports
        </Link>
      </div>
    </div>
  );
};

export default ReportsList;
