import { useState } from 'react';
import {
  Alert,
  SafeAreaView, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View, KeyboardAvoidingView, Platform
} from 'react-native';

// --- Screen Imports ---
import AdminDashboard from './college/admin/dashboard';
import FacultyScreen from './college/faculty';
import HodScreen from './college/hod';
import CollegeStudentScreen from './college/student';
import SchoolAdminScreen from './school/admin';
import ParentScreen from './school/parent';
import PrincipalScreen from './school/principal';
import SchoolStudentScreen from './school/student';
import TeacherScreen from './school/teacher';

// --- New Screens (you will create these next) ---
import CollegeSetupScreen from './college/admin/setup';
import SchoolSetupScreen from './school/admin-setup';
import ForgotPasswordScreen from './forgot-password';

 const NGROK_URL = 'https://elane-nondeferent-unpertinently.ngrok-free.dev';// Person 2 shares this every session
 

const roles = [
  { id: 'college_admin', label: 'College Admin', icon: '👑', isAdmin: true },
  { id: 'school_admin',  label: 'School Admin',  icon: '🏫', isAdmin: true },
  { id: 'hod',           label: 'HOD',           icon: '👨‍🏫', isAdmin: false },
  { id: 'faculty',       label: 'Faculty',        icon: '👩‍🏫', isAdmin: false },
  { id: 'college_student', label: 'Student',      icon: '🎓', isAdmin: false },
  { id: 'principal',     label: 'Principal',      icon: '🎖',  isAdmin: false },
  { id: 'teacher',       label: 'Teacher',        icon: '📚', isAdmin: false },
  { id: 'school_student', label: 'Sch. Student',  icon: '📖', isAdmin: false },
  { id: 'parent',        label: 'Parent',         icon: '👨‍👩‍👧', isAdmin: false },
];

