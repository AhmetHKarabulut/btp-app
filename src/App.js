import React, { useState } from "react";
import Login from "./components/Login";
import MainMenu from "./components/MainMenu";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <Login onLogin={name => setUser({ name })} />
      ) : (
        <MainMenu user={user} onLogout={() => setUser(null)} />
      )}
    </div>
  );
}