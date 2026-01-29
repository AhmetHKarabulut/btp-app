import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MemberListScreen from './src/screens/MemberListScreen';
import PersonDetailScreen from './src/screens/PersonDetailScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Navbar Component (inline)
function Navbar({ title, showMenu = true, onLogout }) {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <View style={styles.navbarContent}>
        {showMenu && (
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.toggleDrawer()}
            activeOpacity={0.7}
          >
            <View style={styles.hamburger}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
          </TouchableOpacity>
        )}
        
        <Text style={styles.title}>{title}</Text>
        
        {onLogout && (
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Custom Drawer Content
function CustomDrawerContent({ navigation, onLogout }) {
  const [expandedMenu, setExpandedMenu] = useState(null);

  const MenuItem = ({ icon, title, screen, hasSubmenu, submenuItems }) => {
    const isExpanded = expandedMenu === title;

    return (
      <View>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            if (hasSubmenu) {
              setExpandedMenu(isExpanded ? null : title);
            } else if (screen) {
              navigation.navigate(screen);
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.menuIcon}>{icon}</Text>
          <Text style={styles.menuText}>{title}</Text>
          {hasSubmenu && (
            <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
          )}
        </TouchableOpacity>

        {hasSubmenu && isExpanded && submenuItems && (
          <View style={styles.submenu}>
            {submenuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.submenuItem}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <Text style={styles.submenuIcon}>{item.icon}</Text>
                <Text style={styles.submenuText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.drawerContainer}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.drawerLogo}>
          <Text style={styles.drawerLogoText}>BTP</Text>
        </View>
        <Text style={styles.drawerTitle}>BTP Mobil</Text>
        <Text style={styles.drawerSubtitle}>Üye Yönetim Sistemi</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <MenuItem 
          icon="🏠" 
          title="Ana Sayfa" 
          screen="Dashboard"
        />
        
        <MenuItem 
          icon="📋" 
          title="Listeler" 
          hasSubmenu={true}
          submenuItems={[
            { icon: '👥', title: 'Üye Listesi', screen: 'MemberList' },
          ]}
        />
        
        <MenuItem 
          icon="📊" 
          title="Raporlar" 
        />
        
        <MenuItem 
          icon="⚙️" 
          title="Ayarlar" 
        />
      </View>

      {/* Drawer Footer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity 
          style={styles.logoutButtonDrawer}
          onPress={onLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutIconDrawer}>🚪</Text>
          <Text style={styles.logoutTextDrawer}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Main Drawer Navigator
function MainDrawer({ onLogout, username }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} />}
      screenOptions={{
        drawerStyle: {
          width: 280,
        },
        header: ({ route }) => {
          const titles = {
            Dashboard: 'Ana Sayfa',
            MemberList: 'Üye Listesi',
          };
          return <Navbar title={titles[route.name] || 'BTP Mobil'} onLogout={onLogout} />;
        },
      }}
    >
      <Drawer.Screen name="Dashboard">
        {(props) => <DashboardScreen {...props} username={username} />}
      </Drawer.Screen>
      <Drawer.Screen name="MemberList" component={MemberListScreen} />
    </Drawer.Navigator>
  );
}

// App Navigator
function AppNavigator({ onLogout, username }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main">
        {(props) => <MainDrawer {...props} onLogout={onLogout} username={username} />}
      </Stack.Screen>
      <Stack.Screen 
        name="PersonDetail" 
        component={PersonDetailScreen}
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <Navbar title="Üye Detayı" showMenu={false} onLogout={onLogout} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <AppNavigator onLogout={handleLogout} username={username} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Navbar
  navbar: {
    backgroundColor: '#c8102e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  navbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 48,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburger: {
    width: 24,
    gap: 4,
  },
  hamburgerLine: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 20,
  },
  
  // Drawer Container
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // Drawer Header
  drawerHeader: {
    backgroundColor: '#c8102e',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  drawerLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  drawerLogoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#c8102e',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  drawerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  
  // Menu Container
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 16,
    width: 30,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  expandIcon: {
    fontSize: 12,
    color: '#64748b',
  },
  
  // Submenu
  submenu: {
    backgroundColor: '#f8fafc',
    paddingLeft: 20,
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  submenuIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 26,
  },
  submenuText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#475569',
  },
  
  // Drawer Footer
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  logoutButtonDrawer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  logoutIconDrawer: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutTextDrawer: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
  },
});
