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
  const [role, setRole] = useState(""); // 👈 role state
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
    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }), // 👈 send role also
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ Save token, role, and branch
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || role);     // use backend role if available
        localStorage.setItem("branch", data.branch || "");
        localStorage.setItem("email", email);

        toast({
          title: "Login Successful",
          description: data.message,
          variant: "default",
        });

        onLogin({
          email,
          role: data.role || role,
          branch: data.branch || "",
          token: data.token,
        });
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Server error. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0000b] to-white p-7">
      <Card className="w-full max-w-md shadow-2xl border border-[#a8a8a8] bg-white text-red-700 rounded-xl transition-transform transform hover:scale-[1.02]">
        <CardHeader className="text-center flex flex-col items-center">
          <img
            src="favicon.ico"
            alt="Shorat Innovations Logo"
            className="w-10 h-16 sm:w-12 sm:h-20 object-contain mb-2 animate-pulse"
          />
          <CardTitle className="text-2xl sm:text-3xl font-bold text-red-500">
            Shorat Innovations
          </CardTitle>
          <CardDescription className="text-[#555555]">
            Franchise Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-black">Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white text-black border border-red-500 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <Label className="text-black">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white text-black border border-red-500 focus:ring-red-500 focus:border-red-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-red-400 hover:text-red-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Role selection dropdown */}
            <div>
              <Label className="text-black">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-white text-black border border-red-500 focus:ring-red-500 focus:border-red-500">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black border border-red-500">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="franchise_head">Franchise Head</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md hover:shadow-lg transition-all text-sm sm:text-base py-2 sm:py-3"
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
