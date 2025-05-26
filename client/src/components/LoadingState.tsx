import { Card, CardContent } from "@/components/ui/card";

export default function LoadingState() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Analyzing content and generating personalized outreach...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
