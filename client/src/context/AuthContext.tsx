import { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  ReactNode 
} from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  verifyToken: (token: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const login = useCallback(async (email: string) => {
    try {
      await apiRequest("POST", "/api/auth/login", { email });
      // Don't set authenticated here, just let the user know the magic link was sent
    } catch (error: any) {
      throw new Error(error.message || "Failed to send magic link");
    }
  }, []);

  const verifyToken = useCallback(async (token: string) => {
    try {
      await apiRequest("POST", "/api/auth/verify", { token });
      setIsAuthenticated(true);
      
      // Set a session cookie or storage flag for persistence
      sessionStorage.setItem("authenticated", "true");
      
      // Redirect to main page
      window.location.href = "/";
    } catch (error: any) {
      throw new Error(error.message || "Invalid or expired token");
    }
  }, []);

  const logout = useCallback(() => {
    apiRequest("POST", "/api/auth/logout")
      .then(() => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("authenticated");
      })
      .catch((error) => {
        toast({
          title: "Logout Failed",
          description: "There was an error logging out.",
          variant: "destructive"
        });
        console.error("Logout error:", error);
      });
  }, [toast]);

  const checkAuth = useCallback(async () => {
    // First check session storage
    if (sessionStorage.getItem("authenticated") === "true") {
      setIsAuthenticated(true);
      return;
    }
    
    // Then verify with the server
    try {
      const response = await fetch("/api/auth/status", {
        credentials: "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          sessionStorage.setItem("authenticated", "true");
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      verifyToken, 
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
