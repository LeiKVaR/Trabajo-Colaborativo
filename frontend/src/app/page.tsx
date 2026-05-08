import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, Clock, Kanban } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar Simple */}
      <nav className="flex items-center justify-between p-6 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-soft">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">Asistly</span>
        </div>
        <Link href="/login">
          <Button variant="ghost" className="hover-lift">Iniciar Sesión</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center stagger">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 shadow-soft">
          ✨ Nueva versión 2026
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          El sistema definitivo para <br />
          <span className="text-gradient-primary">gestionar tu entorno</span>
        </h1>
        
        <p className="max-w-[600px] text-muted-foreground md:text-xl mb-10">
          Asistencia, tareas y productividad en una sola plataforma diseñada para equipos de alto rendimiento.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <Button size="lg" className="px-8 gap-2 hover-lift shadow-card">
              Empezar ahora <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="px-8 hover-lift">
              Ver Demo
            </Button>
          </Link>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full text-left">
          <FeatureCard 
            icon={<Clock className="text-primary" />}
            title="Asistencia Real-time"
            desc="Control de entradas, salidas y descansos con geolocalización."
          />
          <FeatureCard 
            icon={<Kanban className="text-primary" />}
            title="Kanban Inteligente"
            desc="Organiza tareas y proyectos con un flujo visual intuitivo."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-primary" />}
            title="Panel de Admin"
            desc="Gestión total de usuarios, roles y reportes detallados."
          />
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-muted-foreground border-t border-border/40">
        © 2026 Asistly. Todos los derechos reservados.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-xl border border-border/60 bg-card/50 hover-lift shadow-soft">
      <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
