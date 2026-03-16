import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MessageCircle,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";

export const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">VideoJobs</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#como-funciona"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cómo funciona
            </a>
            <a
              href="#beneficios"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Beneficios
            </a>
            <a
              href="#testimonios"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonios
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Iniciar sesión</Button>
            </Link>
            <Link to="/register">
              <Button variant="default">Registrarse</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-primary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-accent opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6 animate-slide-up">
              <Star className="w-4 h-4" />
              La plataforma #1 de contratación de servicios
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-slide-up-delay-1">
              Conecta con los mejores{" "}
              <span className="text-gradient">profesionales</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up-delay-2">
              Encuentra proveedores de servicios calificados o publica tus
              habilidades para conseguir más clientes. Todo en una plataforma
              segura y fácil de usar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-3">
              <Link to="/registro?tipo=contratador">
                <Button size="xl" variant="hero">
                  Buscar profesionales
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/registro?tipo=proveedor">
                <Button size="xl" variant="outline">
                  Ofrecer mis servicios
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { value: "10K+", label: "Profesionales" },
              { value: "25K+", label: "Contrataciones" },
              { value: "4.9", label: "Calificación" },
              { value: "99%", label: "Satisfacción" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl glass">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">¿Cómo funciona?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conectarte con profesionales o encontrar clientes nunca fue tan
              fácil
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Users,
                title: "Regístrate",
                description:
                  "Crea tu perfil como contratador o proveedor en minutos. Completa tu información y empieza a conectar.",
                step: "01",
              },
              {
                icon: Briefcase,
                title: "Publica o Busca",
                description:
                  "Los proveedores publican sus servicios y experiencia. Los contratadores exploran las postulaciones disponibles.",
                step: "02",
              },
              {
                icon: MessageCircle,
                title: "Conecta en tiempo real",
                description:
                  "Inicia conversaciones directas con chat en tiempo real para acordar detalles y cerrar el trato.",
                step: "03",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative p-8 rounded-3xl bg-card shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {item.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Todo lo que necesitas para{" "}
                <span className="text-gradient">crecer tu negocio</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Nuestra plataforma está diseñada para facilitar la conexión
                entre contratadores y proveedores de servicios de manera
                eficiente y segura.
              </p>
              <div className="space-y-4">
                {[
                  "Perfiles verificados y calificaciones reales",
                  "Chat en tiempo real para comunicación directa",
                  "Sistema de postulaciones organizado",
                  "Búsqueda avanzada por categorías",
                  "Notificaciones instantáneas",
                  "Historial completo de conversaciones",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl rotate-3 opacity-20" />
              <div className="relative bg-card rounded-3xl p-8 shadow-xl">
                <div className="space-y-6">
                  {/* Mock postulation card */}
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-accent" />
                      <div>
                        <h4 className="font-semibold">Juan Pérez</h4>
                        <p className="text-sm text-muted-foreground">
                          Plomero certificado
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      5 años de experiencia en instalaciones y reparaciones
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                        Plomería
                      </span>
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                        Disponible
                      </span>
                    </div>
                  </div>
                  {/* Mock chat */}
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">
                        Chat en tiempo real
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-end">
                        <div className="px-3 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-sm max-w-[200px]">
                          Hola, ¿está disponible mañana?
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="px-3 py-2 rounded-xl bg-muted text-sm max-w-[200px]">
                          ¡Sí! ¿A qué hora le conviene?
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonios"
        className="py-20 bg-gradient-hero text-primary-foreground"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Miles de profesionales y contratadores confían en ConectaPro
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "María García",
                role: "Contratadora",
                text: "Encontré al mejor electricista de mi zona en minutos. La comunicación fue excelente y el trabajo impecable.",
              },
              {
                name: "Carlos Rodríguez",
                role: "Plomero",
                text: "Desde que estoy en ConectaPro, mis clientes aumentaron un 200%. La plataforma es muy fácil de usar.",
              },
              {
                name: "Ana Martínez",
                role: "Contratadora",
                text: "El chat en tiempo real hace todo más fácil. Puedo coordinar los trabajos sin perder tiempo.",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-current text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-primary-foreground/90 mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20" />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-primary-foreground/70">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">¿Listo para empezar?</h2>
            <p className="text-muted-foreground text-lg mb-10">
              Únete a miles de profesionales y contratadores que ya están
              conectando en ConectaPro
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/registro">
                <Button>
                  Crear cuenta gratis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">ConectaPro</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contacto
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ConectaPro. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
