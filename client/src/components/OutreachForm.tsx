import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OutreachFormData } from "@shared/schema";

interface OutreachFormProps {
  onSubmit: (data: OutreachFormData) => void;
}

export default function OutreachForm({ onSubmit }: OutreachFormProps) {
  const [formData, setFormData] = useState<OutreachFormData>({
    targetName: "",
    company: "",
    landingPageCopy: "",
    keyInsight: "",
    additionalContext: ""
  });
  
  const [showAdditionalContext, setShowAdditionalContext] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.targetName.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Target Name is required", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!formData.company.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Company is required", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!formData.landingPageCopy.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Landing Page Copy is required", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!formData.keyInsight.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Key Insight or Pain Point is required", 
        variant: "destructive" 
      });
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <Card className="bg-card border-border mb-8">
      <CardContent className="pt-6">
        <h2 className="text-xl font-medium mb-6">Target Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="targetName">
              Target Name <span className="text-primary">*</span>
            </Label>
            <Input
              id="targetName"
              value={formData.targetName}
              onChange={handleChange}
              placeholder="Jane Smith"
              className="bg-muted border-border"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="company">
              Company <span className="text-primary">*</span>
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Acme Inc."
              className="bg-muted border-border"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="landingPageCopy">
              Landing Page Copy <span className="text-primary">*</span>
            </Label>
            <Textarea
              id="landingPageCopy"
              value={formData.landingPageCopy}
              onChange={handleChange}
              placeholder="Paste the text from their landing page here..."
              className="bg-muted border-border h-32 resize-y"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste raw text only, no URLs. We'll analyze this to craft personalized outreach.
            </p>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="keyInsight">
              Key Insight or Pain Point <span className="text-primary">*</span>
            </Label>
            <Input
              id="keyInsight"
              value={formData.keyInsight}
              onChange={handleChange}
              placeholder="What's their main challenge or opportunity?"
              className="bg-muted border-border"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Note: AI will ignore this if it doesn't align with the landing page copy.
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="additionalContext">Additional Context</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdditionalContext(!showAdditionalContext)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showAdditionalContext ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
            </div>
            
            {showAdditionalContext && (
              <Textarea
                id="additionalContext"
                value={formData.additionalContext}
                onChange={handleChange}
                placeholder="Any other details that might help craft better outreach..."
                className="bg-muted border-border h-24 resize-y"
              />
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full py-3 primary-button"
          >
            Generate Outreach
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Powered by DeepSeek. Fast & smart
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
