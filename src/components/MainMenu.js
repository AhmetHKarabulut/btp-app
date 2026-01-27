import React, { useState, useEffect, useMemo } from "react";

// -- Demo data --
const isimler = ["Emre", "Zeynep", "Baran", "Tuğba", "Mert", "Ayşe", "Seda", "Cem", "Berk", "Hülya", "Mehmet", "Kaan"];
const soyadlar = ["Kurt", "Aksoy", "Yılmaz", "Koç", "Çelik", "Bulut", "Aslan", "Demir"];
const tipler = ["Teşkilat", "Sempatizan"];
const iller = ["İstanbul", "Ankara", "İzmir", "Bursa", "Adana"];
const ilceler = ["Kadıköy", "Çankaya", "Konak", "Osmangazi", "Seyhan"];
function rasgeleTel() {
  return "05" + (10 + Math.floor(Math.random() * 80)) + " " +
    (100 + Math.floor(Math.random() * 900)) + " " +
    (1000 + Math.floor(Math.random() * 9000));
}
function rasgeleTarih() {
  const start = new Date(2021, 0, 1).getTime();
  const end = new Date(2024, 11, 31).getTime();
  const t = new Date(start + Math.random() * (end - start));
  return t.toISOString().slice(0, 10);
}
function fakeRows(count = 10000) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    isim: isimler[Math.floor(Math.random() * isimler.length)] + " " + soyadlar[Math.floor(Math.random() * soyadlar.length)],
    tel: rasgeleTel(),
    tur: tipler[Math.floor(Math.random() * tipler.length)],
    sonGorusme: rasgeleTarih(),
    il: iller[Math.floor(Math.random() * iller.length)],
    ilce: ilceler[Math.floor(Math.random() * ilceler.length)],
    not: ""
  }));
}
const PAGE_SIZE = 10;

const sortOptions = [
  { value: "", label: "Varsayılan" },
  { value: "sonGorusme_az", label: "Son Görüşme: En Eski" },
  { value: "sonGorusme_art", label: "Son Görüşme: En Yeni" },
  { value: "isim_a", label: "Alfabetik (A-Z)" },
  { value: "isim_z", label: "Alfabetik (Z-A)" },
];

function Paginator({ page, maxPage, setPage }) {
  const nums = [];
  const min = Math.max(1, page - 2), max = Math.min(maxPage, page + 2);
  for (let i = min; i <= max; ++i) nums.push(i);
  return (
    <div className="ultra-btp-pagi">
      <button className="upg-btn" disabled={page === 1} onClick={() => setPage(1)}>{'<<'}</button>
      <button className="upg-btn" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>{'<'}</button>
      {nums.map(n => (
        <button key={n} className={`upg-num ${n === page ? "act" : ""}`} onClick={() => setPage(n)}>{n}</button>
      ))}
      <button className="upg-btn" disabled={page === maxPage} onClick={() => setPage(p => Math.min(maxPage, p + 1))}>{'>'}</button>
      <button className="upg-btn" disabled={page === maxPage} onClick={() => setPage(maxPage)}>{'>>'}</button>
      <span className="upg-total">
        / {maxPage}
      </span>
    </div>
  );
}

