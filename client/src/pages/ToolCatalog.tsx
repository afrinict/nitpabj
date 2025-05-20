import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Map, Globe, Ruler, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Tool {
  id: number;
  name: string;
  description: string;
  type: 'gis' | 'cad' | 'coordinate_locator' | 'other';
  status: 'active' | 'maintenance' | 'deprecated';
  creditCost: number;
  creditCostUnit: string;
  features: string[];
  url?: string;
  iframeUrl?: string;
}

interface MemberCredit {
  balance: number;
}

export default function ToolCatalog() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [credits, setCredits] = useState<MemberCredit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchTools();
    fetchCredits();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/tools');
      const data = await response.json();
      setTools(data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to fetch tools');
      setIsLoading(false);
    }
  };

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/credits/balance');
      const data = await response.json();
      setCredits(data);
    } catch (error) {
      toast.error('Failed to fetch credit balance');
    }
  };

  const handleToolAccess = async (tool: Tool) => {
    if (!credits || credits.balance < tool.creditCost) {
      toast.error('Insufficient credits. Please purchase more credits to use this tool.');
      navigate('/credits/purchase');
      return;
    }

    try {
      const response = await fetch(`/api/tools/${tool.id}/access`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to access tool');

      const { accessToken, sessionId } = await response.json();
      
      // Store session info and redirect to tool
      localStorage.setItem('toolSessionId', sessionId);
      localStorage.setItem('toolAccessToken', accessToken);
      
      if (tool.iframeUrl) {
        navigate(`/tools/${tool.id}`);
      } else if (tool.url) {
        window.open(tool.url, '_blank');
      }
    } catch (error) {
      toast.error('Failed to access tool');
    }
  };

  const getToolIcon = (type: string) => {
    switch (type) {
      case 'gis':
        return <Map className="w-6 h-6" />;
      case 'cad':
        return <Ruler className="w-6 h-6" />;
      case 'coordinate_locator':
        return <Globe className="w-6 h-6" />;
      default:
        return <Wrench className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'deprecated':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E5631]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Professional Tools</h1>
          <p className="text-gray-600">Access NITP's professional tools and resources</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Available Credits</p>
            <p className="text-2xl font-bold">{credits?.balance || 0}</p>
          </div>
          <Button
            onClick={() => navigate('/credits/purchase')}
            className="bg-[#1E5631] hover:bg-[#154525]"
          >
            Purchase Credits
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="gis">GIS Tools</TabsTrigger>
          <TabsTrigger value="cad">CAD Tools</TabsTrigger>
          <TabsTrigger value="coordinate_locator">Coordinate Locator</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools
              .filter(tool => activeTab === 'all' || tool.type === activeTab)
              .map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {getToolIcon(tool.type)}
                        <div>
                          <CardTitle>{tool.name}</CardTitle>
                          <CardDescription className="mt-1">{tool.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(tool.status)}>
                        {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {tool.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Credit Cost</span>
                        <span className="font-semibold">
                          {tool.creditCost} credits / {tool.creditCostUnit}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-[#1E5631] hover:bg-[#154525]"
                      onClick={() => handleToolAccess(tool)}
                      disabled={tool.status !== 'active'}
                    >
                      {tool.status === 'active' ? 'Access Tool' : 'Tool Unavailable'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 