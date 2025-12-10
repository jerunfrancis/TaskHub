import { useApi } from "../api/client";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Me(){
  const api = useApi();
  const { logout } = useAuth();
  const [msg, setMsg] = useState("");

  useEffect(()=>{
    api.get("/api/me").then(r=>setMsg(r.data)).catch(()=>setMsg("Auth required"));
  }, []);

  return (
    <div>
      <h2>Protected</h2>
      <p>{msg}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
