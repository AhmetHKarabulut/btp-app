import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';

// Demo data generator
const isimler = ['Emre', 'Zeynep', 'Baran', 'Tuğba', 'Mert', 'Ayşe', 'Seda', 'Cem', 'Berk', 'Hülya', 'Mehmet', 'Kaan'];
const soyadlar = ['Kurt', 'Aksoy', 'Yılmaz', 'Koç', 'Çelik', 'Bulut', 'Aslan', 'Demir'];
const tipler = ['Teşkilat', 'Sempatizan'];
const iller = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Adana'];
const ilceler = ['Kadıköy', 'Çankaya', 'Konak', 'Osmangazi', 'Seyhan'];

function rasgeleTel() {
  return '05' + (10 + Math.floor(Math.random() * 80)) + ' ' +
    (100 + Math.floor(Math.random() * 900)) + ' ' +
    (1000 + Math.floor(Math.random() * 9000));
}

function rasgeleTarih() {
  const start = new Date(2021, 0, 1).getTime();
  const end = new Date(2024, 11, 31).getTime();
  const t = new Date(start + Math.random() * (end - start));
  return t.toISOString().slice(0, 10);
}

function fakeRows(count = 1000) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    isim: isimler[Math.floor(Math.random() * isimler.length)] + ' ' + 
          soyadlar[Math.floor(Math.random() * soyadlar.length)],
    tel: rasgeleTel(),
    tur: tipler[Math.floor(Math.random() * tipler.length)],
    sonGorusme: rasgeleTarih(),
    il: iller[Math.floor(Math.random() * iller.length)],
    ilce: ilceler[Math.floor(Math.random() * ilceler.length)],
    not: '',
  }));
}

const sortOptions = [
  { value: '', label: 'Varsayılan' },
  { value: 'sonGorusme_az', label: 'Son Görüşme: En Eski' },
  { value: 'sonGorusme_art', label: 'Son Görüşme: En Yeni' },
  { value: 'isim_a', label: 'Alfabetik (A-Z)' },
  { value: 'isim_z', label: 'Alfabetik (Z-A)' },
];

