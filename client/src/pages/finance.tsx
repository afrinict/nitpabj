import { useQuery } from "@tanstack/react-query";
import { FinancialRecord } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  CreditCard,
  Building,
  BookOpen
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Restricted to admin and financial officers
export default function Finance() {
  const { user } = useAuth();
  const isAuthorized = user && (user.role === "admin" || user.role === "financial_officer");

  // Fetch financial records
  const { data: financialRecords, isLoading, isError } = useQuery<FinancialRecord[]>({
    queryKey: ["/api/financial-records"],
    enabled: !!isAuthorized,
  });

  if (!isAuthorized) {
    return (
      <DashboardLayout>
        <PageHeader
          title="Finance"
          description="Financial management and reporting for NITP."
        />
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-full text-yellow-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-yellow-800">Access Restricted</h3>
                <p className="text-sm mt-1 text-yellow-700">
                  You don't have permission to access the financial management area.
                  This section is restricted to administrators and financial officers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  // Calculate summary data
  const calculateSummary = () => {
    if (!financialRecords) return {
      totalRevenue: 0,
      totalExpenses: 0,
      balance: 0,
      recentTransactions: []
    };

    let totalRevenue = 0;
    let totalExpenses = 0;

    financialRecords.forEach(record => {
      if (record.transactionType === 'income') {
        totalRevenue += Number(record.amount);
      } else if (record.transactionType === 'expense') {
        totalExpenses += Number(record.amount);
      }
    });

    return {
      totalRevenue,
      totalExpenses,
      balance: totalRevenue - totalExpenses,
      recentTransactions: financialRecords.slice(0, 5)
    };
  };

  const summary = calculateSummary();

  // Dummy data for charts
  const revenueData = [
    { month: 'Jan', amount: 250000 },
    { month: 'Feb', amount: 300000 },
    { month: 'Mar', amount: 280000 },
    { month: 'Apr', amount: 320000 },
    { month: 'May', amount: 310000 },
    { month: 'Jun', amount: 350000 },
    { month: 'Jul', amount: 380000 },
    { month: 'Aug', amount: 400000 },
    { month: 'Sep', amount: 420000 },
    { month: 'Oct', amount: 450000 },
    { month: 'Nov', amount: 480000 },
    { month: 'Dec', amount: 550000 },
  ];

  const expenseCategories = [
    { name: 'Operations', value: 45 },
    { name: 'Programs', value: 30 },
    { name: 'Administration', value: 15 },
    { name: 'Marketing', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <DashboardLayout>
      <PageHeader
        title="Financial Dashboard"
        description="Financial management and reporting for NITP."
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-[#1E5631]" />
        </div>
      ) : isError ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-800">
              There was an error loading financial data. Please try again later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="text-green-500 mr-2 h-5 w-5" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(summary.totalRevenue)}
                </p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>8.2% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="text-red-500 mr-2 h-5 w-5" />
                  Total Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">
                  {formatCurrency(summary.totalExpenses)}
                </p>
                <div className="flex items-center mt-2 text-sm text-red-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>3.1% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Building className="text-blue-500 mr-2 h-5 w-5" />
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(summary.balance)}
                </p>
                <div className="flex items-center mt-2 text-sm text-blue-600">
                  <Activity className="h-4 w-4 mr-1" />
                  <span>Updated today</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="w-full max-w-md grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-md">
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Monthly revenue over the past year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={revenueData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis 
                            tickFormatter={(value) => `₦${value/1000}k`}
                          />
                          <Tooltip 
                            formatter={(value) => [`₦${(value as number).toLocaleString()}`, 'Revenue']}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#3D8361"
                            activeDot={{ r: 8 }}
                            name="Revenue"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>Distribution by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseCategories}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {expenseCategories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {expenseCategories.map((category, index) => (
                        <div key={category.name} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-1" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-xs">{category.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest financial activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {summary.recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center border-b pb-3">
                          <div className="flex items-start">
                            <div className={`p-2 rounded-full ${transaction.transactionType === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                              {transaction.transactionType === 'income' ? (
                                <ArrowUpRight className={`h-4 w-4 ${transaction.transactionType === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                              ) : (
                                <ArrowDownLeft className={`h-4 w-4 ${transaction.transactionType === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-xs text-neutral-500">{transaction.category} • {formatDate(transaction.date)}</p>
                            </div>
                          </div>
                          <p className={`font-medium ${transaction.transactionType === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.transactionType === 'income' ? '+' : '-'} 
                            {formatCurrency(Number(transaction.amount))}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="outline">View All Transactions</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="transactions">
              <Card className="shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Transaction History</CardTitle>
                    <Button className="bg-[#1E5631] hover:bg-[#154525]">
                      Add Transaction
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {financialRecords?.map((record) => (
                          <tr key={record.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(record.date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.transactionType === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {record.transactionType === 'income' ? 'Income' : 'Expense'}
                              </span>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${record.transactionType === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(Number(record.amount))}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.referenceNumber || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="budgeting">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Budget Overview</CardTitle>
                    <CardDescription>Fiscal year 2023 budget allocation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'Q1', budget: 1200000, actual: 1150000 },
                            { name: 'Q2', budget: 1300000, actual: 1250000 },
                            { name: 'Q3', budget: 1100000, actual: 1050000 },
                            { name: 'Q4', budget: 1400000, actual: 800000 },
                          ]}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis 
                            tickFormatter={(value) => `₦${value/1000000}M`} 
                          />
                          <Tooltip 
                            formatter={(value) => [`₦${(value as number).toLocaleString()}`, '']}
                          />
                          <Legend />
                          <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                          <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Budget Categories</CardTitle>
                    <CardDescription>Current year budget distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Events & Conferences</span>
                          <span className="text-sm text-neutral-500">75% used</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Operations</span>
                          <span className="text-sm text-neutral-500">60% used</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Professional Development</span>
                          <span className="text-sm text-neutral-500">45% used</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                          <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Community Initiatives</span>
                          <span className="text-sm text-neutral-500">30% used</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Research & Publications</span>
                          <span className="text-sm text-neutral-500">20% used</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                          <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button variant="outline" className="w-full">Adjust Budget Allocations</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card className="shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Budget Planning Tools</CardTitle>
                      <Button className="bg-[#1E5631] hover:bg-[#154525]">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Create New Budget
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Annual Budget</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Fiscal year planning and management</p>
                        <Button variant="link" className="text-[#3D8361] p-0 h-auto mt-2">
                          View Annual Budget →
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Project Budgets</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Individual project financial tracking</p>
                        <Button variant="link" className="text-[#3D8361] p-0 h-auto mt-2">
                          Manage Projects →
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Budget Reports</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Generate financial reports and analysis</p>
                        <Button variant="link" className="text-[#3D8361] p-0 h-auto mt-2">
                          Run Reports →
                        </Button>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </DashboardLayout>
  );
}
