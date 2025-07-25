
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/b6eb0526-f5aa-4dcb-a112-4522be56e398.png"
          alt="Elegant jewelry background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80"></div>
      </div>

      {/* Subtle golden particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 gold-gradient rounded-full opacity-15 animate-float" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 text-center z-10">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          {/* Elegant heading with delicate styling */}
          <h1 className="text-4xl md:text-6xl font-playfair font-light text-foreground leading-tight tracking-wide">
            <span className="block text-2xl md:text-3xl font-normal mb-2 text-muted-foreground">
              Elegância em cada detalhe
            </span>
            <span className="gold-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 font-medium">
              Joias Exclusivas
            </span>
            <span className="block text-lg md:text-xl mt-3 font-light italic text-muted-foreground">
              para momentos especiais
            </span>
          </h1>

          {/* Refined subtitle */}
          <p className="text-md md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed font-light">
            Descubra peças sofisticadas que <span className="gold-text font-normal">elevam sua presença</span> e contam sua história através da delicadeza de nosso artesanato.
          </p>

          {/* Delicate CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link to="/produtos">
              <Button size="lg" className="text-md px-6 py-5 group gold-gradient hover:gold-shadow transition-all duration-300 relative overflow-hidden">
                <span className="relative z-10">Explorar Coleção</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            </Link>
            
            <Link to="/categoria/colares">
              <Button variant="outline" size="lg" className="text-md px-6 py-5 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary hover:gold-shadow transition-all duration-300">
                Ver Destaques
              </Button>
            </Link>
          </div>

          {/* Refined stats section */}
          <div className="grid grid-cols-3 gap-4 pt-10 border-t border-primary/20 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 gold-gradient opacity-50"></div>
            
            <div className="space-y-1 group">
              <div className="text-2xl font-light gold-text group-hover:scale-105 transition-transform duration-300">10+</div>
              <div className="text-xs text-muted-foreground">Anos de Experiência</div>
            </div>
            <div className="space-y-1 group">
              <div className="text-2xl font-light gold-text group-hover:scale-105 transition-transform duration-300">500+</div>
              <div className="text-xs text-muted-foreground">Joias Exclusivas</div>
            </div>
            <div className="space-y-1 group">
              <div className="text-2xl font-light gold-text group-hover:scale-105 transition-transform duration-300">1000+</div>
              <div className="text-xs text-muted-foreground">Clientes Satisfeitos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