export default function MainMenuScreen({ navigation, onLogout }) {
  const [rows, setRows] = useState(fakeRows());
  const [expandedId, setExpandedId] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [isimFilter, setIsimFilter] = useState('');
  const [telFilter, setTelFilter] = useState('');
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState('');

  // Filter and sort
  const filteredRows = useMemo(() => {
    let list = rows;
    if (isimFilter.trim()) {
      list = list.filter(r => 
        r.isim.toLocaleLowerCase('tr').includes(isimFilter.toLocaleLowerCase('tr'))
      );
    }
    if (telFilter.trim()) {
      list = list.filter(r => 
        r.tel.replace(/\s/g, '').includes(telFilter.replace(/\s/g, ''))
      );
    }
    if (sortBy === 'sonGorusme_art') {
      list = [...list].sort((a, b) =>
        new Date(b.sonGorusme).getTime() - new Date(a.sonGorusme).getTime()
      );
    } else if (sortBy === 'sonGorusme_az') {
      list = [...list].sort((a, b) =>
        new Date(a.sonGorusme).getTime() - new Date(b.sonGorusme).getTime()
      );
    } else if (sortBy === 'isim_a') {
      list = [...list].sort((a, b) => a.isim.localeCompare(b.isim, 'tr'));
    } else if (sortBy === 'isim_z') {
      list = [...list].sort((a, b) => b.isim.localeCompare(a.isim, 'tr'));
    }
    return list;
  }, [rows, isimFilter, telFilter, sortBy]);

  const handleInput = (name, value) => {
    setEditRow(r => ({ ...r, [name]: value }));
  };

  const handleSave = () => {
    setRows(rows => rows.map(r => r.id === editRow.id ? { ...editRow } : r));
    setEditRow(null);
    Alert.alert('Başarılı', 'Bilgiler güncellendi');
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
        >
          <View style={styles.rowContent}>
            <Text style={styles.plusBtn}>{isExpanded ? '−' : '+'}</Text>
            <View style={styles.rowInfo}>
              <Text style={styles.name}>{item.isim}</Text>
              <Text style={styles.tel}>{item.tel}</Text>
              <View style={[styles.badge, item.tur === 'Teşkilat' ? styles.badgeT : styles.badgeS]}>
                <Text style={styles.badgeText}>{item.tur}</Text>
              </View>
              <Text style={styles.date}>{item.sonGorusme}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.detail}>
            <Text style={styles.detailText}><Text style={styles.bold}>İsim:</Text> {item.isim}</Text>
            <Text style={styles.detailText}><Text style={styles.bold}>Telefon:</Text> {item.tel}</Text>
            <Text style={styles.detailText}><Text style={styles.bold}>Tip:</Text> {item.tur}</Text>
            <Text style={styles.detailText}><Text style={styles.bold}>Son Görüşme:</Text> {item.sonGorusme}</Text>
            <Text style={styles.detailText}><Text style={styles.bold}>İl/İlçe:</Text> {item.il} / {item.ilce}</Text>
            <Text style={styles.detailText}><Text style={styles.bold}>Not:</Text> {item.not || 'Yok'}</Text>
            <TouchableOpacity style={styles.updateBtn} onPress={() => setEditRow(item)}>
              <Text style={styles.updateBtnText}>Güncelle</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with logout */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <TextInput
          style={styles.filterInput}
          placeholder="İsim Soyisim"
          placeholderTextColor="#999"
          value={isimFilter}
          onChangeText={setIsimFilter}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Telefon"
          placeholderTextColor="#999"
          value={telFilter}
          onChangeText={setTelFilter}
          maxLength={12}
        />
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setShowSort(!showSort)}
        >
          <Text style={styles.sortBtnText}>Sırala</Text>
        </TouchableOpacity>
      </View>

      {/* Sort options */}
      {showSort && (
        <View style={styles.sortPopup}>
          {sortOptions.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.sortOption, sortBy === opt.value && styles.sortOptionActive]}
              onPress={() => {
                setSortBy(opt.value);
                setShowSort(false);
              }}
            >
              <Text style={[styles.sortOptionText, sortBy === opt.value && styles.sortOptionTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* List */}
      <FlatList
        data={filteredRows}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Edit Modal */}
      <Modal
        visible={!!editRow}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditRow(null)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{editRow?.isim} - Bilgi Güncelle</Text>

              <Text style={styles.label}>İsim Soyisim:</Text>
              <TextInput
                style={styles.modalInput}
                value={editRow?.isim || ''}
                onChangeText={v => handleInput('isim', v)}
              />

              <Text style={styles.label}>Telefon:</Text>
              <TextInput
                style={styles.modalInput}
                value={editRow?.tel || ''}
                onChangeText={v => handleInput('tel', v)}
              />

              <Text style={styles.label}>Tip:</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity
                  style={[styles.pickerBtn, editRow?.tur === 'Teşkilat' && styles.pickerBtnActive]}
                  onPress={() => handleInput('tur', 'Teşkilat')}
                >
                  <Text style={styles.pickerBtnText}>Teşkilat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pickerBtn, editRow?.tur === 'Sempatizan' && styles.pickerBtnActive]}
                  onPress={() => handleInput('tur', 'Sempatizan')}
                >
                  <Text style={styles.pickerBtnText}>Sempatizan</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Son Görüşme:</Text>
              <TextInput
                style={styles.modalInput}
                value={editRow?.sonGorusme || ''}
                onChangeText={v => handleInput('sonGorusme', v)}
                placeholder="YYYY-MM-DD"
              />

              <Text style={styles.label}>İl:</Text>
              <TextInput
                style={styles.modalInput}
                value={editRow?.il || ''}
                onChangeText={v => handleInput('il', v)}
              />

              <Text style={styles.label}>İlçe:</Text>
              <TextInput
                style={styles.modalInput}
                value={editRow?.ilce || ''}
                onChangeText={v => handleInput('ilce', v)}
              />

              <Text style={styles.label}>Not:</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextarea]}
                value={editRow?.not || ''}
                onChangeText={v => handleInput('not', v)}
                multiline
                numberOfLines={4}
              />

              <View style={styles.modalBtns}>
                <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSave}>
                  <Text style={styles.modalSaveBtnText}>Kaydet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setEditRow(null)}>
                  <Text style={styles.modalCancelBtnText}>Vazgeç</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#c8102e',
    padding: 15,
    alignItems: 'flex-end',
  },
  logoutBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#c8102e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  filters: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
  },
  sortBtn: {
    backgroundColor: '#c8102e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sortBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sortPopup: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sortOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortOptionActive: {
    backgroundColor: '#fff0f3',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#333',
  },
  sortOptionTextActive: {
    color: '#c8102e',
    fontWeight: 'bold',
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    padding: 15,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusBtn: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c8102e',
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  rowInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  badgeT: {
    backgroundColor: '#c8102e',
  },
  badgeS: {
    backgroundColor: '#4a90e2',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  detail: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  updateBtn: {
    backgroundColor: '#c8102e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  updateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  modalTextarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  pickerBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  pickerBtnActive: {
    backgroundColor: '#c8102e',
    borderColor: '#c8102e',
  },
  pickerBtnText: {
    fontSize: 14,
    color: '#333',
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: '#c8102e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSaveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
