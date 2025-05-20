import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Tools() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Professional Tools</h1>
        
        <Tabs defaultValue="planning" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="planning">Planning Tools</TabsTrigger>
            <TabsTrigger value="design">Design Tools</TabsTrigger>
            <TabsTrigger value="analysis">Analysis Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="planning">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Site Analysis</CardTitle>
                  <CardDescription>Comprehensive site analysis tools for urban planning</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Access tools for analyzing site conditions, demographics, and environmental factors.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Zoning Calculator</CardTitle>
                  <CardDescription>Calculate zoning requirements and restrictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Quick calculations for FAR, setbacks, and other zoning parameters.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                  <CardDescription>Project planning and scheduling tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Create and manage project timelines with milestone tracking.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="design">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Urban Design</CardTitle>
                  <CardDescription>Tools for urban design and planning</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Access urban design templates and guidelines.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>3D Modeling</CardTitle>
                  <CardDescription>3D visualization tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Create and view 3D models of urban spaces.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Design Standards</CardTitle>
                  <CardDescription>Access to design standards and guidelines</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Reference materials for urban design standards.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Data Analysis</CardTitle>
                  <CardDescription>Urban data analysis tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Analyze urban data and generate reports.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>GIS Tools</CardTitle>
                  <CardDescription>Geographic Information System tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Access GIS data and mapping tools.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Impact Assessment</CardTitle>
                  <CardDescription>Environmental and social impact assessment tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Evaluate project impacts on environment and community.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 