"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/src/lib/supabase/client";

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  user: User | null;
};

export function useAuth() {
  const supabase = useMemo(() => createClient(), []);
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    session: null,
    user: null,
  });

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setAuthState({
        isLoading: false,
        isAuthenticated: Boolean(data.session),
        session: data.session,
        user: data.session?.user ?? null,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        isLoading: false,
        isAuthenticated: Boolean(session),
        session,
        user: session?.user ?? null,
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    ...authState,
    signOut: () => supabase.auth.signOut(),
  };
}
