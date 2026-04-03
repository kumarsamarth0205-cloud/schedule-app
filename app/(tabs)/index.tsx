import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Alert
} from 'react-native';
import AdminDashboard from './college/admin/dashboard';
import FacultyDashboard from './college/faculty/dashboard';
import HodDashboard from './college/hod/dashboard';
import StudentDashboard from './college/student/dashboard';
import SchoolAdminDashboard from './school/admin/dashboard';
import PrincipalDashboard from './school/principal/dashboard';
import TeacherDashboard from './school/teacher/dashboard';
import SchoolStudentDashboard from './school/student/dashboard';
import ParentDashboard from './school/parent/dashboard';

const roles = [
  { id: 'admin', label: 'Admin', icon: '👑' },
  { id: 'hod', label: 'HOD', icon: '👨‍🏫' },
  { id: 'faculty', label: 'Faculty', icon: '👩‍🏫' },
  { id: 'student', label: 'Student', icon: '🎓' },
  { id: 'principal', label: 'Principal', icon: '🏫' },
  { id: 'teacher', label: 'Teacher', icon: '📚' },
  { id: 'parent', label: 'Parent', icon: '👨‍👩‍👧' },
];

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loggedIn, setLoggedIn] = useState(false);
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
        body: JSON.stringify({ email, password, role, section: 'college' })
      });
      const data = await response.json();
      if (data.success) {
        setLoggedIn(true);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Cannot connect to server!');
    }
    setLoading(false);
  };

  if (loggedIn && role === 'admin') return <AdminDashboard onLogout={() => { setLoggedIn(false); setEmail(''); setPassword(''); }} />;
  if (loggedIn && role === 'hod') return <HodDashboard onLogout={() => { setLoggedIn(false); setEmail(''); setPassword(''); }} />;
  if (loggedIn && role === 'faculty') return <FacultyDashboard onLogout={() => { setLoggedIn(false); setEmail(''); setPassword(''); }} />;
  if (loggedIn && role === 'student') return <StudentDashboard onLogout={() => { setLoggedIn(false); setEmail(''); setPassword(''); }} />;
  if (loggedIn && role === 'principal') return <PrincipalDashboard onLogout={() => { setLoggedIn(false); setEmail(''); setPassword(''); }} />;
  if (loggedIn && role === 'teacher') return <TeacherDashboard onLogout={() => { setLoggedIn(false); setEmail(''); setPassword(''); }} />;
  if (loggedIn && role === 'parent') return <ParentDashboard onLogout={() => { setLoggedIn(false); setEmail(''); setPassword(''); }} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.appName}>Schedule</Text>
        <Text style={styles.tagline}>SMART ACADEMIC PLANNER</Text>
      </View>

      <Text style={styles.label}>Select Role</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.roleScroll}
      >
        {roles.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[styles.roleBtn, role === r.id && styles.roleBtnActive]}
            onPress={() => setRole(r.id)}
          >
            <Text style={styles.roleIcon}>{r.icon}</Text>
            <Text style={[styles.roleText, role === r.id && styles.roleTextActive]}>
              {r.label}
            </Text>
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
          {loading ? 'Logging in...' : `Login as ${role.toUpperCase()}`}
        </Text>
      </TouchableOpacity>

      <Text style={styles.forgot}>Forgot Password? Contact Admin</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0eeff',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  top: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  appName: {
    fontSize: 48,
    fontWeight: '800',
    color: '#26215C',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 11,
    color: '#7F77DD',
    letterSpacing: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#534AB7',
    marginBottom: 8,
  },
  roleScroll: {
    flexGrow: 0,
    marginBottom: 20,
  },
  roleBtn: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#DDD8FF',
    minWidth: 72,
  },
  roleBtnActive: {
    backgroundColor: '#534AB7',
    borderColor: '#534AB7',
  },
  roleIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#26215C',
  },
  roleTextActive: {
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD8FF',
    color: '#26215C',
  },
  loginBtn: {
    backgroundColor: '#534AB7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  loginBtnDisabled: {
    backgroundColor: '#AFA9EC',
  },
  loginText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  forgot: {
    color: '#7F77DD',
    marginTop: 16,
    fontSize: 12,
    textAlign: 'center',
  },
});