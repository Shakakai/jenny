import { useEffect, useRef, useCallback } from "react";
import { useDocument } from "./use-document";
import { useToast } from "@/hooks/use-toast";

export function useAutosave(id: string | undefined, content: string, interval = 5000) {
  const { saveDocument } = useDocument(id);
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const contentRef = useRef(content);
  const lastSaveRef = useRef<string>(content);
  const isFirstRender = useRef(true);

  // Update content ref when content changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Cleanup function to handle saving on unmount
  const cleanup = useCallback(async () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }
    
    // Save any pending changes on cleanup
    if (id && contentRef.current !== lastSaveRef.current) {
      try {
        await saveDocument({ content: contentRef.current });
        console.log("Final auto-save completed");
      } catch (error) {
        console.error("Error in final auto-save:", error);
      }
    }
  }, [id, saveDocument]);

  // Main auto-save effect
  useEffect(() => {
    console.log("Setting up auto-save with interval:", interval);

    const save = async () => {
      if (!id || !contentRef.current || contentRef.current === lastSaveRef.current) {
        return;
      }

      try {
        console.log("Auto-saving content...");
        await saveDocument({ content: contentRef.current });
        lastSaveRef.current = contentRef.current;
        console.log("Auto-save completed successfully");
      } catch (error) {
        console.error("Error in auto-save:", error);
        toast({
          title: "Auto-save Error",
          description: "Failed to save your changes automatically. Please save manually.",
          variant: "destructive",
        });
      }
    };

    // Don't auto-save on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Clear any existing interval
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }

    // Set up new interval
    timeoutRef.current = setInterval(save, interval);

    // Cleanup on unmount or when dependencies change
    return cleanup;
  }, [id, interval, saveDocument, cleanup, toast]);

  return {
    forceSave: async () => {
      if (!id) {
        console.warn("Cannot force save: no document ID");
        return;
      }

      try {
        console.log("Force saving content...");
        await saveDocument({ content: contentRef.current });
        lastSaveRef.current = contentRef.current;
        console.log("Force save completed successfully");
        toast({
          title: "Success",
          description: "Document saved successfully",
        });
      } catch (error) {
        console.error("Error in force save:", error);
        toast({
          title: "Error",
          description: "Failed to save document",
          variant: "destructive",
        });
      }
    },
  };
}
