import { useEffect, useRef } from "react";
import { useDocument } from "./use-document";

export function useAutosave(id: string | undefined, content: string, interval = 5000) {
  const { saveDocument } = useDocument(id);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    const save = async () => {
      if (contentRef.current) {
        await saveDocument({ content: contentRef.current });
      }
    };

    timeoutRef.current = setInterval(save, interval);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [id, interval, saveDocument]);

  return {
    forceSave: async () => {
      await saveDocument({ content: contentRef.current });
    },
  };
}
