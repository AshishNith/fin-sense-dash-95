import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  description: string | null;
  date: string;
  category_id: string | null;
  categories: Category | null;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense" as "income" | "expense",
    description: "",
    date: new Date().toISOString().split("T")[0],
    category_id: "",
  });

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from("transactions")
      .select(`
        *,
        categories (id, name, color)
      `)
      .order("date", { ascending: false });

    if (data) setTransactions(data as Transaction[]);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      amount: parseFloat(formData.amount),
      type: formData.type,
      description: formData.description || null,
      date: formData.date,
      category_id: formData.category_id || null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        toast.error("Failed to update transaction");
        return;
      }
      toast.success("Transaction updated");
    } else {
      const { error } = await supabase
        .from("transactions")
        .insert(payload);

      if (error) {
        toast.error("Failed to add transaction");
        return;
      }
      toast.success("Transaction added");
    }

    setIsDialogOpen(false);
    resetForm();
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete transaction");
      return;
    }
    toast.success("Transaction deleted");
    fetchTransactions();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setFormData({
      amount: transaction.amount.toString(),
      type: transaction.type,
      description: transaction.description || "",
      date: transaction.date,
      category_id: transaction.category_id || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      amount: "",
      type: "expense",
      description: "",
      date: new Date().toISOString().split("T")[0],
      category_id: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Transaction" : "Add Transaction"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "income" | "expense") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Optional description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Update" : "Add"} Transaction
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {transaction.type === "income" ? (
                      <ArrowUpCircle className="w-4 h-4 text-success" />
                    ) : (
                      <ArrowDownCircle className="w-4 h-4 text-destructive" />
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {transaction.categories && (
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${transaction.categories.color}20`,
                          color: transaction.categories.color,
                        }}
                      >
                        {transaction.categories.name}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{transaction.description || "-"}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === "income"
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
