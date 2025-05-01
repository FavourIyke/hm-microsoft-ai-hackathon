
import React, { useState } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Info, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

// African-inspired color palette
const COLORS = {
  background: '#FDF7E9',     // Soft cream
  text: '#6B4423',           // Rich brown
  cardBg: '#FBEEE2',         // Warm beige 
  border: '#D4A675',         // Sandy brown
  lowIssues: '#4C7F3D',      // Earthy green
  mediumIssues: '#E48F32',   // Warm orange
  highIssues: '#B03A2E',     // Rich red
  accent: '#D4A675'          // Sandy brown
};

// Mock data for reported issues by region
const mockRegionData = {
  'Lagos': { 
    issueCount: 75, 
    coordinates: [6.5244, 3.3792],
    issueTypes: {
      'flooding': 32,
      'food_shortage': 18,
      'medical_emergency': 25
    }
  },
  'Kano': { 
    issueCount: 45, 
    coordinates: [12.0022, 8.5920],
    issueTypes: {
      'flooding': 10,
      'food_shortage': 30,
      'medical_emergency': 5
    }
  },
  'Abuja': { 
    issueCount: 30, 
    coordinates: [9.0765, 7.3986],
    issueTypes: {
      'flooding': 5,
      'food_shortage': 15,
      'medical_emergency': 10
    }
  },
  'Port Harcourt': { 
    issueCount: 60, 
    coordinates: [4.8156, 7.0498],
    issueTypes: {
      'flooding': 40,
      'food_shortage': 5,
      'medical_emergency': 15
    }
  },
  'Ibadan': { 
    issueCount: 65, 
    coordinates: [7.3775, 3.9470],
    issueTypes: {
      'flooding': 35,
      'food_shortage': 20,
      'medical_emergency': 10
    }
  },
  'Kaduna': { 
    issueCount: 55, 
    coordinates: [10.5222, 7.4383],
    issueTypes: {
      'flooding': 15,
      'food_shortage': 25,
      'medical_emergency': 15
    }
  }
};

const getMarkerColor = (issueCount: number) => {
  if (issueCount <= 30) return COLORS.lowIssues;
  if (issueCount <= 70) return COLORS.mediumIssues;
  return COLORS.highIssues;
};

const getMarkerRadius = (issueCount: number) => {
  return Math.max(10, Math.min(25, issueCount / 4)); // Scale radius between 10-25 based on issue count
};

const formatIssueType = (issueType: string) => {
  return issueType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PovertyMap = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMarkerClick = (region: string) => {
    setSelectedRegion(region);
    // Navigate to a detailed view for this region
    // We'll use a mock report ID for this demo
    const reportId = region === 'Lagos' ? '1' : 
                    region === 'Kano' ? '2' : 
                    region === 'Port Harcourt' ? '9' : 
                    region === 'Ibadan' ? '5' : 
                    region === 'Kaduna' ? '7' : '1';
    navigate(`/reports/${reportId}`);
  };

  const handleMarkerMouseOver = (region: string) => {
    setHoveredRegion(region);
  };

  const handleMarkerMouseOut = () => {
    setHoveredRegion(null);
  };

  // Calculate total issues for the entire map
  const totalIssues = Object.values(mockRegionData).reduce(
    (sum, region) => sum + region.issueCount, 0
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background, padding: '1rem' }}>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: COLORS.text }}>Impact Zones</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Legend Sidebar */}
          <div className="space-y-4">
            <Card style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold" style={{ color: COLORS.text }}>
                  Issue Density Legend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.lowIssues }} />
                    <span className="text-sm" style={{ color: COLORS.text }}>Low (0-30 reports)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.mediumIssues }} />
                    <span className="text-sm" style={{ color: COLORS.text }}>Medium (31-70 reports)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.highIssues }} />
                    <span className="text-sm" style={{ color: COLORS.text }}>High (71+ reports)</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
                    Total Reports: <span className="text-relief-blue">{totalIssues}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold" style={{ color: COLORS.text }}>
                  Selected Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRegion ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5" style={{ color: COLORS.accent }} />
                      <div>
                        <p className="font-medium" style={{ color: COLORS.text }}>{selectedRegion}</p>
                        <p style={{ color: COLORS.text }}>
                          Total Reports: {mockRegionData[selectedRegion as keyof typeof mockRegionData].issueCount}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium" style={{ color: COLORS.text }}>Breakdown by Issue Type:</h4>
                      {Object.entries(mockRegionData[selectedRegion as keyof typeof mockRegionData].issueTypes).map(([issueType, count]) => (
                        <div key={issueType} className="flex justify-between text-sm">
                          <span style={{ color: COLORS.text }}>{formatIssueType(issueType)}:</span>
                          <span className="font-medium" style={{ color: COLORS.text }}>{count}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link to="/reports" className="inline-flex items-center text-xs text-relief-blue hover:underline">
                      <AlertCircle className="h-3.5 w-3.5 mr-1" />
                      View all reports from this region
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-sm">
                    <Info className="h-4 w-4 mt-0.5" style={{ color: COLORS.accent }} />
                    <div style={{ color: COLORS.text }}>
                      <p>Hover over a marker on the map for quick details</p>
                      <p className="mt-1">Click a marker to view full reports</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {hoveredRegion && hoveredRegion !== selectedRegion && (
              <Card style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold" style={{ color: COLORS.text }}>
                    {hoveredRegion} Quick View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p style={{ color: COLORS.text }}>
                      Total Reports: <span className="font-medium">{mockRegionData[hoveredRegion as keyof typeof mockRegionData].issueCount}</span>
                    </p>
                    <p className="text-xs" style={{ color: COLORS.text }}>Click to see detailed breakdown</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3">
            <div 
              className="h-[70vh] rounded-lg shadow-lg overflow-hidden"
              style={{ border: `2px solid ${COLORS.border}` }}
            >
              <MapContainer
                bounds={[[4.277144, 2.668432], [13.892007, 14.680073]]}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {Object.entries(mockRegionData).map(([region, data]) => (
                  <CircleMarker
                    key={region}
                    center={data.coordinates as [number, number]}
                    pathOptions={{
                      fillColor: getMarkerColor(data.issueCount),
                      fillOpacity: 0.7,
                      color: 'white',
                      weight: 1,
                      radius: getMarkerRadius(data.issueCount)
                    }}
                    eventHandlers={{
                      click: () => handleMarkerClick(region),
                      mouseover: () => handleMarkerMouseOver(region),
                      mouseout: () => handleMarkerMouseOut()
                    }}
                  >
                    <Popup>
                      <div className="p-2" style={{ color: COLORS.text }}>
                        <h3 className="font-semibold">{region}</h3>
                        <p>Total Reports: {data.issueCount}</p>
                        <div className="text-xs mt-2">
                          {Object.entries(data.issueTypes).map(([issueType, count]) => (
                            <div key={issueType} className="flex justify-between mb-1">
                              <span>{formatIssueType(issueType)}:</span>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                        </div>
                        <button 
                          className="mt-3 w-full text-center py-1 rounded text-xs font-medium bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => handleMarkerClick(region)}
                        >
                          View Detailed Reports
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PovertyMap;