export default function App() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole]         = useState('college_student');
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [screen, setScreen]     = useState('login'); // 'login' | 'forgot'

  // --- Check if selected role is Admin ---
  const selectedRole = roles.find(r => r.id === role);
  const isAdminRole  = selectedRole?.isAdmin || false;

  // ─────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${NGROK_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        Alert.alert('Login Failed', data.message || 'Wrong email or password.');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Cannot connect to server!\nAsk Person 2 to start backend + ngrok.');
    }
    setLoading(false);
  };

  // ─────────────────────────────────────────
  // SIGN UP (Admin Only)
  // ─────────────────────────────────────────
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields!');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${NGROK_URL}/api/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await response.json();
      if (data.success) {
        // After sign up → go to institution setup screen
        setUser({ ...data.user, needsSetup: true });
      } else {
        Alert.alert('Sign Up Failed', data.message || 'Could not create account.');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Cannot connect to server!\nAsk Person 2 to start backend + ngrok.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setIsSignUp(false);
    setScreen('login');
  };

  // ─────────────────────────────────────────
  // ROUTE TO CORRECT SCREEN AFTER LOGIN
  // ─────────────────────────────────────────

  // Admin just signed up → show institution setup
  if (user?.needsSetup && user?.role === 'college_admin')
    return <CollegeSetupScreen user={user} onSetupComplete={(u) => setUser({ ...u, needsSetup: false })} onLogout={handleLogout} />;

  if (user?.needsSetup && user?.role === 'school_admin')
    return <SchoolSetupScreen user={user} onSetupComplete={(u) => setUser({ ...u, needsSetup: false })} onLogout={handleLogout} />;

  // Normal routing after login
  if (user?.role === 'college_admin')  return <AdminDashboard       user={user} onLogout={handleLogout} />;
  if (user?.role === 'faculty')        return <FacultyScreen         user={user} onLogout={handleLogout} />;
  if (user?.role === 'hod')            return <HodScreen             user={user} onLogout={handleLogout} />;
  if (user?.role === 'college_student')return <CollegeStudentScreen  user={user} onLogout={handleLogout} />;
  if (user?.role === 'school_admin')   return <SchoolAdminScreen     user={user} onLogout={handleLogout} />;
  if (user?.role === 'principal')      return <PrincipalScreen       user={user} onLogout={handleLogout} />;
  if (user?.role === 'teacher')        return <TeacherScreen         user={user} onLogout={handleLogout} />;
  if (user?.role === 'school_student') return <SchoolStudentScreen   user={user} onLogout={handleLogout} />;
  if (user?.role === 'parent')         return <ParentScreen          user={user} onLogout={handleLogout} />;

  // ─────────────────────────────────────────
  // FORGOT PASSWORD SCREEN
  // ─────────────────────────────────────────
  if (screen === 'forgot')
    return <ForgotPasswordScreen onBack={() => setScreen('login')} ngrokUrl={NGROK_URL} />;

  // ─────────────────────────────────────────
  // LOGIN / SIGN UP SCREEN
  // ─────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.top}>
            <Text style={styles.appName}>Schedule</Text>
            <Text style={styles.tagline}>SMART ACADEMIC PLANNER</Text>
          </View>

          {/* Role Selector */}
          <Text style={styles.label}>Select Your Role</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleScroll}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={[styles.roleBtn, role === r.id && styles.roleBtnActive]}
                onPress={() => { setRole(r.id); setIsSignUp(false); }}
              >
                <Text style={styles.roleIcon}>{r.icon}</Text>
                <Text style={[styles.roleText, role === r.id && styles.roleTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Admin Sign Up / Login Toggle */}
          {isAdminRole && (
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, !isSignUp && styles.toggleBtnActive]}
                onPress={() => setIsSignUp(false)}
              >
                <Text style={[styles.toggleText, !isSignUp && styles.toggleTextActive]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, isSignUp && styles.toggleBtnActive]}
                onPress={() => setIsSignUp(true)}
              >
                <Text style={[styles.toggleText, isSignUp && styles.toggleTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Info box for non-admin roles */}
          {!isAdminRole && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                🔒 Your account is created by your Admin.{'\n'}Contact your College or School Admin to get your login details.
              </Text>
            </View>
          )}

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Confirm Password — only for Admin Sign Up */}
          {isAdminRole && isSignUp && (
            <>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </>
          )}

          {/* Main Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={isAdminRole && isSignUp ? handleSignUp : handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              {loading
                ? (isSignUp ? 'Creating Account...' : 'Logging in...')
                : (isAdminRole && isSignUp ? 'Create Admin Account' : 'Login')}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => setScreen('forgot')} style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#f0eeff', paddingHorizontal: 24, paddingTop: 20 },
  top:               { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  appName:           { fontSize: 48, fontWeight: '800', color: '#26215C', marginBottom: 6 },
  tagline:           { fontSize: 11, color: '#7F77DD', letterSpacing: 3 },
  label:             { fontSize: 13, fontWeight: '600', color: '#534AB7', marginBottom: 8 },
  roleScroll:        { flexGrow: 0, marginBottom: 20 },
  roleBtn:           { alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, padding: 12, marginRight: 10, borderWidth: 2, borderColor: '#DDD8FF', minWidth: 75 },
  roleBtnActive:     { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  roleIcon:          { fontSize: 22, marginBottom: 4 },
  roleText:          { fontSize: 11, fontWeight: '700', color: '#26215C' },
  roleTextActive:    { color: '#ffffff' },
  toggleRow:         { flexDirection: 'row', backgroundColor: '#DDD8FF', borderRadius: 12, padding: 4, marginBottom: 20 },
  toggleBtn:         { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  toggleBtnActive:   { backgroundColor: '#534AB7' },
  toggleText:        { fontWeight: '700', color: '#534AB7', fontSize: 14 },
  toggleTextActive:  { color: '#ffffff' },
  infoBox:           { backgroundColor: '#EAE8FF', borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#534AB7' },
  infoText:          { color: '#26215C', fontSize: 13, lineHeight: 20 },
  input:             { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: '#DDD8FF', color: '#26215C' },
  loginBtn:          { backgroundColor: '#534AB7', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 },
  loginBtnDisabled:  { backgroundColor: '#AFA9EC' },
  loginText:         { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  forgotBtn:         { alignItems: 'center', marginTop: 16, marginBottom: 30 },
  forgotText:        { color: '#7F77DD', fontSize: 13, fontWeight: '600' },
});