import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

import "./style.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/sync`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then((response) => response.json())
        .then(setUser);
    });
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  return (
    <main>
      <h1>EchoPrint</h1>
      <p>React frontend is running.</p>
      <button onClick={signInWithGoogle}>Continue with Google</button>
      {user && <p>Signed in as {user.email}</p>}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
