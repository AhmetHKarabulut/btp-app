import React, { useState } from 'react';
import { updatePerson } from '../api/people';

export default function PersonDetail({ person, onBack, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: person.name || '',
    phone: person.phone || '',
    email: person.email || '',
    city: person.city || '',
    address: person.address || '',
    notes: person.notes || '',
    title: person.title || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setForm({
      name: person.name || '',
      phone: person.phone || '',
      email: person.email || '',
      city: person.city || '',
      address: person.address || '',
      notes: person.notes || '',
      title: person.title || '',
    });
    setEditing(false);
    setError('');
    setLoading(false);
  }, [person]);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const startEdit = () => setEditing(true);

  const cancelEdit = () => {
    setEditing(false);
    setForm({
      name: person.name || '',
      phone: person.phone || '',
      email: person.email || '',
      city: person.city || '',
      address: person.address || '',
      notes: person.notes || '',
      title: person.title || '',
    });
    setError('');
  };

  const save = async () => {
    setLoading(true);
    setError('');
    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      city: form.city,
      address: form.address,
      notes: form.notes,
      title: form.title,
    };

    try {
      const updated = await updatePerson(person.id, payload);
      if (updated) {
        setEditing(false);
        if (onUpdated) onUpdated(updated);
      } else {
        setError('Güncelleme yapılamadı. Sunucudan beklenmeyen yanıt alındı.');
      }
    } catch (e) {
      console.error('Update failed:', e);
      const serverMsg = e?.response?.data?.message
        || (typeof e?.response?.data === 'string' ? e.response.data : null)
        || e?.message;
      setError(serverMsg || 'Sunucu hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true">
      <div className="detail-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="avatar" style={{ width: 68, height: 68, fontSize: 26 }}>
              {person.name.split(' ').map(n => n[0]).slice(0,2).join('')}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{person.name}</div>
              <div style={{ color: '#666' }}>{person.title || person.role}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {!editing && <button className="btn ghost" onClick={startEdit}>Düzenle</button>}
            <button className="btn ghost" onClick={onBack}>Kapat</button>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          {editing ? (
            <>
              <label className="input-label">İsim</label>
              <input className="input" value={form.name} onChange={handleChange('name')} />

              <label className="input-label" style={{ marginTop: 8 }}>Unvan</label>
              <input className="input" value={form.title} onChange={handleChange('title')} />

              <label className="input-label" style={{ marginTop: 8 }}>Telefon</label>
              <input className="input" value={form.phone} onChange={handleChange('phone')} />

              <label className="input-label" style={{ marginTop: 8 }}>E-posta</label>
              <input className="input" value={form.email} onChange={handleChange('email')} />

              <label className="input-label" style={{ marginTop: 8 }}>Şehir</label>
              <input className="input" value={form.city} onChange={handleChange('city')} />

              <label className="input-label" style={{ marginTop: 8 }}>Adres</label>
              <input className="input" value={form.address} onChange={handleChange('address')} />

              <label className="input-label" style={{ marginTop: 8 }}>Notlar</label>
              <textarea className="input" value={form.notes} onChange={handleChange('notes')} style={{ minHeight: 80 }} />

              {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}

              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button className="btn primary" onClick={save} disabled={loading}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</button>
                <button className="btn ghost" onClick={cancelEdit} disabled={loading}>İptal</button>
              </div>
            </>
          ) : (
            <>
              <div className="detail-row"><div className="detail-label">Telefon</div><div className="detail-value">{person.phone}</div></div>
              <div className="detail-row"><div className="detail-label">E-posta</div><div className="detail-value">{person.email}</div></div>
              <div className="detail-row"><div className="detail-label">Şehir</div><div className="detail-value">{person.city}</div></div>
              <div className="detail-row"><div className="detail-label">Adres</div><div className="detail-value">{person.address}</div></div>
              <div className="detail-row"><div className="detail-label">Notlar</div><div className="detail-value">{person.notes}</div></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}