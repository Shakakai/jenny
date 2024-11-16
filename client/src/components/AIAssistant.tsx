import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AIAssistant() {
  const [background, setBackground] = useState("");
  const [style, setStyle] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [instructions, setInstructions] = useState("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    toast({
      title: "AI Generation",
      description: "This feature is coming soon!",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Writing Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Background Material</label>
          <Input
            placeholder="Enter URL or paste text"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
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
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Additional Instructions</label>
          <Textarea
            placeholder="Any specific requirements?"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
        <Button className="w-full" onClick={handleGenerate}>
          Generate Content
        </Button>
      </CardContent>
    </Card>
  );
}
