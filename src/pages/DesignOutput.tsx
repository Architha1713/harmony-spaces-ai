import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Sparkles, Home, Lightbulb, Palette, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

interface DesignData {
  id: string;
  roomType: string;
  aesthetic: string;
  colorScheme: string;
  budget: string;
  mood: string;
  notes: string;
  image: string;
  suggestions: {
    furniture: string[];
    lighting: string[];
    decor: string[];
    colors: string[];
  };
  timestamp: string;
}

const DesignOutput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [design, setDesign] = useState<DesignData | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (location.state) {
      const designData = location.state as DesignData;
      setDesign(designData);
      
      // Check if this design is already saved
      const savedDesigns = JSON.parse(localStorage.getItem("zenspace-designs") || "[]");
      const isAlreadySaved = savedDesigns.some((d: DesignData) => d.id === designData.id);
      setIsSaved(isAlreadySaved);
    } else {
      navigate("/design");
    }
  }, [location, navigate]);

  const handleDownload = () => {
    if (!design?.image) return;

    const link = document.createElement("a");
    link.href = design.image;
    link.download = `zenspace-design-${design.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "Your design is being downloaded",
    });
  };

  const handleRegenerate = () => {
    navigate("/design");
  };

  const handleSave = () => {
    if (!design) return;

    const savedDesigns = JSON.parse(localStorage.getItem("zenspace-designs") || "[]");
    const alreadyExists = savedDesigns.some((d: DesignData) => d.id === design.id);

    if (alreadyExists) {
      toast({
        title: "Already Saved",
        description: "This design is already in your gallery",
      });
      return;
    }

    savedDesigns.push(design);
    localStorage.setItem("zenspace-designs", JSON.stringify(savedDesigns));
    setIsSaved(true);

    toast({
      title: "Design Saved",
      description: "Your design has been saved to the gallery",
    });
  };

  if (!design) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12">
      <Navigation />
      <div className="container mx-auto px-4 max-w-6xl pt-24">

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Preview */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-card border border-border/50 backdrop-blur-sm p-4 shadow-[0_0_30px_hsl(263_70%_65%/0.1)]">
              <img
                src={design.image}
                alt="Generated interior design"
                className="w-full h-auto rounded-xl"
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-primary hover:bg-primary/90 rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaved}
                variant="outline"
                className="flex-1 border-primary/30 hover:border-primary/50 hover:bg-primary/5 rounded-xl disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                onClick={handleRegenerate}
                variant="outline"
                className="flex-1 border-primary/30 hover:border-primary/50 hover:bg-primary/5 rounded-xl"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>

          {/* Suggestions Panel */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-card border border-border/50 backdrop-blur-sm p-6 shadow-[0_0_30px_hsl(263_70%_65%/0.1)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Design Details</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Room Type</p>
                  <p className="font-medium capitalize">{design.roomType.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Style</p>
                  <p className="font-medium capitalize">{design.aesthetic.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mood</p>
                  <p className="font-medium capitalize">{design.mood}</p>
                </div>
                {design.colorScheme && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Color Scheme</p>
                    <p className="font-medium">{design.colorScheme}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Furniture Suggestions */}
            <div className="rounded-2xl bg-card border border-border/50 backdrop-blur-sm p-6 shadow-[0_0_30px_hsl(263_70%_65%/0.1)]">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Furniture Suggestions</h3>
              </div>
              <ul className="space-y-2">
                {design.suggestions.furniture.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lighting Suggestions */}
            <div className="rounded-2xl bg-card border border-border/50 backdrop-blur-sm p-6 shadow-[0_0_30px_hsl(263_70%_65%/0.1)]">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Lighting & Decor</h3>
              </div>
              <ul className="space-y-2">
                {design.suggestions.lighting.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Color Palette */}
            <div className="rounded-2xl bg-card border border-border/50 backdrop-blur-sm p-6 shadow-[0_0_30px_hsl(263_70%_65%/0.1)]">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Color Palette</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {design.suggestions.colors.map((color, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-secondary text-sm"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignOutput;
