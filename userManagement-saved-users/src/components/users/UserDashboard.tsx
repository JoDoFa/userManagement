import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserForm } from "./UserForm";
import { DeleteDialog } from "./DeleteDialog";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

// ✅ Import API functions
import { fetchUsers, createUser, updateUser, deleteUser } from "@/api/user";

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  status: "active" | "inactive";
}

interface UserDashboardProps {
  currentUser: { email: string; username: string };
  onLogout: () => void;
}

export const UserDashboard = ({ currentUser, onLogout }: UserDashboardProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const { toast } = useToast();

  // ✅ Fetch from backend
  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleUsers = filteredUsers.filter((u) =>
    statusFilter === "all" ? true : u.status === statusFilter
  );

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };

  // ✅ Save (create or update) user
  const handleUserSubmit = async (userData: Omit<User, "id" | "createdAt">) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, userData);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        await createUser(userData);
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }
      loadUsers();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save user",
        variant: "destructive",
      });
    }
    setIsUserFormOpen(false);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleFilterClick = () => {
    setIsFilterOpen((s) => !s);
    toast({ title: "Filter", description: "Filter button clicked" });
  };

  // ✅ Delete user
  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        loadUsers();
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {currentUser.username}
            </p>
          </div>
          <Button onClick={onLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{users.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Users</CardDescription>
              <CardTitle className="text-3xl">
                {users.filter((u) => u.status === "active").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Inactive Users</CardDescription>
              <CardTitle className="text-3xl">
                {users.filter((u) => u.status === "inactive").length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Actions and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle>Users</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" aria-label="Filter users">
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                      <DropdownMenuRadioGroup value={statusFilter} onValueChange={(val) => {
                        const v = val as "all" | "active" | "inactive";
                        setStatusFilter(v);
                        toast({ title: "Filter", description: `Showing ${v} users` });
                      }}>
                        <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="inactive">Inactive</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                      <DropdownMenuSeparator />
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={handleAddUser}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {visibleUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                    ) : (
                      visibleUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Form Dialog */}
      <UserForm
        user={selectedUser}
        open={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        refreshUsers={loadUsers}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        user={userToDelete}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
