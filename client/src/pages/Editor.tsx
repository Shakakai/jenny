import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useUser } from "@/hooks/use-user";
import NavBar from "@/components/NavBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BlogEditor from "@/components/BlogEditor";
import AIAssistant from "@/components/AIAssistant";
import { useDocument } from "@/hooks/use-document";
import { useState } from "react";

const DOCUMENT_TAB = "document";
const AI_TAB = "ai";

export default function Editor() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const params = useParams();
  const documentId = params.id;
  const { document, saveDocument } = useDocument(documentId);

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
        <Tabs
          className="TabsRoot"
          defaultValue={document?.content !== null ? DOCUMENT_TAB : AI_TAB}
        >
          <TabsList className="TabsList" aria-label="Manage your account">
            <TabsTrigger className="TabsTrigger" value="ai">
              Settings
            </TabsTrigger>
            <TabsTrigger className="TabsTrigger" value="document">
              Document
            </TabsTrigger>
          </TabsList>
          <TabsContent className="TabsContent" value="ai">
            <AIAssistant documentId={documentId} />
          </TabsContent>
          <TabsContent className="TabsContent" value="document">
            <BlogEditor documentId={documentId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
