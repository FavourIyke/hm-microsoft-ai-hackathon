
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";

type AIInsightsProps = {
  insights: {
    recommendations: string[];
    summary: string;
  };
};

export const AIInsights = ({ insights }: AIInsightsProps) => {
  return (
    <Card className="border-4 border-relief-blue shadow-md animate-fade-in">
      <CardHeader className="bg-relief-blue bg-opacity-10 border-b border-relief-blue">
        <CardTitle className="text-xl flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Analysis & Recommendations
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-relief-orange" />
            Situation Summary
          </h3>
          <p className="text-md bg-relief-lightGray p-3 rounded-md border border-gray-200">
            {insights.summary}
          </p>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Recommended Actions
          </h3>
          <ul className="space-y-2">
            {insights.recommendations.map((rec, index) => (
              <li key={index} className="flex items-center gap-3 bg-green-50 p-3 rounded-md border border-green-100">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
