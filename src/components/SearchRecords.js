import React, { useEffect, useState } from 'react';
import { getSearchRecords, addSearchRecord, deleteSearchRecord } from '../api/searchRecords';

/**
 * SearchRecords ekranı:
 * Props:
 * - onBack(): geri dön
 * - simpatizanlar: array
 * - teskilat: array
 * - initialPerson: optional ön seçili kişi (object)
 */
export default function SearchRecords({ onBack, simpatizanlar = [], teskilat = [], initialPerson = null }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // form
  const people = [...(simpatizanlar || []), ...(teskilat || [])];

  const [personId, setPersonId] = useState(initialPerson ? initialPerson.id : (people[0] ? people[0].id : ''));
  const [searcherName, setSearcherName] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // if initialPerson provided after mount, set it
    if (initialPerson) setPersonId(initialPerson.id);
  }, [initialPerson]);

  async function load() {
    setLoading(true);
    try {
      const rs = await getSearchRecords();
      setRecords(rs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = async (e) => {
    e && e.preventDefault();
    if (!personId) {
      alert('Lütfen bir kişi seçin');
      return;
    }
    if (!searcherName.trim()) {
      alert('Arayan kişinin ismini girin');
      return;
    }

    const person = people.find((p) => p.id === personId);
    const payload = {
      personId,
      personName: person ? person.name : '',
      searcherName: searcherName.trim(),
      notes: notes.trim(),
      date: new Date().toISOString(),
    };

    try {
      setSaving(true);
      const saved = await addSearchRecord(payload);
      setRecords((prev) => [saved, ...prev]);
      // clear small fields
      setSearcherName('');
      setNotes('');
      alert('Arama kaydı eklendi.');
    } catch (err) {
      console.error(err);
      alert('Kayıt eklenemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    try {
      await deleteSearchRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
      alert('Silme başarısız.');
    }
  };

  return (
    <div className="screen">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3 style={{margin:0}}>Arama Kayıtları</h3>
        <div>
          <button className="btn ghost" onClick={onBack}>Geri</button>
        </div>
      </div>

      <form onSubmit={handleAdd} style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
        <label style={{fontWeight:700}}>Kişi</label>
        <select className="input" value={personId} onChange={(e)=>setPersonId(e.target.value)}>
          <option value="">-- Kişi seçin --</option>
          {people.map((p)=>(
            <option key={p.id} value={p.id}>{p.name} • {p.city} {p.title ? `• ${p.title}`: ''}</option>
          ))}
        </select>

        <label style={{fontWeight:700}}>Arayan Kişi</label>
        <input className="input" value={searcherName} onChange={(e)=>setSearcherName(e.target.value)} placeholder="Arayan kişinin ismi" />

        <label style={{fontWeight:700}}>Not</label>
        <textarea className="input" value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Opsiyonel not" style={{minHeight:80}} />

        <div style={{display:'flex', gap:8}}>
          <button className="btn primary" type="submit" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          <button className="btn ghost" type="button" onClick={() => { setSearcherName(''); setNotes(''); }}>Temizle</button>
        </div>
      </form>

      <div style={{marginTop:14}}>
        <strong>Kaydedilen Aramalar</strong>
        {loading ? <div style={{marginTop:8}}>Yükleniyor...</div> : (
          records.length === 0 ? <div style={{marginTop:8,color:'#666'}}>Henüz kayıt yok.</div> : (
            <div style={{marginTop:8, display:'flex', flexDirection:'column', gap:8}}>
              {records.map((r)=>(
                <div key={r.id} className="person-card" style={{alignItems:'flex-start'}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800}}>{r.personName} <span style={{fontWeight:600, color:'#666'}}>• {new Date(r.date).toLocaleString()}</span></div>
                    <div style={{marginTop:6}}>Arayan: <strong>{r.searcherName}</strong></div>
                    {r.notes ? <div style={{marginTop:6,color:'#444'}}>Not: {r.notes}</div> : null}
                  </div>
                  <div>
                    <button className="btn ghost" onClick={()=>handleDelete(r.id)}>Sil</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}