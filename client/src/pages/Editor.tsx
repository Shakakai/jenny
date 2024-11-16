import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useUser } from "@/hooks/use-user";
import NavBar from "@/components/NavBar";
import BlogEditor from "@/components/BlogEditor";
import AIAssistant from "@/components/AIAssistant";

export default function Editor() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const params = useParams();

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          <div className="lg:col-span-2 h-full">
            <BlogEditor id={params.id} />
          </div>
          <div className="h-full">
            <AIAssistant documentId={params.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
