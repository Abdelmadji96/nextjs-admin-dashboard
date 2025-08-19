"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "viewer";
  status: "active" | "inactive" | "suspended";
  createdDate: string;
  lastLogin: string;
  permissions: string[];
}

const getRoleVariant = (role: string) => {
  const variants = {
    admin: "destructive",
    moderator: "default",
    viewer: "secondary",
  };
  return variants[role as keyof typeof variants] || "default";
};

const getStatusVariant = (status: string) => {
  const variants = {
    active: "default",
    inactive: "secondary", 
    suspended: "destructive",
  };
  return variants[status as keyof typeof variants] || "secondary";
};

// Mock data - replace with real API calls
const mockUsers: User[] = [
  {
    id: "USR001",
    name: "John Admin",
    email: "john.admin@company.com",
    role: "admin",
    status: "active",
    createdDate: "2024-01-10",
    lastLogin: "2024-01-15",
    permissions: ["verify_identity", "verify_diploma", "verify_user", "manage_users", "view_statistics"],
  },
  {
    id: "USR002",
    name: "Jane Moderator",
    email: "jane.mod@company.com",
    role: "moderator",
    status: "active",
    createdDate: "2024-01-12",
    lastLogin: "2024-01-14",
    permissions: ["verify_identity", "verify_diploma", "verify_user", "view_statistics"],
  },
  {
    id: "USR003",
    name: "Bob Viewer",
    email: "bob.viewer@company.com",
    role: "viewer",
    status: "active",
    createdDate: "2024-01-13",
    lastLogin: "2024-01-15",
    permissions: ["view_statistics"],
  },
  {
    id: "USR004",
    name: "Alice Smith",
    email: "alice.smith@company.com",
    role: "moderator",
    status: "inactive",
    createdDate: "2024-01-08",
    lastLogin: "2024-01-12",
    permissions: ["verify_identity", "verify_diploma"],
  },
];

const allPermissions = [
  { id: "verify_identity", label: "Verify Identity" },
  { id: "verify_diploma", label: "Verify Diploma" },
  { id: "verify_user", label: "Verify User" },
  { id: "manage_users", label: "Manage Users" },
  { id: "view_statistics", label: "View Statistics" },
  { id: "support_tickets", label: "Handle Support" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" as const }
        : user
    ));
  };

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="User Management" />
      
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">User Management</h1>
            <p className="text-muted-foreground">
              Manage users, roles, and permissions for the verification dashboard.
            </p>
          </div>
          
          <Button
            variant="default"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary-button"
          >
            Create User
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Permissions</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getRoleVariant(user.role) as any}>
                        {user.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusVariant(user.status) as any}>
                        {user.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.slice(0, 2).map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                          >
                            {permission.replace("_", " ")}
                          </span>
                        ))}
                        {user.permissions.length > 2 && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                            +{user.permissions.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleEditUser(user)}
                          className="bg-primary hover:bg-primary-button text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant={user.status === "active" ? "secondary" : "default"}
                          onClick={() => toggleUserStatus(user.id)}
                          className={user.status === "active" ? "bg-warning hover:bg-warning/80" : "bg-success hover:bg-success/80"}
                        >
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg border border-border w-full max-w-md">
            <h2 className="text-xl font-semibold text-foreground mb-4">Create New User</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter user name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="viewer">Viewer</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Permissions</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {allPermissions.map((permission) => (
                    <label key={permission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
            
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-primary hover:bg-primary-button"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Create User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}