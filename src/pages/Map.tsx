import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Map = () => {
  // Simulate field map data with alert points
  const alertPoints = [
    { id: 1, x: 25, y: 30, severity: "high" },
    { id: 2, x: 60, y: 45, severity: "medium" },
    { id: 3, x: 40, y: 70, severity: "high" },
    { id: 4, x: 75, y: 25, severity: "low" },
    { id: 5, x: 30, y: 55, severity: "high" },
  ];

  const getPointColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-danger";
      case "medium": return "bg-warning";
      case "low": return "bg-primary";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-subtle-gradient">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Solo Seguro</h1>
          <h2 className="text-xl text-earth-gradient font-semibold">Trigo</h2>
        </div>

        {/* Map Container */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-br from-green-200 to-green-400 h-96 w-full">
              {/* Field representation */}
              <div className="absolute inset-4 bg-gradient-to-br from-green-300 to-green-500 rounded-lg">
                {/* Grid lines to simulate field sections */}
                <svg className="absolute inset-0 w-full h-full opacity-30">
                  <defs>
                    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                
                {/* Alert points */}
                {alertPoints.map((point) => (
                  <div
                    key={point.id}
                    className={`absolute w-4 h-4 rounded-full ${getPointColor(point.severity)} border-2 border-white shadow-lg animate-pulse`}
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Section */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-danger rounded-full flex items-center justify-center mb-4 shadow-lg">
            <AlertTriangle className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <Alert className="border-danger bg-danger/5 text-center">
          <AlertDescription className="text-danger font-bold text-lg">
            ATENÇÃO
          </AlertDescription>
        </Alert>

        {/* Legend */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 text-center">Legenda</h3>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-danger"></div>
                <span className="text-sm">Alto risco</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span className="text-sm">Médio risco</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm">Baixo risco</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Map;