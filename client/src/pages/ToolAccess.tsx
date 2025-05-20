import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Wrench, Clock, CreditCard, AlertCircle } from 'lucide-react';

interface Tool {
  id: number;
  name: string;
  description: string;
  type: 'gis' | 'cad' | 'analysis' | 'other';
  status: 'active' | 'maintenance' | 'inactive';
  creditCost: number;
  features: string[];
}

interface ToolUsage {
  id: number;
  toolId: number;
  startTime: string;
  endTime: string | null;
  creditsUsed: number;
  status: 'active' | 'completed' | 'cancelled';
}

interface MemberCredit {
  id: number;
  userId: number;
  balance: number;
  lastUpdated: string;
}

export default function ToolAccess() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [activeUsage, setActiveUsage] = useState<ToolUsage | null>(null);
  const [credits, setCredits] = useState<MemberCredit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  useEffect(() => {
    fetchTools();
    fetchActiveUsage();
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

  const fetchActiveUsage = async () => {
    try {
      const response = await fetch('/api/tools/usage/active');
      const data = await response.json();
      setActiveUsage(data);
    } catch (error) {
      toast.error('Failed to fetch active usage');
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

  const handleStartTool = async (tool: Tool) => {
    if (!credits || credits.balance < tool.creditCost) {
      toast.error('Insufficient credits');
      navigate('/credits/purchase');
      return;
    }

    setIsStarting(true);

    try {
      const response = await fetch('/api/tools/usage/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: tool.id })
      });

      if (!response.ok) throw new Error('Failed to start tool');

      const data = await response.json();
      setActiveUsage(data);
      toast.success('Tool started successfully');
    } catch (error) {
      toast.error('Failed to start tool');
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopTool = async () => {
    if (!activeUsage) return;

    setIsStopping(true);

    try {
      const response = await fetch(`/api/tools/usage/${activeUsage.id}/stop`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to stop tool');

      setActiveUsage(null);
      fetchCredits();
      toast.success('Tool stopped successfully');
    } catch (error) {
      toast.error('Failed to stop tool');
    } finally {
      setIsStopping(false);
    }
  };

  const getToolIcon = (type: Tool['type']) => {
    switch (type) {
      case 'gis':
        return <Wrench className="w-6 h-6 text-blue-500" />;
      case 'cad':
        return <Wrench className="w-6 h-6 text-green-500" />;
      case 'analysis':
        return <Wrench className="w-6 h-6 text-purple-500" />;
      default:
        return <Wrench className="w-6 h-6 text-gray-500" />;
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
          <h1 className="text-3xl font-bold mb-2">Tool Access</h1>
          <p className="text-gray-600">Access and manage your professional tools</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Available Credits</p>
            <p className="text-2xl font-bold">{credits?.balance || 0}</p>
          </div>
          <Button
            onClick={() => navigate('/credits/purchase')}
            variant="outline"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Buy Credits
          </Button>
        </div>
      </div>

      {activeUsage && (
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <CardTitle>Active Tool Session</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {tools.find(t => t.id === activeUsage.toolId)?.name}
                </p>
                <p className="text-sm text-gray-500">
                  Started {new Date(activeUsage.startTime).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">Credits Used</p>
                <p className="text-lg font-bold">{activeUsage.creditsUsed}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={handleStopTool}
              disabled={isStopping}
            >
              {isStopping ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Stopping...
                </div>
              ) : (
                'Stop Tool'
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            className={`${
              tool.status !== 'active' ? 'opacity-50' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                {getToolIcon(tool.type)}
                <CardTitle>{tool.name}</CardTitle>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Features</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {tool.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Credit Cost</p>
                  <p className="text-lg font-bold">{tool.creditCost} credits/hour</p>
                </div>
                {tool.status !== 'active' && (
                  <div className="text-sm text-red-600">
                    {tool.status === 'maintenance' ? 'Under Maintenance' : 'Currently Unavailable'}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#1E5631] hover:bg-[#154525]"
                onClick={() => handleStartTool(tool)}
                disabled={
                  tool.status !== 'active' ||
                  isStarting ||
                  isStopping ||
                  activeUsage !== null ||
                  !credits ||
                  credits.balance < tool.creditCost
                }
              >
                {isStarting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Starting...
                  </div>
                ) : (
                  'Start Tool'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 