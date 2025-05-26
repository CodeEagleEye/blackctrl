import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MailIcon, KeyIcon, ArrowRightIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showManualTokenInput, setShowManualTokenInput] = useState(false);
  const { login, verifyToken } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();

  useEffect(() => {
    // Check if we're on the verification page
    if (location.startsWith('/auth/verify')) {
      setIsVerifying(true);
      const token = new URLSearchParams(location.split('?')[1]).get('token');
      
      if (token) {
        verifyToken(token)
          .catch((error) => {
            toast({
              title: "Verification Failed",
              description: error.message || "Invalid or expired login link.",
              variant: "destructive"
            });
            setIsVerifying(false);
          });
      } else {
        toast({
          title: "Verification Failed",
          description: "No verification token provided.",
          variant: "destructive"
        });
        setIsVerifying(false);
      }
    }
  }, [location, verifyToken, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await login(email);
      setMagicLinkSent(true);
      toast({
        title: "Magic Link Sent",
        description: "Check your email for the login link or enter token manually."
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Your email is not on the whitelist.",
        variant: "destructive"
      });
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter the verification token.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await verifyToken(token);
      toast({
        title: "Verification Successful",
        description: "You are now logged in."
      });
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired token.",
        variant: "destructive"
      });
    }
  };

  if (isVerifying) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2">BLACK CTRL</h1>
          <p className="text-xl text-muted-foreground mb-1">Send less.</p>
          <p className="text-xl text-muted-foreground mb-4">Close more.</p>
        </div>
        
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Verifying your login...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">BLACK CTRL</h1>
        <p className="text-xl text-muted-foreground mb-1">Send less.</p>
        <p className="text-xl text-muted-foreground mb-4">Close more.</p>
      </div>
      
      {!magicLinkSent ? (
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-4">Get Access</h2>
            <p className="text-muted-foreground mb-6">Founder-only access. Whitelist required.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Get Access
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <MailIcon className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-medium mb-2">Check your inbox</h2>
              <p className="text-muted-foreground mb-6">We've sent a magic link to your email. Click the link to sign in.</p>
              
              {!showManualTokenInput ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">Didn't receive an email? Check your spam folder or try again.</p>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      variant="link" 
                      onClick={() => setMagicLinkSent(false)}
                    >
                      Try again
                    </Button>
                    <Button 
                      variant="link" 
                      onClick={() => setShowManualTokenInput(true)}
                      className="flex items-center"
                    >
                      Enter token manually <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <form onSubmit={handleTokenSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="token">Verification Token</Label>
                      <Input
                        id="token"
                        placeholder="Paste token here"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="bg-muted border-border"
                      />
                      <p className="text-xs text-muted-foreground">Copy the token from your server logs</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      >
                        <KeyIcon className="h-4 w-4 mr-1" /> Verify
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowManualTokenInput(false)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
