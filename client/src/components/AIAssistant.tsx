import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocument } from "@/hooks/use-document";

interface AIInputs {
  background: string;
  style: string;
  keyPoints: string;
  instructions: string;
}

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
      try {
        const aiInputs = document.aiInputs as AIInputs;
        console.log("Loading AI inputs:", aiInputs);
        setBackground(aiInputs.background || "");
        setStyle(aiInputs.style || "");
        setKeyPoints(aiInputs.keyPoints || "");
        setInstructions(aiInputs.instructions || "");
      } catch (error) {
        console.error("Error loading AI inputs:", error);
        toast({
          title: "Error",
          description: "Failed to load AI inputs",
          variant: "destructive",
        });
      }
    }
  }, [document, toast]);

  const handleSaveInputs = async () => {
    console.log("Attempting to save AI inputs...");
    
    if (!documentId) {
      console.warn("No document ID provided for saving AI inputs");
      toast({
        title: "Error",
        description: "Please save the document first",
        variant: "destructive",
      });
      return;
    }

    const aiInputs: AIInputs = {
      background,
      style,
      keyPoints,
      instructions,
    };

    console.log("Saving AI inputs:", aiInputs);

    try {
      await saveDocument({
        aiInputs,
      });
      console.log("AI inputs saved successfully");
      toast({
        title: "Success",
        description: "AI inputs saved successfully",
      });
    } catch (error) {
      console.error("Error saving AI inputs:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save AI inputs",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async () => {
    console.log("Starting content generation process...");
    
    if (!documentId) {
      console.warn("No document ID provided for content generation");
      toast({
        title: "Error",
        description: "Please save the document first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save inputs before generating
      await handleSaveInputs();

      // TODO: Implement actual AI generation
      console.log("AI generation placeholder - feature coming soon");
      toast({
        title: "AI Generation",
        description: "This feature is coming soon!",
      });
    } catch (error) {
      console.error("Error in content generation:", error);
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive",
      });
    }
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
