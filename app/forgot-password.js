import { useState } from 'react';
import {
  SafeAreaView, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity,
  View, Alert, KeyboardAvoidingView, Platform
} from 'react-native';

// ─────────────────────────────────────────
// STEPS:
// Step 1 — Enter Email
// Step 2 — Enter OTP (sent to email)
// Step 3 — Enter New Password
// Step 4 — Success
// ─────────────────────────────────────────

export default function ForgotPasswordScreen({ onBack, ngrokUrl }) {
  const [step, setStep]                   = useState(1);
  const [mode, setMode]                   = useState('password'); // 'password' | 'email'

  // Step 1
  const [email, setEmail]                 = useState('');
  // Forgot Email mode
  const [fullName, setFullName]           = useState('');
  const [employeeId, setEmployeeId]       = useState('');
  const [foundEmail, setFoundEmail]       = useState('');

  // Step 2
  const [otp, setOtp]                     = useState('');
  const [otpToken, setOtpToken]           = useState(''); // backend returns this after sending OTP

  // Step 3
  const [newPassword, setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading]             = useState(false);

  // ─────────────────────────────────────────
  // STEP 1 — Send OTP to Email
  // ─────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${ngrokUrl}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        setOtpToken(data.token); // save token returned by backend
        Alert.alert('OTP Sent!', `Check your email: ${email}`);
        setStep(2);
      } else {
        Alert.alert('Error', data.message || 'Email not found!');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Cannot connect to server!\nAsk Person 2 to start backend.');
    }
    setLoading(false);
  };

  // ─────────────────────────────────────────
  // STEP 2 — Verify OTP
  // ─────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Error', 'Please enter the OTP sent to your email!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${ngrokUrl}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, token: otpToken })
      });
      const data = await response.json();
      if (data.success) {
        setStep(3);
      } else {
        Alert.alert('Error', data.message || 'Invalid or expired OTP!');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Cannot connect to server!\nAsk Person 2 to start backend.');
    }
    setLoading(false);
  };

  // ─────────────────────────────────────────
  // STEP 3 — Set New Password
  // ─────────────────────────────────────────
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill both fields!');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${ngrokUrl}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, token: otpToken })
      });
      const data = await response.json();
      if (data.success) {
        setStep(4);
      } else {
        Alert.alert('Error', data.message || 'Could not reset password!');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Cannot connect to server!\nAsk Person 2 to start backend.');
    }
    setLoading(false);
  };

  // ─────────────────────────────────────────
  // FORGOT EMAIL — Find masked email by Name + ID
  // ─────────────────────────────────────────
  const handleForgotEmail = async () => {
    if (!fullName || !employeeId) {
      Alert.alert('Error', 'Please enter your Full Name and ID!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${ngrokUrl}/api/forgot-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, employeeId })
      });
      const data = await response.json();
      if (data.success) {
        setFoundEmail(data.maskedEmail); // e.g. sa***@gmail.com
      } else {
        Alert.alert('Not Found', data.message || 'No account found with this name and ID!');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Cannot connect to server!\nAsk Person 2 to start backend.');
    }
    setLoading(false);
  };

  // ─────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────

  const renderStepDots = () => (
    <View style={styles.dotsRow}>
      {[1, 2, 3].map(s => (
        <View key={s} style={[styles.dot, step >= s && styles.dotActive]} />
      ))}
    </View>
  );

  // ─────────────────────────────────────────
  // STEP 4 — Success Screen
  // ─────────────────────────────────────────
  if (step === 4) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Password Reset!</Text>
          <Text style={styles.successSub}>Your password has been updated successfully.</Text>
          <TouchableOpacity style={styles.mainBtn} onPress={onBack}>
            <Text style={styles.mainBtnText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────
  // FORGOT EMAIL SCREEN
  // ─────────────────────────────────────────
  if (mode === 'email') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            <TouchableOpacity onPress={() => setMode('password')} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.top}>
              <Text style={styles.icon}>📧</Text>
              <Text style={styles.title}>Forgot Email</Text>
              <Text style={styles.subtitle}>Enter your name and ID to find your registered email</Text>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Student / Employee ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your ID"
              placeholderTextColor="#999"
              value={employeeId}
              onChangeText={setEmployeeId}
              autoCapitalize="none"
            />

            {/* Show masked email result */}
            {foundEmail ? (
              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>Your registered email is:</Text>
                <Text style={styles.resultEmail}>{foundEmail}</Text>
                <TouchableOpacity
                  style={styles.mainBtn}
                  onPress={() => {
                    setMode('password');
                    setEmail('');
                  }}
                >
                  <Text style={styles.mainBtnText}>Go to Forgot Password</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.mainBtn, loading && styles.mainBtnDisabled]}
                onPress={handleForgotEmail}
                disabled={loading}
              >
                <Text style={styles.mainBtnText}>
                  {loading ? 'Searching...' : 'Find My Email'}
                </Text>
              </TouchableOpacity>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────
  // MAIN FORGOT PASSWORD SCREEN (Steps 1-3)
  // ─────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Back Button */}
          <TouchableOpacity
            onPress={step === 1 ? onBack : () => setStep(step - 1)}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.top}>
            <Text style={styles.icon}>🔑</Text>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              {step === 1 && 'Enter your registered email to receive an OTP'}
              {step === 2 && 'Enter the OTP sent to your email'}
              {step === 3 && 'Set your new password'}
            </Text>
          </View>

          {/* Step Dots */}
          {renderStepDots()}

          {/* ── STEP 1 — Email Input ── */}
          {step === 1 && (
            <>
              <Text style={styles.label}>Registered Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={[styles.mainBtn, loading && styles.mainBtnDisabled]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                <Text style={styles.mainBtnText}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Text>
              </TouchableOpacity>

              {/* Forgot Email Link */}
              <TouchableOpacity onPress={() => setMode('email')} style={styles.switchBtn}>
                <Text style={styles.switchText}>Forgot your email too? Click here</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── STEP 2 — OTP Input ── */}
          {step === 2 && (
            <>
              <View style={styles.otpInfoBox}>
                <Text style={styles.otpInfoText}>
                  OTP sent to: <Text style={{ fontWeight: '700' }}>{email}</Text>
                </Text>
                <Text style={styles.otpInfoText}>Valid for 10 minutes only.</Text>
              </View>

              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="Enter OTP"
                placeholderTextColor="#999"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />

              <TouchableOpacity
                style={[styles.mainBtn, loading && styles.mainBtnDisabled]}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                <Text style={styles.mainBtnText}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Text>
              </TouchableOpacity>

              {/* Resend OTP */}
              <TouchableOpacity onPress={handleSendOtp} style={styles.switchBtn}>
                <Text style={styles.switchText}>Didn't receive OTP? Resend</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── STEP 3 — New Password ── */}
          {step === 3 && (
            <>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />

              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter new password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.mainBtn, loading && styles.mainBtnDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={styles.mainBtnText}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Text>
              </TouchableOpacity>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#f0eeff', paddingHorizontal: 24, paddingTop: 20 },
  backBtn:          { marginTop: 10, marginBottom: 10 },
  backText:         { color: '#534AB7', fontSize: 15, fontWeight: '600' },
  top:              { alignItems: 'center', marginBottom: 24 },
  icon:             { fontSize: 48, marginBottom: 10 },
  title:            { fontSize: 26, fontWeight: '800', color: '#26215C', marginBottom: 6 },
  subtitle:         { fontSize: 13, color: '#7F77DD', textAlign: 'center', lineHeight: 20 },
  dotsRow:          { flexDirection: 'row', justifyContent: 'center', marginBottom: 28, gap: 8 },
  dot:              { width: 10, height: 10, borderRadius: 5, backgroundColor: '#DDD8FF' },
  dotActive:        { backgroundColor: '#534AB7' },
  label:            { fontSize: 13, fontWeight: '600', color: '#534AB7', marginBottom: 8 },
  input:            { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: '#DDD8FF', color: '#26215C' },
  otpInput:         { fontSize: 24, fontWeight: '800', textAlign: 'center', letterSpacing: 8 },
  otpInfoBox:       { backgroundColor: '#EAE8FF', borderRadius: 12, padding: 14, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#534AB7' },
  otpInfoText:      { color: '#26215C', fontSize: 13, lineHeight: 20 },
  mainBtn:          { backgroundColor: '#534AB7', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 },
  mainBtnDisabled:  { backgroundColor: '#AFA9EC' },
  mainBtnText:      { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  switchBtn:        { alignItems: 'center', marginTop: 16 },
  switchText:       { color: '#7F77DD', fontSize: 13, fontWeight: '600' },
  successBox:       { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  successIcon:      { fontSize: 64, marginBottom: 20 },
  successTitle:     { fontSize: 28, fontWeight: '800', color: '#26215C', marginBottom: 10 },
  successSub:       { fontSize: 14, color: '#7F77DD', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  resultBox:        { backgroundColor: '#EAE8FF', borderRadius: 12, padding: 20, alignItems: 'center', marginTop: 10 },
  resultLabel:      { fontSize: 13, color: '#534AB7', marginBottom: 8 },
  resultEmail:      { fontSize: 20, fontWeight: '800', color: '#26215C', marginBottom: 20 },
});
