import { useState } from "react";
import OutreachForm from "@/components/OutreachForm";
import ResultsView from "@/components/ResultsView";
import LoadingState from "@/components/LoadingState";
import MessageHistory from "@/components/MessageHistory";
import { useOutreach } from "@/hooks/useOutreach";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const { logout } = useAuth();
  const { toast } = useToast();
  const {
    isLoading,
    result,
    generateOutreach,
    saveAndTrain,
    exportPdf,
    exportJson,
    copyOutreach,
    editOutreach,
    savedMessages
  } = useOutreach();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="mb-8 text-center relative">
        <button
          onClick={handleLogout}
          className="absolute right-0 top-0 text-muted-foreground hover:text-foreground text-sm"
        >
          Logout
        </button>
        <h1 className="text-3xl font-semibold mb-2">BLACK CTRL</h1>
        <p className="text-xl text-muted-foreground mb-1">Send less.</p>
        <p className="text-xl text-muted-foreground mb-4">Close more.</p>
      </header>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 font-medium border-b-2 ${
            activeTab === 'generate'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground'
          }`}
        >
          Generate Outreach
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium border-b-2 ${
            activeTab === 'history'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground'
          }`}
        >
          Message History
        </button>
      </div>

      {/* Generate Tab Content */}
      {activeTab === 'generate' && (
        <div>
          {!isLoading && !result && <OutreachForm onSubmit={generateOutreach} />}
          {isLoading && <LoadingState />}
          {!isLoading && result && (
            <ResultsView
              result={result}
              onSaveAndTrain={saveAndTrain}
              onExportPdf={exportPdf}
              onExportJson={exportJson}
              onCopy={copyOutreach}
              onEdit={editOutreach}
            />
          )}
        </div>
      )}

      {/* History Tab Content */}
      {activeTab === 'history' && (
        <MessageHistory messages={savedMessages} />
      )}
    </div>
  );
}
