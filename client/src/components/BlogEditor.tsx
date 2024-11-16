import { useState } from "react";
import { useDocument } from "@/hooks/use-document";
import { useAutosave } from "@/hooks/use-autosave";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function BlogEditor({ id }: { id?: string }) {
  const { document, saveDocument } = useDocument(id);
  const [title, setTitle] = useState(document?.title || "");
  const [content, setContent] = useState(document?.content || "");
  const { toast } = useToast();

  const { forceSave } = useAutosave(id, content);

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
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold"
          />
          <Textarea
            placeholder="Start writing your blog post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] resize-none"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={forceSave}>
            Save Draft
          </Button>
          <Button onClick={handleSave}>Publish</Button>
        </div>
      </CardContent>
    </Card>
  );
}
