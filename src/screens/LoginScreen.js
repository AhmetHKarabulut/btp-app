import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { login } from '../api';

const KeyboardDismissWrapper = ({ children }) => {
  if (Platform.OS === 'web') return children;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
};

const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

function Content({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (email.trim().length < 2 || password.length < 2) {
      showAlert('Hata', 'Lütfen e-posta ve şifre girin');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showAlert('Hata', 'Geçerli bir e-posta girin');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await login({
        email: email.trim(),
        password,
      });

      if (result.success) {
        const user = result.data?.user || {};
        onLogin?.(user.firstName || email.trim());
      } else {
        const msg = result.error || 'Giriş yapılamadı';
        setErrorMessage(msg);
        showAlert('Giriş Hatası', msg);
      }
    } catch (e) {
      showAlert('Bağlantı Hatası', 'Sunucuya ulaşılamıyor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.card}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../public/btp-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.divider} />
          <Text style={styles.loginTitle}>Üye Girişi</Text>
        </View>

        {errorMessage !== '' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Email */}
        <Text style={styles.label}>E-posta</Text>
        <View
          style={[
            styles.inputWrapper,
            focusedInput === 'email' && styles.focused,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="E-posta adresiniz"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        {/* Password */}
        <Text style={styles.label}>Şifre</Text>
        <View
          style={[
            styles.inputWrapper,
            focusedInput === 'password' && styles.focused,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Şifreniz"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
            secureTextEntry
            editable={!isLoading}
            onSubmitEditing={handleSubmit}
          />
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Bağımsız Türkiye Partisi
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default function LoginScreen({ onLogin }) {
  const content = (
    <KeyboardDismissWrapper>
      <Content onLogin={onLogin} />
    </KeyboardDismissWrapper>
  );

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../public/btp-form-bg.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {Platform.OS === 'ios' ? (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            {content}
          </KeyboardAvoidingView>
        ) : (
          content
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    maxWidth: 380,
    width: '100%',
    alignSelf: 'center',
    elevation: 6,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 12,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#c8102e',
    marginBottom: 10,
    borderRadius: 2,
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#475569',
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  focused: {
    borderColor: '#c8102e',
    backgroundColor: '#fff',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  button: {
    backgroundColor: '#c8102e',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#64748b',
  },
});
