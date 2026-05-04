import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, User, Menu, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      <aside className="hidden w-64 border-r bg-white md:block">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link
              to="/home"
              className="flex items-center gap-2 font-bold text-primary"
            >
              <div className="h-6 w-6 rounded bg-primary" />
              <span>Meu App</span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            <NavLinks isActive={isActive} />
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">
                  {user?.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex flex-1 flex-col">
        {/* Header - Mobile */}
        <header className="flex h-16 items-center border-b bg-white px-4 md:hidden justify-between">
          <Link to="/home" className="font-bold text-primary">
            Meu App
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="mt-8 space-y-2">
                <NavLinks isActive={isActive} />
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function NavLinks({ isActive }: { isActive: (path: string) => boolean }) {
  const links = [
    { to: "/home", label: "Dashboard", icon: LayoutDashboard },
    { to: "/perfil", label: "Meu Perfil", icon: User },
    { to: "/config", label: "Configurações", icon: Settings },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActive(link.to)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-slate-100 hover:text-primary"
          }`}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </>
  );
}
