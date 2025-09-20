import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { UserDashboard } from "@/components/users/UserDashboard";
import { useToast } from "@/hooks/use-toast";

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string; email: string } | null;
}

const Index = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    // Mock authentication - in a real app, this would call an API
    if (email && password) {
      const user = {
        username: email.split('@')[0],
        email: email
      };
      
      setAuthState({
        isAuthenticated: true,
        user
      });
      
      toast({
        title: "Success",
        description: "Welcome back! You have been logged in successfully.",
      });
    }
  };

  const handleRegister = async (userData: { username: string; email: string; password: string }) => {
    // Mock registration - in a real app, this would call an API
    const user = {
      username: userData.username,
      email: userData.email
    };
    
    setAuthState({
      isAuthenticated: true,
      user
    });
    
    toast({
      title: "Success",
      description: "Account created successfully! Welcome aboard.",
    });
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null
    });
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (authState.isAuthenticated && authState.user) {
    return (
      <UserDashboard 
        currentUser={authState.user} 
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      {isLoginMode ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={() => setIsLoginMode(false)}
        />
      ) : (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => setIsLoginMode(true)}
        />
      )}
    </div>
  );
};

export default Index;
