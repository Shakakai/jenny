import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function NavBar() {
  const { user, logout } = useUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    const result = await logout();
    if (result.ok) {
      setLocation("/auth");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
  };

  return (
    <nav className="border-b px-4 py-3 bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Blog Generator</h1>
          {user && (
            <>
              <Button variant="ghost" onClick={() => setLocation("/")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => setLocation("/editor")}>
                New Post
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Welcome, {user.username}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => setLocation("/auth")}>Login</Button>
          )}
        </div>
      </div>
    </nav>
  );
}
