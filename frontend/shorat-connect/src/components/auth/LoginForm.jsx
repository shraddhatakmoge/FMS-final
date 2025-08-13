import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    onLogin({ email, password, role });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-red-900 p-4">
      <Card className="w-full max-w-md shadow-xl border border-red-600 bg-black/90 text-white rounded-xl transition-transform transform hover:scale-[1.02]">
        <CardHeader className="text-center flex flex-col items-center">
          <img
            src="favicon.ico"
            alt="Shorat Innovations Logo"
            className="w-12 h-20 object-contain mb-2 animate-pulse"
          />
          <CardTitle className="text-3xl font-bold text-red-500">
            Shorat Innovations
          </CardTitle>
          <CardDescription className="text-gray-300">
            Franchise Management System
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-red-400">Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black text-white border border-red-500 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <Label className="text-red-400">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black text-white border border-red-500 focus:ring-red-500 focus:border-red-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-red-400 hover:text-red-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-red-400">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-black text-white border border-red-500 focus:ring-red-500 focus:border-red-500">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border border-red-500">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="franchise_head">Franchise Head</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
