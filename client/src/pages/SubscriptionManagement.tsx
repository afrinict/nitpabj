import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, CreditCard, History, AlertCircle, CheckCircle2, XCircle, Download } from 'lucide-react';
import { format } from 'date-fns';

interface Subscription {
  id: number;
  status: 'active' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  amount: number;
  membershipType: 'student' | 'associate' | 'professional' | 'fellow';
  paymentStatus: 'completed' | 'pending' | 'failed';
  receiptNumber: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'transfer';
}

const MEMBERSHIP_FEES = {
  student: 10000,
  associate: 25000,
  professional: 50000,
  fellow: 90000
};

export default function SubscriptionManagement() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [history, setHistory] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (subscription?.endDate) {
      const today = new Date();
      const expiryDate = new Date(subscription.endDate);
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilExpiry(diffDays);
    }
  }, [subscription]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/current');
      const data = await response.json();
      setSubscription(data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to fetch subscription details');
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/subscription/history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      toast.error('Failed to fetch subscription history');
    }
  };

  const handleRenewal = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/subscription/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: selectedPaymentMethod,
          amount: MEMBERSHIP_FEES[subscription?.membershipType || 'associate']
        })
      });

      if (!response.ok) throw new Error('Failed to process renewal');

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    } catch (error) {
      toast.error('Failed to process renewal');
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (subscriptionId: number) => {
    setIsVerifying(true);
    try {
      const response = await fetch(`/api/subscription/verify/${subscriptionId}`);
      const data = await response.json();
      setPaymentStatus(data.status);
      
      if (data.status === 'completed') {
        toast.success('Payment verified successfully');
        fetchSubscription();
        fetchHistory();
      } else {
        toast.info('Payment is still processing');
      }
    } catch (error) {
      toast.error('Failed to verify payment');
    } finally {
      setIsVerifying(false);
    }
  };

  const downloadReceipt = async (subscriptionId: number) => {
    try {
      const response = await fetch(`/api/subscription/receipt/${subscriptionId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${subscriptionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'expired':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMembershipTypeLabel = (type: string) => {
    switch (type) {
      case 'student':
        return 'Student Member';
      case 'associate':
        return 'Associate Member';
      case 'professional':
        return 'Professional Member';
      case 'fellow':
        return 'Fellow';
      default:
        return type;
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
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1E5631] to-[#2E7D32] bg-clip-text text-transparent">
            Subscription Management
          </h1>
          <p className="text-gray-600">Manage your NITP membership subscription</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Current Subscription</CardTitle>
                  <CardDescription>
                    {subscription?.status === 'active' 
                      ? `Valid until ${format(new Date(subscription.endDate), 'MMMM dd, yyyy')}`
                      : 'Your subscription has expired'}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(subscription?.status || '')}>
                  {subscription?.status ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) : 'Unknown'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Membership Type</p>
                    <p className="font-medium">
                      {getMembershipTypeLabel(subscription?.membershipType || '')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Annual Fee</p>
                    <p className="font-medium">
                      ₦{MEMBERSHIP_FEES[subscription?.membershipType || 'associate'].toLocaleString()}
                    </p>
                  </div>
                </div>

                {subscription?.status === 'active' && daysUntilExpiry <= 30 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Subscription Expiring Soon</p>
                        <p className="text-sm text-yellow-700">
                          Your subscription will expire in {daysUntilExpiry} days. 
                          Renew now to maintain uninterrupted access to all NITP services.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {subscription?.status === 'expired' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Subscription Expired</p>
                        <p className="text-sm text-red-700">
                          Your subscription has expired. Renew now to regain access to all NITP services.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={isRenewalDialogOpen} onOpenChange={setIsRenewalDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full bg-[#1E5631] hover:bg-[#154525]"
                    disabled={subscription?.status === 'active' && daysUntilExpiry > 30}
                  >
                    {subscription?.status === 'active' ? 'Renew Subscription' : 'Subscribe Now'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Renew Subscription</DialogTitle>
                    <DialogDescription>
                      Complete your subscription renewal payment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <p className="text-sm text-gray-500">Amount Due</p>
                      <p className="text-2xl font-bold">
                        ₦{MEMBERSHIP_FEES[subscription?.membershipType || 'associate'].toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Payment Method</p>
                      <Select
                        value={selectedPaymentMethod}
                        onValueChange={setSelectedPaymentMethod}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsRenewalDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#1E5631] hover:bg-[#154525]"
                      onClick={handleRenewal}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Proceed to Payment
                        </div>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5" />
                <CardTitle>Subscription History</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Receipt Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {format(new Date(record.startDate), 'yyyy')}
                      </TableCell>
                      <TableCell>₦{record.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {format(new Date(record.startDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{record.receiptNumber}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {record.paymentStatus === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => verifyPayment(record.id)}
                              disabled={isVerifying}
                            >
                              {isVerifying ? 'Verifying...' : 'Verify Payment'}
                            </Button>
                          )}
                          {record.paymentStatus === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadReceipt(record.id)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Receipt
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-[#1E5631] text-white px-3 py-1 rounded-full text-sm">Annual</span>
                Membership Categories
              </CardTitle>
              <CardDescription>Subscription fees for different membership types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(MEMBERSHIP_FEES).map(([type, amount]) => (
                  <div
                    key={type}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{getMembershipTypeLabel(type)}</p>
                      <p className="text-sm text-gray-500">
                        {type === 'student' && 'Full-time students'}
                        {type === 'associate' && 'Graduates with less than 5 years experience'}
                        {type === 'professional' && 'Graduates with 5+ years experience'}
                        {type === 'fellow' && 'Distinguished professionals'}
                      </p>
                    </div>
                    <p className="font-bold text-[#1E5631]">₦{amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-[#1E5631] text-white px-3 py-1 rounded-full text-sm">Access</span>
                Member Benefits
              </CardTitle>
              <CardDescription>Services included with your subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: 'SAR and EIAR Applications',
                    description: 'Submit and track applications',
                    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
                  },
                  {
                    title: 'E-Library Access',
                    description: 'Access to digital resources',
                    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
                  },
                  {
                    title: 'E-Learning Resources',
                    description: 'Access to courses and materials',
                    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
                  },
                  {
                    title: 'Member Tools',
                    description: 'Access to professional tools',
                    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
                  }
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {benefit.icon}
                    <div>
                      <p className="font-medium">{benefit.title}</p>
                      <p className="text-sm text-gray-500">{benefit.description}</p>
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