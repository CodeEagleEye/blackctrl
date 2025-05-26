import { Card, CardContent } from "@/components/ui/card";
import { SavedMessage } from "@shared/schema";
import { InboxIcon } from "lucide-react";

interface MessageHistoryProps {
  messages: SavedMessage[];
}

export default function MessageHistory({ messages }: MessageHistoryProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <h2 className="text-xl font-medium mb-6">Message History</h2>
        
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <InboxIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="mb-2">No saved messages yet</p>
            <p className="text-sm">Messages you save will appear here for future reference</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className="bg-muted border-border overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{message.targetName}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{message.company}</p>
                  <div className="bg-background p-3 rounded-md">
                    <p className="text-sm whitespace-pre-line line-clamp-3">
                      {message.outreachMessage}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
