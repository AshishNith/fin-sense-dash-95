import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Wallet, TrendingUp, PieChart, Shield, Sparkles, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Wallet,
      title: "Track Every Transaction",
      description: "Easily add, edit, and manage all your income and expenses in one place.",
    },
    {
      icon: PieChart,
      title: "Visual Analytics",
      description: "Beautiful charts and graphs to understand your spending patterns.",
    },
    {
      icon: TrendingUp,
      title: "Income vs Expenses",
      description: "Monitor your financial health with real-time balance tracking.",
    },
    {
      icon: BarChart3,
      title: "Category Insights",
      description: "Organize transactions by custom categories and see where your money goes.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and protected with industry-standard security.",
    },
    {
      icon: Sparkles,
      title: "Smart Categorization",
      description: "Auto-categorize transactions and get intelligent spending insights.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold">FinanceTracker</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Take Control of Your Finances</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Track, Analyze, and
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent"> Optimize </span>
            Your Money
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern, intuitive personal finance tracker that helps you understand your spending, 
            save more, and achieve your financial goals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2 text-lg px-8">
              Start Tracking Free <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center border-primary/20">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-primary">100%</CardTitle>
              <CardDescription>Free Forever</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-chart-2/20">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-chart-2">Secure</CardTitle>
              <CardDescription>Bank-Level Encryption</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-primary/20">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-primary">Private</CardTitle>
              <CardDescription>Your Data, Your Control</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Everything You Need</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to give you complete control over your finances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-border/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-card to-chart-2/10 border-primary/20">
          <CardHeader className="text-center space-y-4 py-12">
            <CardTitle className="text-3xl md:text-4xl font-bold">
              Ready to Take Control?
            </CardTitle>
            <CardDescription className="text-lg">
              Join thousands of users who are already managing their finances smarter
            </CardDescription>
            <div className="pt-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2 text-lg px-8">
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span className="font-semibold">FinanceTracker</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 FinanceTracker. Track your finances with confidence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
