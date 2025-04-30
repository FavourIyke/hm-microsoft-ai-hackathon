import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, ArrowDownUp } from "lucide-react";

const IssuesPage = () => {
  const [category, setCategory] = useState("Water");
  const [status, setStatus] = useState("Open");
  const [searchQuery, setSearchQuery] = useState("");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(100); // You can adjust the limit as needed

  const fetchIssues = async () => {
    if (loading || !hasMore) return; // Prevent duplicate requests or loading when there are no more issues
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/issues?status=${status}&page=${page}&limit=${limit}`
      );
      const data = await response.json();

      // Ensure data.data is an array before accessing its length
      if (Array.isArray(data.data)) {
        if (data.data.length < limit) {
          setHasMore(false); // No more issues to load
        }

        setIssues((prevIssues) => [...prevIssues, ...data.data]); // Use data.data for the issues
        setPage(page + 1); // Increment page number for the next request
      } else {
        console.error("Unexpected data structure:", data); // Log the unexpected structure for debugging
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [category, status, searchQuery]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const bottom = target.scrollHeight === target.scrollTop + target.clientHeight;
    if (bottom && hasMore) {
      fetchIssues();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">All Issues</h1>
          <p className="text-muted-foreground">View and manage all issues</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">--All--</SelectItem>
                  <SelectItem value="Water">Water</SelectItem>
                  <SelectItem value="Electricity">Electricity</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
              <Button variant="outline">
                <ArrowDownUp className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto" onScroll={handleScroll}>

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Summary</TableHead>
      <TableHead>Location</TableHead>
      <TableHead>Category</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Progress</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {issues.map((issue) => {
      const fullLocation = `${issue.address || ""}, ${issue.city || ""}, ${issue.state || ""}`;
      return (
        <TableRow 
        key={issue.id}
        className="cursor-pointer hover:bg-gray-50"
        onClick={() => window.location.href = `/reports/${issue.id}`}
      >          
          <TableCell className="max-w-[300px] truncate whitespace-nowrap overflow-hidden">
            {issue.related_summary}
          </TableCell>
          <TableCell className="max-w-[250px] truncate whitespace-nowrap overflow-hidden flex items-center gap-1">
          <MapPin className="w-4 h-4 text-muted-foreground" />
            {fullLocation}
          </TableCell>
          <TableCell>{issue.category}</TableCell>
          <TableCell>
            <Badge>{issue.status}</Badge>
          </TableCell>
          <TableCell>
            {issue.created_at
              ? new Date(issue.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Invalid Date"}
          </TableCell>
          <TableCell>
            {issue.progress}%
            <Progress value={issue.progress || 0} max={100} />
          </TableCell>
        </TableRow>
      );
    })}
  </TableBody>
</Table>


            {loading && <div className="text-center py-4">Loading...</div>}
            {!hasMore && <div className="text-center py-4">No more issues</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuesPage;
