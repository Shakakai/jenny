import { useDocuments } from "@/hooks/use-document";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { useLocation } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function DocumentList() {
  const { documents, isLoading } = useDocuments();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-4 pr-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {doc.title || "Untitled Document"}
                  </CardTitle>
                  <CardDescription>
                    Last updated{" "}
                    {formatDistance(new Date(doc.updatedAt), new Date(), {
                      addSuffix: true,
                    })}
                  </CardDescription>
                </div>
                <Badge variant={doc.status === "draft" ? "secondary" : "default"}>
                  {doc.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation(`/editor/${doc.id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Preview functionality to be implemented
                  }}
                >
                  Preview
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                {doc.content?.length || 0} characters
              </div>
            </CardContent>
          </Card>
        ))}
        {documents.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">No documents yet</p>
              <Button onClick={() => setLocation("/editor")}>
                Create your first document
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}
