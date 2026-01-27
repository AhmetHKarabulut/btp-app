import React from 'react';

export default function PeopleList({ title, people, onBack, onSelect, onAddRecord }) {
  return (
    <div className="screen">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <div>
          <button className="btn ghost" onClick={onBack}>Geri</button>
        </div>
      </div>

      <div className="list-grid" style={{ marginTop: 10 }}>
        {people.map((p) => (
          <div key={p.id} className="person-card" style={{position:'relative'}} >
            <div style={{display:'flex', gap:12, alignItems:'center', width:'100%'}} onClick={() => onSelect(p)}>
              <div className="avatar" aria-hidden>{(p.name.split(' ').map(n => n[0]).slice(0, 2).join(''))}</div>
              <div className="person-meta">
                <div className="person-name">{p.name}</div>
                <div className="person-sub">{p.title || p.role} • {p.city}</div>
              </div>
            </div>

            {onAddRecord && (
              <button
                title="Arama kaydı ekle"
                onClick={(e) => { e.stopPropagation(); onAddRecord(p); }}
                style={{
                  position:'absolute',
                  right:12,
                  top:12,
                  background:'var(--btp-red)',
                  color:'#fff',
                  border:0,
                  borderRadius:10,
                  padding:'6px 8px',
                  cursor:'pointer',
                  fontWeight:800,
                }}
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}