import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Home, Palette } from "lucide-react";
import Navigation from "@/components/Navigation";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
      <Navigation />
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      
      <div className="relative z-10 container mx-auto px-4 py-20 pt-32">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20 animate-glow">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-6xl font-bold text-primary drop-shadow-lg">
              ZenSpace AI
            </h1>
          </div>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform Your Space with AI Magic
          </p>
        </div>

        {/* Hero content */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Experience the future of interior design. Our AI-powered platform creates stunning, 
            personalized room designs that perfectly match your style, mood, and budget.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="p-6 rounded-2xl bg-card border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(263_70%_65%/0.2)]">
              <Home className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">AI-Powered Design</h3>
              <p className="text-sm text-muted-foreground">
                Generate unique interior designs tailored to your preferences
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(263_70%_65%/0.2)]">
              <Palette className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Style & Mood</h3>
              <p className="text-sm text-muted-foreground">
                Choose from various aesthetics and match your current mood
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(263_70%_65%/0.2)]">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Smart Suggestions</h3>
              <p className="text-sm text-muted-foreground">
                Get intelligent furniture and decor recommendations
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button
            size="lg"
            onClick={() => navigate("/design")}
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-[0_0_40px_hsl(263_70%_65%/0.3)] hover:shadow-[0_0_50px_hsl(263_70%_65%/0.5)] transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Designing
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/gallery")}
            className="text-lg px-8 py-6 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 rounded-xl transition-all duration-300"
          >
            View Gallery
          </Button>
        </div>

        {/* About section */}
        <div className="max-w-3xl mx-auto mt-20 p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <h2 className="text-2xl font-semibold mb-4 text-center">How It Works</h2>
          <p className="text-muted-foreground leading-relaxed text-center">
            ZenSpace AI uses advanced artificial intelligence to understand your preferences 
            and visualize your dream interiors. Simply tell us about your room, select your 
            preferred style and mood, and watch as our AI creates a beautiful, personalized 
            design complete with furniture and decor suggestions tailored to your budget.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
