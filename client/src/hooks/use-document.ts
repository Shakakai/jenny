import useSWR from "swr";
import type { Document } from "db/schema";

export function useDocument(id?: string) {
  const { data, error, mutate } = useSWR<Document>(
    id ? `/api/documents/${id}` : null
  );

  const saveDocument = async (document: Partial<Document>) => {
    if (!id) {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(document),
      });
      const newDoc = await response.json();
      mutate(newDoc);
      return newDoc;
    } else {
      const response = await fetch(`/api/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(document),
      });
      const updatedDoc = await response.json();
      mutate(updatedDoc);
      return updatedDoc;
    }
  };

  return {
    document: data,
    isLoading: !error && !data,
    error,
    saveDocument,
  };
}

export function useDocuments() {
  const { data, error, mutate } = useSWR<Document[]>("/api/documents");

  return {
    documents: data || [],
    isLoading: !error && !data,
    error,
    mutate,
  };
}
