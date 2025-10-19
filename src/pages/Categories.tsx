import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string | null;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#6366f1",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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
      name: formData.name,
      color: formData.color,
    };

    if (editingId) {
      const { error } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        toast.error("Failed to update category");
        return;
      }
      toast.success("Category updated");
    } else {
      const { error } = await supabase
        .from("categories")
        .insert(payload);

      if (error) {
        toast.error("Failed to add category");
        return;
      }
      toast.success("Category added");
    }

    setIsDialogOpen(false);
    resetForm();
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete category");
      return;
    }
    toast.success("Category deleted");
    fetchCategories();
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      color: category.color,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      color: "#6366f1",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Organize your transactions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="Category name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="#6366f1"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Update" : "Add"} Category
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {category.name}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(category)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {category.color}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Categories;
