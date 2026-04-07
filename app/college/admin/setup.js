import { useState } from 'react';
import {
  SafeAreaView, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity,
  View, Alert, KeyboardAvoidingView, Platform
} from 'react-native';

// ─────────────────────────────────────────
// College Admin fills institution details
// after registering for the first time.
// Only after this can they generate timetable.
// ─────────────────────────────────────────

const departments = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Data Science & AI',
  'Information Technology',
  'Chemical Engineering',
  'Biotechnology',
  'Other',
];

const semesterOptions = ['2', '4', '6', '8', '10'];

export default function CollegeSetupScreen({ user, onSetupComplete, onLogout }) {
  const [step, setStep] = useState(1); // Step 1 = College Info, Step 2 = Department Info

  // Step 1 — College Details
  const [collegeName, setCollegeName]     = useState('');
  const [university, setUniversity]       = useState('');
  const [city, setCity]                   = useState('');
  const [state, setState]                 = useState('');
  const [affiliationCode, setAffiliationCode] = useState('');

  // Step 2 — Department Details
  const [selectedDept, setSelectedDept]   = useState('');
  const [customDept, setCustomDept]       = useState('');
  const [totalSemesters, setTotalSemesters] = useState('8');
  const [totalSections, setTotalSections] = useState('');
  const [totalFaculty, setTotalFaculty]   = useState('');
  const [totalStudents, setTotalStudents] = useState('');
  const [classStartTime, setClassStartTime] = useState('9:00 AM');
  const [classEndTime, setClassEndTime]   = useState('5:00 PM');

  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────
  // STEP 1 VALIDATION
  // ─────────────────────────────────────────
  const handleStep1Next = () => {
    if (!collegeName || !university || !city || !state) {
      Alert.alert('Error', 'Please fill all required fields!');
      return;
    }
    setStep(2);
  };

  // ─────────────────────────────────────────
  // STEP 2 — Submit Setup to Backend
  // ─────────────────────────────────────────
  const handleSubmit = async () => {
    const dept = selectedDept === 'Other' ? customDept : selectedDept;

    if (!dept) {
      Alert.alert('Error', 'Please select or enter your department!');
      return;
    }
    if (!totalSections || !totalFaculty || !totalStudents) {
      Alert.alert('Error', 'Please fill all department details!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${global.NGROK_URL}/api/college/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: user.email,
          collegeName,
          university,
          city,
          state,
          affiliationCode,
          department: dept,
          totalSemesters,
          totalSections: parseInt(totalSections),
          totalFaculty: parseInt(totalFaculty),
          totalStudents: parseInt(totalStudents),
          classStartTime,
          classEndTime,
        })
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert(
          'Setup Complete! 🎉',
          `${collegeName} has been set up successfully.\nYou can now generate timetables.`,
          [{ text: 'Go to Dashboard', onPress: () => onSetupComplete(data.user) }]
        );
      } else {
        Alert.alert('Error', data.message || 'Setup failed. Try again.');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Cannot connect to server!\nAsk Person 2 to start backend.');
    }
    setLoading(false);
  };

  // ─────────────────────────────────────────
  // RENDER STEP DOTS
  // ─────────────────────────────────────────
  const renderDots = () => (
    <View style={styles.dotsRow}>
      {[1, 2].map(s => (
        <View key={s} style={[styles.dot, step >= s && styles.dotActive]}>
          <Text style={[styles.dotText, step >= s && styles.dotTextActive]}>{s}</Text>
        </View>
      ))}
      <View style={styles.dotLine} />
    </View>
  );

  // ─────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appName}>Schedule</Text>
            <Text style={styles.headerSub}>College Setup</Text>
          </View>

          {/* Welcome Box */}
          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeText}>
              👋 Welcome, Admin!
            </Text>
            <Text style={styles.welcomeSub}>
              Please fill in your college details before you can generate timetables and manage users.
            </Text>
          </View>

          {/* Step Dots */}
          {renderDots()}

          {/* ── STEP 1 — College Information ── */}
          {step === 1 && (
            <>
              <Text style={styles.sectionTitle}>🏛️ College Information</Text>

              <Text style={styles.label}>College Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Shri Ramswaroop Memorial University"
                placeholderTextColor="#999"
                value={collegeName}
                onChangeText={setCollegeName}
              />

              <Text style={styles.label}>University / Board <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. AKTU, Lucknow University"
                placeholderTextColor="#999"
                value={university}
                onChangeText={setUniversity}
              />

              <Text style={styles.label}>City <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Barabanki"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
              />

              <Text style={styles.label}>State <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Uttar Pradesh"
                placeholderTextColor="#999"
                value={state}
                onChangeText={setState}
              />

              <Text style={styles.label}>Affiliation Code (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. SRMU-2024"
                placeholderTextColor="#999"
                value={affiliationCode}
                onChangeText={setAffiliationCode}
              />

              <TouchableOpacity style={styles.mainBtn} onPress={handleStep1Next}>
                <Text style={styles.mainBtnText}>Next → Department Details</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── STEP 2 — Department Information ── */}
          {step === 2 && (
            <>
              <Text style={styles.sectionTitle}>📚 Department Information</Text>

              {/* Department Selector */}
              <Text style={styles.label}>Select Department <Text style={styles.required}>*</Text></Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {departments.map(dept => (
                  <TouchableOpacity
                    key={dept}
                    style={[styles.chip, selectedDept === dept && styles.chipActive]}
                    onPress={() => setSelectedDept(dept)}
                  >
                    <Text style={[styles.chipText, selectedDept === dept && styles.chipTextActive]}>
                      {dept}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Custom department if Other selected */}
              {selectedDept === 'Other' && (
                <>
                  <Text style={styles.label}>Enter Department Name <Text style={styles.required}>*</Text></Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Aerospace Engineering"
                    placeholderTextColor="#999"
                    value={customDept}
                    onChangeText={setCustomDept}
                  />
                </>
              )}

              {/* Total Semesters */}
              <Text style={styles.label}>Total Semesters <Text style={styles.required}>*</Text></Text>
              <View style={styles.semRow}>
                {semesterOptions.map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.semBtn, totalSemesters === s && styles.semBtnActive]}
                    onPress={() => setTotalSemesters(s)}
                  >
                    <Text style={[styles.semText, totalSemesters === s && styles.semTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Numbers */}
              <Text style={styles.label}>Total Sections per Semester <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 3"
                placeholderTextColor="#999"
                value={totalSections}
                onChangeText={setTotalSections}
                keyboardType="number-pad"
              />

              <Text style={styles.label}>Total Faculty Members <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 25"
                placeholderTextColor="#999"
                value={totalFaculty}
                onChangeText={setTotalFaculty}
                keyboardType="number-pad"
              />

              <Text style={styles.label}>Total Students <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 300"
                placeholderTextColor="#999"
                value={totalStudents}
                onChangeText={setTotalStudents}
                keyboardType="number-pad"
              />

              {/* Class Timings */}
              <Text style={styles.sectionTitle}>⏰ Class Timings</Text>

              <View style={styles.timeRow}>
                <View style={styles.timeBlock}>
                  <Text style={styles.label}>Start Time</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="9:00 AM"
                    placeholderTextColor="#999"
                    value={classStartTime}
                    onChangeText={setClassStartTime}
                  />
                </View>
                <View style={styles.timeSep}>
                  <Text style={styles.timeSepText}>to</Text>
                </View>
                <View style={styles.timeBlock}>
                  <Text style={styles.label}>End Time</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="5:00 PM"
                    placeholderTextColor="#999"
                    value={classEndTime}
                    onChangeText={setClassEndTime}
                  />
                </View>
              </View>

              {/* Summary Preview */}
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>📋 Setup Summary</Text>
                <Text style={styles.summaryLine}>🏛️ {collegeName}</Text>
                <Text style={styles.summaryLine}>🎓 {university}</Text>
                <Text style={styles.summaryLine}>📍 {city}, {state}</Text>
                <Text style={styles.summaryLine}>
                  📚 {selectedDept === 'Other' ? customDept : selectedDept || '—'}
                </Text>
                <Text style={styles.summaryLine}>📅 {totalSemesters} Semesters</Text>
                <Text style={styles.summaryLine}>⏰ {classStartTime} — {classEndTime}</Text>
              </View>

              {/* Buttons */}
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setStep(1)}
              >
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mainBtn, loading && styles.mainBtnDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.mainBtnText}>
                  {loading ? 'Saving Setup...' : 'Complete Setup & Go to Dashboard 🚀'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Logout option */}
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#f0eeff', paddingHorizontal: 24, paddingTop: 20 },
  header:          { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  appName:         { fontSize: 36, fontWeight: '800', color: '#26215C' },
  headerSub:       { fontSize: 13, color: '#7F77DD', letterSpacing: 2, marginTop: 4 },
  welcomeBox:      { backgroundColor: '#EAE8FF', borderRadius: 14, padding: 16, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#534AB7' },
  welcomeText:     { fontSize: 16, fontWeight: '700', color: '#26215C', marginBottom: 6 },
  welcomeSub:      { fontSize: 13, color: '#534AB7', lineHeight: 20 },
  dotsRow:         { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 28, gap: 12 },
  dot:             { width: 32, height: 32, borderRadius: 16, backgroundColor: '#DDD8FF', justifyContent: 'center', alignItems: 'center' },
  dotActive:       { backgroundColor: '#534AB7' },
  dotText:         { fontSize: 14, fontWeight: '700', color: '#534AB7' },
  dotTextActive:   { color: '#ffffff' },
  dotLine:         { position: 'absolute', width: 40, height: 2, backgroundColor: '#DDD8FF', zIndex: -1 },
  sectionTitle:    { fontSize: 16, fontWeight: '700', color: '#26215C', marginBottom: 16, marginTop: 8 },
  label:           { fontSize: 13, fontWeight: '600', color: '#534AB7', marginBottom: 8 },
  required:        { color: '#C00000' },
  input:           { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: '#DDD8FF', color: '#26215C' },
  chipScroll:      { flexGrow: 0, marginBottom: 16 },
  chip:            { backgroundColor: '#ffffff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, borderWidth: 2, borderColor: '#DDD8FF' },
  chipActive:      { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  chipText:        { fontSize: 12, fontWeight: '600', color: '#26215C' },
  chipTextActive:  { color: '#ffffff' },
  semRow:          { flexDirection: 'row', gap: 10, marginBottom: 16 },
  semBtn:          { flex: 1, backgroundColor: '#ffffff', borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 2, borderColor: '#DDD8FF' },
  semBtnActive:    { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  semText:         { fontWeight: '700', color: '#26215C', fontSize: 14 },
  semTextActive:   { color: '#ffffff' },
  timeRow:         { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  timeBlock:       { flex: 1 },
  timeSep:         { paddingHorizontal: 10, paddingTop: 8 },
  timeSepText:     { color: '#534AB7', fontWeight: '600' },
  summaryBox:      { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#DDD8FF' },
  summaryTitle:    { fontSize: 14, fontWeight: '700', color: '#26215C', marginBottom: 12 },
  summaryLine:     { fontSize: 13, color: '#534AB7', marginBottom: 6, lineHeight: 20 },
  backBtn:         { alignItems: 'center', marginBottom: 12 },
  backBtnText:     { color: '#534AB7', fontSize: 14, fontWeight: '600' },
  mainBtn:         { backgroundColor: '#534AB7', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  mainBtnDisabled: { backgroundColor: '#AFA9EC' },
  mainBtnText:     { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  logoutBtn:       { alignItems: 'center', marginTop: 8, marginBottom: 30 },
  logoutText:      { color: '#999', fontSize: 13 },
});