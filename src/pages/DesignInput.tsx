import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { saveDesign } from "@/lib/designStorage";

const DesignInput = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    roomType: "",
    aesthetic: "",
    colorScheme: "",
    budget: "",
    mood: "",
    notes: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

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
        body: {
          ...formData,
          uploadedImage,
        },
      });

      if (error) throw error;

      if (data?.image) {
        const newDesign = {
          id: Date.now().toString(),
          roomType: formData.roomType,
          aesthetic: formData.aesthetic,
          mood: formData.mood,
          image: data.image,
          timestamp: new Date().toISOString(),
        };

        // Save to IndexedDB (non-blocking)
        saveDesign(newDesign).catch((err) => {
          console.error("Failed to save design:", err);
        });

        // Navigate to output page with full design data
        navigate("/output", { 
          state: { 
            ...newDesign,
            ...formData,
            suggestions: data.suggestions,
          } 
        });
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
      <Navigation />
      <div className="container mx-auto px-4 max-w-3xl pt-24">

        <div className="rounded-2xl bg-card border border-border/50 backdrop-blur-sm p-8 shadow-[0_0_30px_hsl(263_70%_65%/0.1)]">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Design Your Space</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="roomImage">Upload Room Image (Optional)</Label>
              <div className="flex items-center gap-4">
                {!uploadedImage ? (
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-border/50 rounded-xl p-8 hover:border-primary/50 transition-colors bg-secondary/50">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload room image</p>
                        <p className="text-xs text-muted-foreground">Max size: 5MB</p>
                      </div>
                    </div>
                    <input
                      id="roomImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex-1 relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded room"
                      className="w-full h-48 object-cover rounded-xl border border-border/50"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={removeImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

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
              <Select value={formData.colorScheme} onValueChange={(value) => setFormData({ ...formData, colorScheme: value })}>
                <SelectTrigger className="bg-secondary border-border/50">
                  <SelectValue placeholder="Select color scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warm-neutrals">Warm Neutrals (Beige, Cream, Tan)</SelectItem>
                  <SelectItem value="cool-neutrals">Cool Neutrals (Gray, White, Silver)</SelectItem>
                  <SelectItem value="black-white">Modern Black and White</SelectItem>
                  <SelectItem value="navy-gold">Navy Blue and Gold</SelectItem>
                  <SelectItem value="emerald-brass">Emerald Green and Brass</SelectItem>
                  <SelectItem value="blush-gray">Blush Pink and Gray</SelectItem>
                  <SelectItem value="terracotta-sage">Terracotta and Sage</SelectItem>
                  <SelectItem value="charcoal-mustard">Charcoal and Mustard</SelectItem>
                  <SelectItem value="burgundy-cream">Burgundy and Cream</SelectItem>
                  <SelectItem value="teal-copper">Teal and Copper</SelectItem>
                  <SelectItem value="forest-natural">Forest Green and Natural Wood</SelectItem>
                  <SelectItem value="lavender-white">Lavender and White</SelectItem>
                </SelectContent>
              </Select>
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
