import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocument } from "@/hooks/use-document";

interface AIAssistantProps {
  documentId?: string;
  onContentGenerated?: (content: string) => void;
}

export default function AIAssistant({ documentId, onContentGenerated }: AIAssistantProps) {
  const { document, saveDocument } = useDocument(documentId);
  const [background, setBackground] = useState("");
  const [style, setStyle] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [instructions, setInstructions] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (document?.aiInputs) {
      const aiInputs = document.aiInputs as any;
      setBackground(aiInputs.background || "");
      setStyle(aiInputs.style || "");
      setKeyPoints(aiInputs.keyPoints || "");
      setInstructions(aiInputs.instructions || "");
    }
  }, [document]);

  const handleSaveInputs = async () => {
    if (!documentId) {
      toast({
        title: "Error",
        description: "Please save the document first",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveDocument({
        aiInputs: {
          background,
          style,
          keyPoints,
          instructions,
        },
      });
      toast({
        title: "Success",
        description: "AI inputs saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save AI inputs",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async () => {
    if (!documentId) {
      toast({
        title: "Error",
        description: "Please save the document first",
        variant: "destructive",
      });
      return;
    }

    // Save inputs before generating
    await handleSaveInputs();

    // TODO: Implement actual AI generation
    toast({
      title: "AI Generation",
      description: "This feature is coming soon!",
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI Writing Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-4 pr-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Material</label>
              <Textarea
                placeholder="Enter URL or paste text"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Writing Style</label>
              <Input
                placeholder="Describe your preferred style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Key Points</label>
              <Textarea
                placeholder="Enter key points to cover"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Instructions</label>
              <Textarea
                placeholder="Any specific requirements?"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1" onClick={handleSaveInputs}>
                Save Inputs
              </Button>
              <Button className="flex-1" onClick={handleGenerate}>
                Generate Content
              </Button>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
