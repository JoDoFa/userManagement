import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { User } from "./UserDashboard";
import { createUser, updateUser } from "@/api/user";

interface UserFormProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  refreshUsers: () => void; // ✅ trigger refresh after save
}

export const UserForm = ({ user, open, onClose, refreshUsers }: UserFormProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setStatus(user.status);
    } else {
      setUsername("");
      setEmail("");
      setStatus("active");
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = { username, email, status };

      if (user) {
        await updateUser(user.id, payload);
        toast({ title: "Success", description: "User updated successfully" });
      } else {
        await createUser(payload);
        toast({ title: "Success", description: "User created successfully" });
      }
      refreshUsers(); // ✅ reload list
      onClose();
      setErrorMsg(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMsg(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Update the user information below."
              : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: "active" | "inactive") =>
                setStatus(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {errorMsg && (
            <div className="text-sm text-destructive">{errorMsg}</div>
          )}

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : user
                ? "Update User"
                : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
