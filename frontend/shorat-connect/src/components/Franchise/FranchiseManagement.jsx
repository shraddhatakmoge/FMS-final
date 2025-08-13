import { useState } from "react";
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
  MoreHorizontal,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export const FranchiseManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);

  const [franchises, setFranchises] = useState([
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
      established: "2023-01-15",
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
      established: "2023-03-20",
    },
  ]);

  const [newFranchise, setNewFranchise] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    status: "active",
    students: "",
    staff: "",
    revenue: "",
    performance: "",
    established: "",
  });

  const handleAddFranchise = () => {
    setFranchises((prev) => [
      ...prev,
      {
        ...newFranchise,
        id: prev.length + 1,
        students: parseInt(newFranchise.students),
        staff: parseInt(newFranchise.staff),
        performance: parseInt(newFranchise.performance),
      },
    ]);
    setNewFranchise({
      name: "",
      location: "",
      email: "",
      phone: "",
      status: "active",
      students: "",
      staff: "",
      revenue: "",
      performance: "",
      established: "",
    });
    setShowDialog(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending Approval</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredFranchises = franchises.filter((franchise) => {
    const matchesSearch =
      franchise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franchise.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || franchise.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Franchise Management</h1>
          <p className="text-muted-foreground">
            Manage your franchise network
          </p>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary bg-[#f0000b] hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Franchise
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Franchise</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newFranchise.name}
                  onChange={(e) =>
                    setNewFranchise({ ...newFranchise, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={newFranchise.location}
                  onChange={(e) =>
                    setNewFranchise({
                      ...newFranchise,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={newFranchise.email}
                  onChange={(e) =>
                    setNewFranchise({ ...newFranchise, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={newFranchise.phone}
                  onChange={(e) =>
                    setNewFranchise({ ...newFranchise, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={newFranchise.status}
                  onValueChange={(value) =>
                    setNewFranchise({ ...newFranchise, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Students</Label>
                <Input
                  type="number"
                  value={newFranchise.students}
                  onChange={(e) =>
                    setNewFranchise({
                      ...newFranchise,
                      students: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Staff</Label>
                <Input
                  type="number"
                  value={newFranchise.staff}
                  onChange={(e) =>
                    setNewFranchise({ ...newFranchise, staff: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Revenue</Label>
                <Input
                  value={newFranchise.revenue}
                  onChange={(e) =>
                    setNewFranchise({
                      ...newFranchise,
                      revenue: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Performance %</Label>
                <Input
                  type="number"
                  value={newFranchise.performance}
                  onChange={(e) =>
                    setNewFranchise({
                      ...newFranchise,
                      performance: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Established</Label>
                <Input
                  type="date"
                  value={newFranchise.established}
                  onChange={(e) =>
                    setNewFranchise({
                      ...newFranchise,
                      established: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddFranchise}>Save</Button>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center h-28 ">
              <div>
                <p className="text-2xl font-medium text-muted-foreground text-[#344256]">
                  Total Franchises
                </p>
                <p className="text-3xl font-bold mt-3">{franchises.length}</p>
              </div>
              <Building2 className="h-7 w-8 text-primary " />
            </div>
          </CardContent>  
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center h-28 ">
              <div>
                <p className="text-2xl font-medium text-muted-foreground text-[#344256]">
                  Active Franchises
                </p>
                <p className="text-3xl font-bold mt-3">
                  {
                    franchises.filter((f) => f.status === "active").length
                  }
                </p>
              </div>
              <TrendingUp className="h-7 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
      </div>

      {/* Franchise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFranchises.map((franchise) => (
          <Card key={franchise.id}>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle >{franchise.name}</CardTitle>
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
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                {franchise.email}
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                {franchise.phone}
              </div>
              <div className="grid grid-cols-3 text-center pt-4 border-t">
                <div>
                  <GraduationCap className="mx-auto text-green-500" />
                  <div className="font-semibold">{franchise.students}</div>
                  <div className="text-xs">Students</div>
                </div>
                <div>
                  <Users className="mx-auto text-blue-500" />
                  <div className="font-semibold">{franchise.staff}</div>
                  <div className="text-xs">Staff</div>
                </div>
                <div>
                  <TrendingUp className="mx-auto text-yellow-500" />
                  <div className="font-semibold">{franchise.performance}%</div>
                  <div className="text-xs">Performance</div>
                </div>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span>Revenue</span>
                <span className="font-semibold text-primary">
                  {franchise.revenue}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
