import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useUser } from "@/hooks/use-user";
import NavBar from "@/components/NavBar";
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
  const [tab, setTab] = useState(
    document === null || document.content === null ? DOCUMENT_TAB : AI_TAB,
  );

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          <ul class="flex flex-wrap -mb-px">
            <li class="me-2">
              <a
                href="#"
                onClick={setTab(AI_TAB)}
                class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              >
                Settings
              </a>
            </li>
            <li class="me-2">
              <a
                href="#"
                onClick={setTab(DOCUMENT_TAB)}
                class="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                aria-current="page"
              >
                Document
              </a>
            </li>
          </ul>
        </div>
        (tab === DOCUMENT_TAB && (
        <BlogEditor document={document} saveDocument={saveDocument} />) ) (tab
        === AI_TAB && (
        <AIAssistant document={document} saveDocument={saveDocument} />) )
      </main>
    </div>
  );
}
