import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Package, History } from 'lucide-react';

interface CreditPackage {
  id: number;
  name: string;
  description: string;
  credits: number;
  price: number;
  isActive: boolean;
}

interface CreditTransaction {
  id: number;
  type: 'purchase' | 'usage' | 'refund' | 'adjustment';
  amount: number;
  description: string;
  paymentReference: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentAmount: number;
  createdAt: string;
}

export default function CreditPurchase() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPackages();
    fetchTransactions();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/credits/packages');
      const data = await response.json();
      setPackages(data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to fetch credit packages');
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/credits/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage && !customAmount) {
      toast.error('Please select a package or enter a custom amount');
      return;
    }

    setIsProcessing(true);

    try {
      const amount = selectedPackage ? selectedPackage.credits : parseInt(customAmount);
      const price = selectedPackage ? selectedPackage.price : (amount / 6); // 1 Naira = 6 Credits

      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          price,
          packageId: selectedPackage?.id
        })
      });

      if (!response.ok) throw new Error('Failed to process purchase');

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    } catch (error) {
      toast.error('Failed to process purchase');
      setIsProcessing(false);
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
          <h1 className="text-3xl font-bold mb-2">Purchase Credits</h1>
          <p className="text-gray-600">Buy credits to access NITP's professional tools</p>
        </div>
        <Button
          onClick={() => navigate('/tools')}
          variant="outline"
        >
          Back to Tools
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Credit Packages</CardTitle>
              <CardDescription>Choose a package or enter a custom amount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {packages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`cursor-pointer transition-all ${
                      selectedPackage?.id === pkg.id
                        ? 'border-[#1E5631] ring-2 ring-[#1E5631]'
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setCustomAmount('');
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      </div>
                      <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{pkg.credits} Credits</span>
                        <span className="text-lg">₦{pkg.price.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="customAmount">Custom Amount (Credits)</Label>
                    <Input
                      id="customAmount"
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedPackage(null);
                      }}
                      placeholder="Enter amount in credits"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Estimated Cost (₦)</Label>
                    <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">
                      {customAmount ? `₦${(parseInt(customAmount) / 6).toFixed(2)}` : '₦0.00'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#1E5631] hover:bg-[#154525]"
                onClick={handlePurchase}
                disabled={isProcessing || (!selectedPackage && !customAmount)}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Purchase Credits
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5" />
                <CardTitle>Transaction History</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'purchase' ? '+' : '-'}{transaction.amount} Credits
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.paymentStatus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 