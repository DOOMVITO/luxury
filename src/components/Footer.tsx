
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-border/50">
      {/* Borda dourada superior */}
      <div className="h-1 gold-gradient"></div>
      
      {/* Background com padrão dourado sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full gold-gradient"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center group">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src="/lovable-uploads/b165b102-dd18-4ec5-9a48-aaf0f105fe61.png" 
                  alt="CONTATUS JOIAS" 
                  className="h-10 w-auto transition-transform duration-300 group-hover:scale-110 filter brightness-0 invert"
                />
                <div className="absolute inset-0 gold-gradient opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Joias exclusivas e sofisticadas para momentos especiais. 
              <span className="gold-text font-medium">Qualidade e elegância</span> em cada peça.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold gold-text">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group">
                  <span className="relative z-10">Início</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 gold-gradient group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/categoria/aneis" className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group">
                  <span className="relative z-10">Anéis</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 gold-gradient group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/categoria/colares" className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group">
                  <span className="relative z-10">Colares</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 gold-gradient group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/categoria/brincos" className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group">
                  <span className="relative z-10">Brincos</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 gold-gradient group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold gold-text">Categorias</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/categoria/pulseiras" className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group">
                  <span className="relative z-10">Pulseiras</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 gold-gradient group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">Joias Personalizadas</span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">Coleção Premium</span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">Alianças</span>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold gold-text">Contato</h3>
            <div className="space-y-3 text-muted-foreground">
              <p className="hover:text-primary transition-colors duration-300">WhatsApp: (55) 38 99919-6878</p>
              <p className="hover:text-primary transition-colors duration-300">Email: contato@contatusjoias.com.br</p>
              <p>Seg - Sex: 9h às 18h</p>
              <p>Sáb: 9h às 14h</p>
            </div>
            
            {/* Redes Sociais com efeitos */}
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-110 hover:gold-shadow">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-110 hover:gold-shadow">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-110 hover:gold-shadow">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 mt-12 pt-8 text-center text-muted-foreground relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 gold-gradient"></div>
          <p className="mt-4">&copy; 2025 CONTATUS JOIAS. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
