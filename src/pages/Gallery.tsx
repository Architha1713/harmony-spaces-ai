import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

interface SavedDesign {
  id: string;
  roomType: string;
  aesthetic: string;
  mood: string;
  image: string;
  timestamp: string;
}

const Gallery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [designs, setDesigns] = useState<SavedDesign[]>([]);

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = () => {
    const saved = localStorage.getItem("zenspace-designs");
    if (saved) {
      setDesigns(JSON.parse(saved));
    }
  };

  const handleDelete = (id: string) => {
    const updated = designs.filter((d) => d.id !== id);
    localStorage.setItem("zenspace-designs", JSON.stringify(updated));
    setDesigns(updated);
    toast({
      title: "Design Deleted",
      description: "The design has been removed from your gallery",
    });
  };

  const handleView = (design: SavedDesign) => {
    navigate("/output", { state: design });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12">
      <Navigation />
      <div className="container mx-auto px-4 max-w-7xl pt-24">

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">My Designs</h1>
        </div>

        {designs.length === 0 ? (
          <div className="text-center py-20">
            <div className="p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm inline-block mb-6">
              <Sparkles className="w-16 h-16 text-muted-foreground mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">No Designs Yet</h2>
            <p className="text-muted-foreground mb-8">
              Start creating your dream interior designs with AI
            </p>
            <Button
              onClick={() => navigate("/design")}
              className="bg-primary hover:bg-primary/90 rounded-xl"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Your First Design
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div
                key={design.id}
                className="rounded-2xl bg-card border border-border/50 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(263_70%_65%/0.2)]"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={design.image}
                    alt={`${design.roomType} design`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg capitalize mb-1">
                      {design.roomType.replace("-", " ")}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {design.aesthetic}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                        {design.mood}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    {new Date(design.timestamp).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleView(design)}
                      className="flex-1 bg-primary hover:bg-primary/90 rounded-lg"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(design.id)}
                      className="border-destructive/30 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
