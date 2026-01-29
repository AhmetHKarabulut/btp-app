import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length < 2 || pass.length < 2) return;
    if (onLogin) onLogin(username);
  };

  return (
    <div className="btp-login-bg">
      
      <div className="btp-login-card">
        <img src="/btp-logo.png" alt="BTP Logo" className="btp-login-logo" />
              <img
        className="login-bg-img"
        src="/huseyin-bas.jpg"
        alt=""
        draggable={false}
      />
        <div className="btp-login-party">BTP</div>
        <div className="btp-login-title">Bağımsız Türkiye Partisi</div>
        <div className="btp-login-sub">Üye Girişi</div>
        <form className="btp-login-form" onSubmit={handleSubmit}>
          <input
            className="btp-login-input"
            type="text"
            autoComplete="username"
            placeholder="Kullanıcı adı"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            className="btp-login-input"
            type="password"
            autoComplete="current-password"
            placeholder="Şifre"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
          />
          <button className="btp-login-btn" type="submit">
            Giriş Yap
          </button>
        </form>
        <div className="btp-login-footer">
          © {new Date().getFullYear()} Bağımsız Türkiye Partisi
        </div>
      </div>
    </div>
  );
}