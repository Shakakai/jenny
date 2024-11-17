import { useState } from "react";
import { useDocument } from "@/hooks/use-document";
import { useAutosave } from "@/hooks/use-autosave";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BlogEditorProps {
  documentId?: string;
}

export default function BlogEditor({ documentId }: BlogEditorProps) {
  const { document, saveDocument } = useDocument(documentId);
  const [title, setTitle] = useState(document?.title || "");
  const [content, setContent] = useState(document?.content || "");
  const { toast } = useToast();

  const { forceSave } = useAutosave(documentId, content);

  const handleSave = async () => {
    try {
      await saveDocument({ title, content });
      toast({
        title: "Success",
        description: "Document saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save document",
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Document Content</CardTitle>
      </CardHeader>
      <CardContent className="p-6 h-full">
        <div className="space-y-4 h-full flex flex-col">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold"
          />
          <ScrollArea className="flex-1">
            <Textarea
              placeholder="Start writing your blog post..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[calc(100vh-16rem)] resize-none"
            />
          </ScrollArea>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={forceSave}>
              Save Draft
            </Button>
            <Button onClick={handleSave}>Publish</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
