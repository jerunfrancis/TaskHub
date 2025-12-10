import React, { createContext, useContext, useMemo, useState } from "react";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => {
    try { return JSON.parse(localStorage.getItem("auth")) || {}; } catch { return {}; }
  });

  const login = (data) => {
    // expect { accessToken, username, role }
    const next = {
      accessToken: data?.accessToken || "",
      username: data?.username || "",
      role: (data?.role || "").toUpperCase(),
    };
    localStorage.setItem("auth", JSON.stringify(next));
    setState(next);
  };

  const logout = () => { localStorage.removeItem("auth"); setState({}); };

  const value = useMemo(() => ({ ...state, login, logout }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
