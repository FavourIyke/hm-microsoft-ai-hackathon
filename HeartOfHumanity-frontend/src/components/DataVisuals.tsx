
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

// Mock data for charts
const statusData = [
  { name: "Pending", value: 5, color: "#F59E0B" },
  { name: "In Progress", value: 8, color: "#3B82F6" },
  { name: "Completed", value: 12, color: "#10B981" },
];

const resourcesData = [
  { name: "Food", dispatched: 120, required: 150 },
  { name: "Water", dispatched: 200, required: 250 },
  { name: "Shelter", dispatched: 45, required: 50 },
  { name: "Medicine", dispatched: 80, required: 100 },
];

export const DataVisuals = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Crisis Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Resources Dispatched vs. Required</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={resourcesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="dispatched" name="Dispatched" stackId="a" fill="#3B82F6" />
              <Bar dataKey="required" name="Required" stackId="a" fill="#E5E7EB" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
