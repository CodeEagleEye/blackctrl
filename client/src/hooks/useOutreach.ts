import { useState } from "react";
import { 
  OutreachFormData, 
  OutreachResult, 
  SavedMessage 
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useOutreach() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OutreachResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for saved messages
  const { data: savedMessages = [] } = useQuery({
    queryKey: ['/api/messages'],
    refetchOnWindowFocus: false,
  });

  // Generate outreach mutation
  const generateMutation = useMutation({
    mutationFn: async (formData: OutreachFormData) => {
      const response = await apiRequest("POST", "/api/generate", formData);
      return response.json();
    },
    onSuccess: (data: OutreachResult) => {
      setResult(data);
      setIsLoading(false);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate outreach message",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  });

  // Save message mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!result) return null;
      const response = await apiRequest("POST", "/api/messages", result);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Saved",
        description: "Your message has been saved for training."
      });
      // Refresh messages list
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save message",
        variant: "destructive"
      });
    }
  });

  // Generate outreach
  const generateOutreach = async (formData: OutreachFormData) => {
    setIsLoading(true);
    generateMutation.mutate(formData);
  };

  // Save and train
  const saveAndTrain = () => {
    if (!result) {
      toast({
        title: "No Message to Save",
        description: "Generate a message first before saving",
        variant: "destructive"
      });
      return;
    }
    
    saveMutation.mutate();
  };

  // Copy outreach to clipboard
  const copyOutreach = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result.outreachMessage)
      .then(() => {
        toast({
          title: "Copied",
          description: "Message copied to clipboard"
        });
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy message to clipboard",
          variant: "destructive"
        });
      });
  };

  // Edit outreach (currently just shows a notification)
  const editOutreach = () => {
    toast({
      title: "Edit Feature",
      description: "Message editing will be available in a future update."
    });
  };

  // Export as PDF
  const exportPdf = async () => {
    if (!result) return;
    
    try {
      const response = await apiRequest("POST", "/api/export/pdf", result);
      // Get the PDF as a blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `black-ctrl-outreach-${result.company.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF Exported",
        description: "Your outreach has been exported as PDF"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export as PDF",
        variant: "destructive"
      });
    }
  };

  // Export as JSON
  const exportJson = () => {
    if (!result) return;
    
    try {
      const dataStr = JSON.stringify(result, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `black-ctrl-outreach-${result.company.toLowerCase().replace(/\s+/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "JSON Exported",
        description: "Your outreach has been exported as JSON"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export as JSON",
        variant: "destructive"
      });
    }
  };

  return {
    isLoading,
    result,
    savedMessages: savedMessages as SavedMessage[],
    generateOutreach,
    saveAndTrain,
    copyOutreach,
    editOutreach,
    exportPdf,
    exportJson
  };
}
