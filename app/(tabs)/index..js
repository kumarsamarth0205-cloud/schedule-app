import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Alert
} from 'react-native';
import AdminDashboard from './college/admin/dashboard';
import FacultyScreen from './college/faculty';
import HodScreen from './college/hod';
import CollegeStudentScreen from './college/student';
import SchoolAdminScreen from './school/admin';
import PrincipalScreen from './school/principal';
import TeacherScreen from './school/teacher';
import SchoolStudentScreen from './school/student';
import ParentScreen from './school/parent';

const roles = [
  { id: 'college_admin', label: 'College Admin', icon: '👑' },
  { id: 'hod', label: 'HOD', icon: '👨‍🏫' },
  { id: 'faculty', label: 'Faculty', icon: '👩‍🏫' },
  { id: 'college_student', label: 'Student', icon: '🎓' },
  { id: 'school_admin', label: 'School Admin', icon: '🏫' },
  { id: 'principal', label: 'Principal', icon: '🎖' },
  { id: 'teacher', label: 'Teacher', icon: '📚' },
  { id: 'school_student', label: 'Sch. Student', icon: '📖' },
  { id: 'parent', label: 'Parent', icon: '👨‍👩‍👧' },
];

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('college_student');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://YOUR_NGROK_URL/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Cannot connect to server! Ask Person 2 to start backend.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
  };

  if (user?.role === 'college_admin') return <AdminDashboard user={user} onLogout={handleLogout} />;
  if (user?.role === 'faculty') return <FacultyScreen user={user} onLogout={handleLogout} />;
  if (user?.role === 'hod') return <HodScreen user={user} onLogout={handleLogout} />;
  if (user?.role === 'college_student') return <CollegeStudentScreen user={user} onLogout={handleLogout} />;
  if (user?.role === 'school_admin') return <SchoolAdminScreen user={user} onLogout={handleLogout} />;
  if (user?.role === 'principal') return <PrincipalScreen user={user} onLogout={handleLogout} />;
  if (user?.role === 'teacher') return <TeacherScreen user={user} onLogout={handleLogout} />;
  if (user?.role === 'school_student') return <SchoolStudentScreen user={user} onLogout={handleLogout} />;
  if (user?.role === 'parent') return <ParentScreen user={user} onLogout={handleLogout} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.appName}>Schedule</Text>
        <Text style={styles.tagline}>SMART ACADEMIC PLANNER</Text>
      </View>

      <Text style={styles.label}>Select Your Role</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleScroll}>
        {roles.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[styles.roleBtn, role === r.id && styles.roleBtnActive]}
            onPress={() => setRole(r.id)}
          >
            <Text style={styles.roleIcon}>{r.icon}</Text>
            <Text style={[styles.roleText, role === r.id && styles.roleTextActive]}>{r.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.forgot}>Forgot Password? Contact Admin</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0eeff', paddingHorizontal: 24, paddingTop: 20 },
  top: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  appName: { fontSize: 48, fontWeight: '800', color: '#26215C', marginBottom: 6 },
  tagline: { fontSize: 11, color: '#7F77DD', letterSpacing: 3 },
  label: { fontSize: 13, fontWeight: '600', color: '#534AB7', marginBottom: 8 },
  roleScroll: { flexGrow: 0, marginBottom: 20 },
  roleBtn: { alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, padding: 12, marginRight: 10, borderWidth: 2, borderColor: '#DDD8FF', minWidth: 75 },
  roleBtnActive: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  roleIcon: { fontSize: 22, marginBottom: 4 },
  roleText: { fontSize: 11, fontWeight: '700', color: '#26215C' },
  roleTextActive: { color: '#ffffff' },
  input: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: '#DDD8FF', color: '#26215C' },
  loginBtn: { backgroundColor: '#534AB7', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 },
  loginBtnDisabled: { backgroundColor: '#AFA9EC' },
  loginText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  forgot: { color: '#7F77DD', marginTop: 16, fontSize: 12, textAlign: 'center' },
});