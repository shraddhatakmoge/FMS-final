import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  GraduationCap, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FranchiseManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const franchises = [
    {
      id: 1,
      name: "Mumbai Central",
      location: "Mumbai, Maharashtra",
      email: "mumbai@shorat.com",
      phone: "+91 98765 43210",
      status: "active",
      students: 245,
      staff: 12,
      revenue: "₹4,50,000",
      performance: 95,
      established: "2023-01-15"
    },
    {
      id: 2,
      name: "Delhi North",
      location: "Delhi, NCR",
      email: "delhi@shorat.com",
      phone: "+91 98765 43211",
      status: "active",
      students: 198,
      staff: 10,
      revenue: "₹3,80,000",
      performance: 91,
      established: "2023-03-20"
    },
    {
      id: 3,
      name: "Bangalore Tech Park",
      location: "Bangalore, Karnataka",
      email: "bangalore@shorat.com",
      phone: "+91 98765 43212",
      status: "pending",
      students: 0,
      staff: 0,
      revenue: "₹0",
      performance: 0,
      established: "2024-01-10"
    },
    {
      id: 4,
      name: "Pune Deccan",
      location: "Pune, Maharashtra",
      email: "pune@shorat.com",
      phone: "+91 98765 43213",
      status: "active",
      students: 165,
      staff: 8,
      revenue: "₹3,20,000",
      performance: 87,
      established: "2023-06-12"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending Approval</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredFranchises = franchises.filter(franchise => {
    const matchesSearch = franchise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         franchise.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || franchise.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Franchise Management</h1>
          <p className="text-muted-foreground">Manage your franchise network</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Add New Franchise
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Franchises</p>
                <p className="text-2xl font-bold">25</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Franchises</p>
                <p className="text-2xl font-bold">22</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Badge className="h-8 w-8 rounded-full flex items-center justify-center bg-warning text-warning-foreground">!</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold">91%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search franchises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Franchise List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFranchises.map((franchise) => (
          <Card key={franchise.id} className="hover:shadow-medium transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{franchise.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {franchise.location}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(franchise.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Franchise
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    {franchise.email}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    {franchise.phone}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <GraduationCap className="h-4 w-4 text-success" />
                    </div>
                    <div className="text-lg font-semibold">{franchise.students}</div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-info" />
                    </div>
                    <div className="text-lg font-semibold">{franchise.staff}</div>
                    <div className="text-xs text-muted-foreground">Staff</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-warning" />
                    </div>
                    <div className="text-lg font-semibold">{franchise.performance}%</div>
                    <div className="text-xs text-muted-foreground">Performance</div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Monthly Revenue</span>
                    <span className="font-semibold text-primary">{franchise.revenue}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
