import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Edit, ChevronDown, ChevronUp, FileDown, Code } from "lucide-react";
import { OutreachResult } from "@shared/schema";

interface ResultsViewProps {
  result: OutreachResult;
  onSaveAndTrain: () => void;
  onExportPdf: () => void;
  onExportJson: () => void;
  onCopy: () => void;
  onEdit: () => void;
}

export default function ResultsView({
  result,
  onSaveAndTrain,
  onExportPdf,
  onExportJson,
  onCopy,
  onEdit
}: ResultsViewProps) {
  const [showSwot, setShowSwot] = useState(false);
  const [showInternalNotes, setShowInternalNotes] = useState(false);

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <h2 className="text-xl font-medium mb-6">Generated Outreach</h2>
        
        {/* Outreach Message */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Outreach Message</h3>
          <div className="bg-muted p-4 rounded-md mb-2">
            <p className="whitespace-pre-line">{result.outreachMessage}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopy}
              className="text-muted-foreground hover:text-foreground text-sm flex items-center"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-muted-foreground hover:text-foreground text-sm flex items-center"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
        
        {/* SWOT Analysis */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">SWOT Analysis</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSwot(!showSwot)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showSwot ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>
          
          {showSwot && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2 text-[hsl(var(--swot-strength))]">Strengths</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.swot.strengths.map((item, index) => (
                    <li key={`strength-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2 text-[hsl(var(--swot-weakness))]">Weaknesses</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.swot.weaknesses.map((item, index) => (
                    <li key={`weakness-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2 text-[hsl(var(--swot-opportunity))]">Opportunities</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.swot.opportunities.map((item, index) => (
                    <li key={`opportunity-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2 text-[hsl(var(--swot-threat))]">Threats</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.swot.threats.map((item, index) => (
                    <li key={`threat-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Internal Notes */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Internal Notes</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInternalNotes(!showInternalNotes)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showInternalNotes ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>
          
          {showInternalNotes && (
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Psychological & Positioning Angles</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {result.internalNotes.angles.map((item, index) => (
                  <li key={`angle-${index}`}>{item}</li>
                ))}
              </ul>
              
              <h4 className="font-medium mt-4 mb-2">Hidden Value Props</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {result.internalNotes.valueProps.map((item, index) => (
                  <li key={`value-prop-${index}`}>{item}</li>
                ))}
              </ul>
              
              <h4 className="font-medium mt-4 mb-2">GOAT-Tier Notes</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {result.internalNotes.goatTier.map((item, index) => (
                  <li key={`goat-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onSaveAndTrain}
            className="primary-button py-2 flex-1"
          >
            Save & Train
          </Button>
          
          <div className="flex gap-2 flex-1">
            <Button
              onClick={onExportPdf}
              variant="outline"
              className="bg-muted hover:bg-muted/80 text-foreground py-2 flex-1 flex items-center justify-center"
            >
              <FileDown className="h-5 w-5 mr-1" />
              PDF
            </Button>
            
            <Button
              onClick={onExportJson}
              variant="outline"
              className="bg-muted hover:bg-muted/80 text-foreground py-2 flex-1 flex items-center justify-center"
            >
              <Code className="h-5 w-5 mr-1" />
              JSON
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
