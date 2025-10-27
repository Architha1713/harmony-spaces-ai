import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DesignInput = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomType: "",
    aesthetic: "",
    colorScheme: "",
    budget: "",
    mood: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.roomType || !formData.aesthetic || !formData.mood) {
      toast({
        title: "Missing Information",
        description: "Please fill in room type, aesthetic, and mood",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-interior", {
        body: formData,
      });

      if (error) throw error;

      if (data?.image) {
        // Save to localStorage
        const savedDesigns = JSON.parse(localStorage.getItem("zenspace-designs") || "[]");
        const newDesign = {
          id: Date.now().toString(),
          ...formData,
          image: data.image,
          suggestions: data.suggestions,
          timestamp: new Date().toISOString(),
        };
        savedDesigns.push(newDesign);
        localStorage.setItem("zenspace-designs", JSON.stringify(savedDesigns));

        // Navigate to output page with design data
        navigate("/output", { state: newDesign });
      }
    } catch (error: any) {
      console.error("Error generating design:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="rounded-2xl bg-card border border-border/50 backdrop-blur-sm p-8 shadow-[0_0_30px_hsl(263_70%_65%/0.1)]">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Design Your Space</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type *</Label>
              <Select value={formData.roomType} onValueChange={(value) => setFormData({ ...formData, roomType: value })}>
                <SelectTrigger className="bg-secondary border-border/50">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="living-room">Living Room</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="bathroom">Bathroom</SelectItem>
                  <SelectItem value="office">Home Office</SelectItem>
                  <SelectItem value="dining">Dining Room</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aesthetic">Aesthetic Style *</Label>
              <Select value={formData.aesthetic} onValueChange={(value) => setFormData({ ...formData, aesthetic: value })}>
                <SelectTrigger className="bg-secondary border-border/50">
                  <SelectValue placeholder="Select aesthetic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="luxurious">Luxurious</SelectItem>
                  <SelectItem value="korean">Korean</SelectItem>
                  <SelectItem value="rustic">Rustic</SelectItem>
                  <SelectItem value="dark-academia">Dark Academia</SelectItem>
                  <SelectItem value="bohemian">Bohemian</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colorScheme">Color Scheme</Label>
              <Input
                id="colorScheme"
                placeholder="e.g., Warm neutrals, Navy blue and gold"
                value={formData.colorScheme}
                onChange={(e) => setFormData({ ...formData, colorScheme: e.target.value })}
                className="bg-secondary border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                <SelectTrigger className="bg-secondary border-border/50">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Budget Friendly ($)</SelectItem>
                  <SelectItem value="medium">Moderate ($$)</SelectItem>
                  <SelectItem value="high">Premium ($$$)</SelectItem>
                  <SelectItem value="luxury">Luxury ($$$$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">Current Mood *</Label>
              <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value })}>
                <SelectTrigger className="bg-secondary border-border/50">
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">Happy & Energetic</SelectItem>
                  <SelectItem value="calm">Calm & Peaceful</SelectItem>
                  <SelectItem value="inspired">Inspired & Creative</SelectItem>
                  <SelectItem value="stressed">Stressed & Need Comfort</SelectItem>
                  <SelectItem value="focused">Focused & Productive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements or ideas..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-secondary border-border/50 min-h-24"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl shadow-[0_0_30px_hsl(263_70%_65%/0.3)] hover:shadow-[0_0_40px_hsl(263_70%_65%/0.5)] transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Design...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Design
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DesignInput;
