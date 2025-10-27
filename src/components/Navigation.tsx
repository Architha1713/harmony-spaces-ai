import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ImageIcon, Sparkles } from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">ZenSpace AI</h1>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={location.pathname === "/" ? "default" : "ghost"}
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
          <Button
            variant={location.pathname === "/design" ? "default" : "ghost"}
            onClick={() => navigate("/design")}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Design
          </Button>
          <Button
            variant={location.pathname === "/gallery" ? "default" : "ghost"}
            onClick={() => navigate("/gallery")}
            className="gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            Gallery
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
