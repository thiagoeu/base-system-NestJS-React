import { Loader2 } from "lucide-react";

export function FullPageLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 gap-2">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Verificando sessão...
      </p>
    </div>
  );
}
