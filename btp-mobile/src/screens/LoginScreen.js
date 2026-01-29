import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSubmit = () => {
    if (username.trim().length < 2 || password.length < 2) {
      alert('Lütfen kullanıcı adı ve şifre girin');
      return;
    }
    if (onLogin) onLogin(username);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={require('../../public/btp-form-bg.jpg')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.85 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Main Card */}
            <View style={styles.card}>
              {/* Logo */}
              <View style={styles.logoSection}>
                <Image
                  source={require('../../public/btp-logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <View style={styles.brandSection}>
                  <View style={styles.divider} />
                  <Text style={styles.loginTitle}>Üye Girişi</Text>
                </View>
              </View>

              {/* Form */}
              <View style={styles.formSection}>
                {/* Username */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Kullanıcı Adı</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedInput === 'username' &&
                        styles.inputWrapperFocused,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="Kullanıcı adınızı girin"
                      placeholderTextColor="#94a3b8"
                      value={username}
                      onChangeText={setUsername}
                      onFocus={() => setFocusedInput('username')}
                      onBlur={() => setFocusedInput(null)}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Şifre</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedInput === 'password' &&
                        styles.inputWrapperFocused,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="Şifrenizi girin"
                      placeholderTextColor="#94a3b8"
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                    />
                  </View>
                </View>

                {/* Button */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleSubmit}
                  activeOpacity={0.85}
                >
                  <Text style={styles.loginButtonText}>Giriş Yap</Text>
                  <View style={styles.loginButtonIcon}>
                    <Text style={styles.arrowIcon}>→</Text>
                  </View>
                </TouchableOpacity>

                {/* Forgot */}
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Şifremi Unuttum
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  © {new Date().getFullYear()} Bağımsız Türkiye Partisi
                </Text>
                <Text style={styles.footerSubtext}>
                  Tüm hakları saklıdır
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 24,
    padding: 32,
    elevation: 10,
  },

  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },

  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
  },

  brandSection: {
    alignItems: 'center',
  },

  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#c8102e',
    borderRadius: 2,
    marginBottom: 16,
  },

  loginTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
  },

  formSection: {
    marginTop: 8,
  },

  inputContainer: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
  },

  inputWrapper: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },

  inputWrapperFocused: {
    borderColor: '#c8102e',
    backgroundColor: '#fff',
    elevation: 3,
  },

  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },

  loginButton: {
    backgroundColor: '#c8102e',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    elevation: 6,
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  loginButtonIcon: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrowIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },

  forgotPasswordText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'center',
  },

  footerText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },

  footerSubtext: {
    fontSize: 11,
    color: '#94a3b8',
  },
});
