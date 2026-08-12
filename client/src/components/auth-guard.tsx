"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useMeQuery } from "@/lib/queries/auth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isPending, isError } = useMeQuery();

  useEffect(() => {
    if (!isPending && isError) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, isError, pathname, router]);

  // Covers the loading state and the brief window before the redirect above
  // actually navigates away — never flash protected content or a broken
  // sidebar (which itself needs the same user data) while that's pending.
  if (isPending || isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
