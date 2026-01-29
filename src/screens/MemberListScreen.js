import React, { useState, useMemo, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';

const sortOptions = [
  { value: '', label: 'Varsayılan' },
  { value: 'sonGorusme_az', label: 'Son Görüşme: En Eski' },
  { value: 'sonGorusme_art', label: 'Son Görüşme: En Yeni' },
  { value: 'isim_a', label: 'Alfabetik (A-Z)' },
  { value: 'isim_z', label: 'Alfabetik (Z-A)' },
];

import apiClient from '../api/config';

export default function MemberListScreen({ navigation }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    let mounted = true;
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/api/Members/GetList', { params: { PageIndex: 1, PageSize: 1000 } });
        const data = res?.data;
        // Paginated response: { items: [...] }
        const items = data?.items || data || [];
        const mapped = (items || []).map((it, idx) => ({
          id: it.id || String(idx + 1),
          isim: it.fullName || ((it.firstName || '') + ' ' + (it.lastName || '')).trim(),
          tel: it.phoneNumber || '',
          tur: it.path ? 'Teşkilat' : 'Sempatizan',
          sonGorusme: it.birthDate ? String(it.birthDate).split('T')[0] : '',
          il: it.address || '',
          ilce: '',
          not: '',
          // keep original for detail navigation
          __raw: it,
        }));
        if (mounted) setRows(mapped);
      } catch (err) {
        const msg = err?.message || 'Üyeler alınamadı';
        Alert.alert('Hata', msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMembers();
    return () => { mounted = false; };
  }, []);

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeaderLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.isim.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.memberName}>{item.isim}</Text>
              <Text style={styles.memberPhone}>{item.tel}</Text>
              <View style={[styles.badge, item.tur === 'Teşkilat' ? styles.badgeOrg : styles.badgeSup]}>
                <Text style={styles.badgeText}>{item.tur}</Text>
              </View>
            </View>
          </View>
          <View style={styles.expandIcon}>
            <Text style={styles.expandIconText}>{isExpanded ? '−' : '+'}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.cardBody}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Son Görüşme:</Text>
              <Text style={styles.detailValue}>{item.sonGorusme}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>İl / İlçe:</Text>
              <Text style={styles.detailValue}>{item.il} / {item.ilce}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Not:</Text>
              <Text style={styles.detailValue}>{item.not || 'Yok'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setEditRow(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>✏️ Düzenle</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search & Filter Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="İsim Soyisim"
            placeholderTextColor="#94a3b8"
            value={isimFilter}
            onChangeText={setIsimFilter}
          />
        </View>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>📱</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Telefon"
            placeholderTextColor="#94a3b8"
            value={telFilter}
            onChangeText={setTelFilter}
            keyboardType="phone-pad"
            maxLength={12}
          />
        </View>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSort(!showSort)}
          activeOpacity={0.8}
        >
          <Text style={styles.sortButtonText}>⚡ Sırala</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown */}
      {showSort && (
        <View style={styles.sortDropdown}>
          {sortOptions.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.sortOption, sortBy === opt.value && styles.sortOptionActive]}
              onPress={() => {
                setSortBy(opt.value);
                setShowSort(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.sortOptionText, sortBy === opt.value && styles.sortOptionTextActive]}>
                {opt.label}
              </Text>
              {sortBy === opt.value && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          {filteredRows.length} üye bulundu
        </Text>
      </View>

      {/* Member List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#c8102e" />
        </View>
      ) : (
        <FlatList
          data={filteredRows}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Edit Modal */}
      <Modal
        visible={!!editRow}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditRow(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Üye Bilgilerini Düzenle</Text>
              <TouchableOpacity onPress={() => setEditRow(null)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>İsim Soyisim</Text>
                <TextInput
                  style={styles.formInput}
                  value={editRow?.isim || ''}
                  onChangeText={v => handleInput('isim', v)}
                  placeholder="İsim Soyisim"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Telefon</Text>
                <TextInput
                  style={styles.formInput}
                  value={editRow?.tel || ''}
                  onChangeText={v => handleInput('tel', v)}
                  placeholder="05XX XXX XXXX"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tip</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[styles.radioButton, editRow?.tur === 'Teşkilat' && styles.radioButtonActive]}
                    onPress={() => handleInput('tur', 'Teşkilat')}
                  >
                    <Text style={[styles.radioButtonText, editRow?.tur === 'Teşkilat' && styles.radioButtonTextActive]}>
                      Teşkilat
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.radioButton, editRow?.tur === 'Sempatizan' && styles.radioButtonActive]}
                    onPress={() => handleInput('tur', 'Sempatizan')}
                  >
                    <Text style={[styles.radioButtonText, editRow?.tur === 'Sempatizan' && styles.radioButtonTextActive]}>
                      Sempatizan
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Son Görüşme</Text>
                <TextInput
                  style={styles.formInput}
                  value={editRow?.sonGorusme || ''}
                  onChangeText={v => handleInput('sonGorusme', v)}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>İl</Text>
                <TextInput
                  style={styles.formInput}
                  value={editRow?.il || ''}
                  onChangeText={v => handleInput('il', v)}
                  placeholder="İl"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>İlçe</Text>
                <TextInput
                  style={styles.formInput}
                  value={editRow?.ilce || ''}
                  onChangeText={v => handleInput('ilce', v)}
                  placeholder="İlçe"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Not</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  value={editRow?.not || ''}
                  onChangeText={v => handleInput('not', v)}
                  placeholder="Not ekleyin..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>💾 Kaydet</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setEditRow(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
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
    backgroundColor: '#f8fafc',
  },
  
  // Search Section
  searchSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  sortButton: {
    backgroundColor: '#c8102e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#c8102e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  
  // Sort Dropdown
  sortDropdown: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sortOptionActive: {
    backgroundColor: '#fef2f2',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: '#c8102e',
    fontWeight: '700',
  },
  checkmark: {
    color: '#c8102e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Results Bar
  resultsBar: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  resultsText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  
  // List
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#c8102e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  memberPhone: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeOrg: {
    backgroundColor: '#c8102e',
  },
  badgeSup: {
    backgroundColor: '#3b82f6',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  expandIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c8102e',
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    padding: 16,
    backgroundColor: '#fafafa',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    width: 120,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#c8102e',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#c8102e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalClose: {
    fontSize: 24,
    color: '#64748b',
    fontWeight: '300',
  },
  modalBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  formTextarea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  radioButtonActive: {
    borderColor: '#c8102e',
    backgroundColor: '#fef2f2',
  },
  radioButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  radioButtonTextActive: {
    color: '#c8102e',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#c8102e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#c8102e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
});