export default function MainMenu({ onLogout }) {
  const [rows, setRows] = useState(fakeRows());
  const [expandedId, setExpandedId] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [page, setPage] = useState(1);
  const [isimFilter, setIsimFilter] = useState("");
  const [telFilter, setTelFilter] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState("");

  // Filtre ve sıralama
  const filteredRows = useMemo(() => {
    let list = rows;
    if (isimFilter.trim())
      list = list.filter(r => r.isim.toLocaleLowerCase("tr").includes(isimFilter.toLocaleLowerCase("tr")));
    if (telFilter.trim())
      list = list.filter(r => r.tel.replace(/\s/g, '').includes(telFilter.replace(/\s/g, '')));
    if (sortBy === "sonGorusme_art") {
      list = [...list].sort((a, b) =>
        (new Date(b.sonGorusme)).getTime() - (new Date(a.sonGorusme)).getTime()
      );
    } else if (sortBy === "sonGorusme_az") {
      list = [...list].sort((a, b) =>
        (new Date(a.sonGorusme)).getTime() - (new Date(b.sonGorusme)).getTime()
      );
    } else if (sortBy === "isim_a") {
      list = [...list].sort((a, b) => a.isim.localeCompare(b.isim, 'tr', { sensitivity: "base" }));
    } else if (sortBy === "isim_z") {
      list = [...list].sort((a, b) => b.isim.localeCompare(a.isim, 'tr', { sensitivity: "base" }));
    }
    return list;
  }, [rows, isimFilter, telFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const visibleRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  useEffect(() => { setPage(1); }, [isimFilter, telFilter, sortBy]);

  // Güncelleme formu inputları
  function handleInput(e) {
    const { name, value } = e.target;
    setEditRow(r => ({ ...r, [name]: value }));
  }
  function handleSave() {
    setRows(rows => rows.map(r => r.id === editRow.id ? { ...editRow } : r));
    setEditRow(null);
  }

  // Modal açıkken scroll kilitle
  useEffect(() => {
    if (!!editRow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [editRow]);

  return (
    <div className="bpv-main-bg">
      <header className="bpv-header">
        <div className="bpv-logo-card">
          <img src="/btp-logo.png" alt="BTP Logo" className="bpv-logo" />
        </div>
        <h1 className="bpv-title">BTP Üye Listesi</h1>
        <button className="bpv-logout-btn" onClick={onLogout}>
          <svg width="24" height="24" style={{ marginRight: 6 }} fill="none" stroke="#c8102e" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h13.5M16.3 9.1L19 12l-2.7 2.9" /></svg>
          <span>Çıkış</span>
        </button>
      </header>

      {/* Filtreler ve Sıralama */}
      <div className="bpv-filters-wrap">
        <div className="bpv-filters">
          <input
            className="bpv-filter"
            placeholder="İsim Soyisim"
            value={isimFilter}
            onChange={e => setIsimFilter(e.target.value)}
          />
          <input
            className="bpv-filter"
            placeholder="Telefon"
            value={telFilter}
            onChange={e => setTelFilter(e.target.value)}
            maxLength={12}
          />
          <button
            className="bpv-sort-btn"
            onClick={() => setShowSort(v => !v)}
            aria-label="Sırala"
          >
            <svg height="20" width="20" viewBox="0 0 24 24" style={{ marginRight: 5 }}>
              <path d="M3 18h6M3 13h12M3 8h18" stroke="#c8102e" strokeWidth="2.1" strokeLinecap="round" fill="none" />
            </svg>
            Sırala
          </button>
        </div>
        {showSort && (
          <div className="bpv-sort-popup">
            {sortOptions.map(opt => (
              <button
                key={opt.value}
                className={`bpv-sort-popup-opt${sortBy === opt.value ? " act" : ""}`}
                onClick={() => { setSortBy(opt.value); setShowSort(false); }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bpv-list">
        <div className="bpv-rowhead">
          <span style={{ flex: '0 0 30px' }} />
          <span className="bpv-colhead">İsim Soyisim</span>
          <span className="bpv-colhead">Telefon</span>
          <span className="bpv-colhead">Tip</span>
          <span className="bpv-colhead">Son Görüşme</span>
        </div>
        {visibleRows.map(row => (
          <div className="bpv-card" key={row.id}>
            <div className="bpv-row">
              <button
                className="bpv-plusbtn"
                onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                aria-label={expandedId === row.id ? "Kapat" : "Detay"}
              >
                {expandedId === row.id ? (
                  <span style={{ color: "#c8102e", fontWeight:700, fontSize:"1.2em" }}>−</span>
                ) : (
                  <span style={{ color: "#c8102e", fontWeight:700, fontSize:"1.25em" }}>+</span>
                )}
              </button>
              <span className="bpv-name">{row.isim}</span>
              <span className="bpv-tel">{row.tel}</span>
              <span className={`bpv-badge ${row.tur === "Teşkilat" ? "b-te" : "b-se"}`}>{row.tur}</span>
              <span className="bpv-son-g">{row.sonGorusme}</span>
            </div>
            {expandedId === row.id && (
              <div className="bpv-detail">
                <div><b>İsim Soyisim:</b> {row.isim}</div>
                <div><b>Telefon:</b> {row.tel}</div>
                <div><b>Tip:</b> {row.tur}</div>
                <div><b>Son Görüşme:</b> {row.sonGorusme}</div>
                <div><b>İl/İlçe:</b> {row.il} / {row.ilce}</div>
                <div><b>Not:</b> <span className="bpv-not">{row.not}</span></div>
                <button className="bpv-update-btn" onClick={() => setEditRow(row)}>
                  Güncelle
                </button>
              </div>
            )}
          </div>
        ))}
        <Paginator page={page} maxPage={totalPages} setPage={setPage} />
      </div>
      {/* Güncelle modalı */}
      {editRow && (
        <div className="bpv-modal-bg" onClick={() => setEditRow(null)}>
          <div className="bpv-modal" onClick={e => e.stopPropagation()}>
            <div className="bpv-modal-title">{editRow.isim} - Bilgi Güncelle</div>
            <form className="bpv-modal-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <label>
                İsim Soyisim: <input name="isim" value={editRow.isim} onChange={handleInput} required />
              </label>
              <label>
                Telefon: <input name="tel" value={editRow.tel} onChange={handleInput} required />
              </label>
              <label>
                Tip:
                <select name="tur" value={editRow.tur} onChange={handleInput}>
                  <option>Teşkilat</option>
                  <option>Sempatizan</option>
                </select>
              </label>
              <label>
                Son Görüşme: <input name="sonGorusme" type="date" value={editRow.sonGorusme} onChange={handleInput} required />
              </label>
              <label>
                İl: <input name="il" value={editRow.il} onChange={handleInput} required />
              </label>
              <label>
                İlçe: <input name="ilce" value={editRow.ilce} onChange={handleInput} required />
              </label>
              <label>
                Not: <textarea name="not" value={editRow.not} onChange={handleInput} style={{
                  width: "100%",
                  minHeight: "48px",
                  maxHeight: "260px",
                  padding: "9px 12px",
                  fontSize: "1em",
                  fontFamily: "inherit",
                  background: "#fff7fb",
                  color: "#a3284d",
                  border: "1.2px solid #e6bdd9",
                  borderRadius: "10px",
                  resize: "vertical",
                  boxShadow: "0 1px 7px #c8102e12",
                  marginTop: "5px",
                  marginBottom: "10px",
                  transition: "border .15s"
                }} />
              </label>
              <div className="bpv-modal-btns">
                <button type="submit" className="bpv-modal-save">Kaydet</button>
                <button type="button" className="bpv-modal-cancel" onClick={() => setEditRow(null)}>Vazgeç</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}