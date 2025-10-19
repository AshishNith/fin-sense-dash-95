import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category_id: string;
  categories: { name: string; color: string } | null;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        categories (name, color)
      `)
      .order("date", { ascending: false });

    if (!error && data) {
      setTransactions(data as Transaction[]);
    }
    setLoading(false);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense" && t.categories)
    .reduce((acc, t) => {
      const name = t.categories!.name;
      const existing = acc.find((item) => item.name === name);
      if (existing) {
        existing.value += Number(t.amount);
      } else {
        acc.push({
          name,
          value: Number(t.amount),
          color: t.categories!.color,
        });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[]);

  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString("en-US", { month: "short" });
    const existing = acc.find((item) => item.month === month);
    const amount = Number(t.amount);
    
    if (existing) {
      if (t.type === "income") {
        existing.income += amount;
      } else {
        existing.expense += amount;
      }
    } else {
      acc.push({
        month,
        income: t.type === "income" ? amount : 0,
        expense: t.type === "expense" ? amount : 0,
      });
    }
    return acc;
  }, [] as { month: string; income: number; expense: number }[]);

  const stats = [
    {
      title: "Total Balance",
      value: `$${balance.toFixed(2)}`,
      icon: Wallet,
      color: balance >= 0 ? "text-success" : "text-destructive",
    },
    {
      title: "Total Income",
      value: `$${totalIncome.toFixed(2)}`,
      icon: ArrowUpCircle,
      color: "text-success",
    },
    {
      title: "Total Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      icon: ArrowDownCircle,
      color: "text-destructive",
    },
    {
      title: "Transactions",
      value: transactions.length,
      icon: TrendingUp,
      color: "text-primary",
    },
  ];

  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your financial overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="hsl(var(--chart-income))" name="Income" />
                <Bar dataKey="expense" fill="hsl(var(--chart-expense))" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="hsl(var(--chart-income))"
                  name="Income"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="hsl(var(--chart-expense))"
                  name="Expenses"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
