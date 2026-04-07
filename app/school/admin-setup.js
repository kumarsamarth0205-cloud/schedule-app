import { useState } from 'react';
import {
  SafeAreaView, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity,
  View, Alert, KeyboardAvoidingView, Platform
} from 'react-native';

// ─────────────────────────────────────────
// School Admin fills institution details
// after registering for the first time.
// Only after this can they generate timetable.
// ─────────────────────────────────────────

const boardOptions = [
  'CBSE', 'ICSE', 'UP Board', 'MP Board',
  'Maharashtra Board', 'RBSE', 'Other'
];

const classOptions = [
  'Nursery to 5',
  'Nursery to 8',
  'Nursery to 10',
  'Nursery to 12',
  '1 to 5',
  '1 to 8',
  '1 to 10',
  '1 to 12',
  '6 to 10',
  '6 to 12',
];

export default function SchoolSetupScreen({ user, onSetupComplete, onLogout }) {
  const [step, setStep] = useState(1); // Step 1 = School Info, Step 2 = Class Info

  // Step 1 — School Details
  const [schoolName, setSchoolName]       = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [city, setCity]                   = useState('');
  const [state, setState]                 = useState('');
  const [schoolCode, setSchoolCode]       = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [customBoard, setCustomBoard]     = useState('');

  // Step 2 — Class Details
  const [selectedClasses, setSelectedClasses] = useState('');
  const [sectionsPerClass, setSectionsPerClass] = useState('');
  const [totalTeachers, setTotalTeachers]   = useState('');
  const [totalStudents, setTotalStudents]   = useState('');
  const [classStartTime, setClassStartTime] = useState('8:00 AM');
  const [classEndTime, setClassEndTime]     = useState('2:00 PM');
  const [hasMorningShift, setHasMorningShift] = useState(true);
  const [hasEveningShift, setHasEveningShift] = useState(false);

  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────
  // STEP 1 VALIDATION
  // ─────────────────────────────────────────
  const handleStep1Next = () => {
    if (!schoolName || !principalName || !city || !state) {
      Alert.alert('Error', 'Please fill all required fields!');
      return;
    }
    if (!selectedBoard) {
      Alert.alert('Error', 'Please select your school board!');
      return;
    }
    if (selectedBoard === 'Other' && !customBoard) {
      Alert.alert('Error', 'Please enter your board name!');
      return;
    }
    setStep(2);
  };

  // ─────────────────────────────────────────
  // STEP 2 — Submit Setup to Backend
  // ─────────────────────────────────────────
  const handleSubmit = async () => {
    const board = selectedBoard === 'Other' ? customBoard : selectedBoard;

    if (!selectedClasses) {
      Alert.alert('Error', 'Please select class range!');
      return;
    }
    if (!sectionsPerClass || !totalTeachers || !totalStudents) {
      Alert.alert('Error', 'Please fill all class details!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${global.NGROK_URL}/api/school/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: user.email,
          schoolName,
          principalName,
          city,
          state,
          schoolCode,
          board,
          classRange: selectedClasses,
          sectionsPerClass: parseInt(sectionsPerClass),
          totalTeachers: parseInt(totalTeachers),
          totalStudents: parseInt(totalStudents),
          classStartTime,
          classEndTime,
          shifts: {
            morning: hasMorningShift,
            evening: hasEveningShift,
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert(
          'Setup Complete! 🎉',
          `${schoolName} has been set up successfully.\nYou can now generate timetables.`,
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
            <Text style={styles.headerSub}>School Setup</Text>
          </View>

          {/* Welcome Box */}
          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeText}>👋 Welcome, School Admin!</Text>
            <Text style={styles.welcomeSub}>
              Please fill in your school details before you can generate timetables and manage users.
            </Text>
          </View>

          {/* Step Dots */}
          {renderDots()}

          {/* ── STEP 1 — School Information ── */}
          {step === 1 && (
            <>
              <Text style={styles.sectionTitle}>🏫 School Information</Text>

              <Text style={styles.label}>
                School Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Delhi Public School"
                placeholderTextColor="#999"
                value={schoolName}
                onChangeText={setSchoolName}
              />

              <Text style={styles.label}>
                Principal Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Dr. Ramesh Kumar"
                placeholderTextColor="#999"
                value={principalName}
                onChangeText={setPrincipalName}
              />

              <Text style={styles.label}>
                City <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Lucknow"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
              />

              <Text style={styles.label}>
                State <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Uttar Pradesh"
                placeholderTextColor="#999"
                value={state}
                onChangeText={setState}
              />

              <Text style={styles.label}>School Code (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. DPS-LKO-001"
                placeholderTextColor="#999"
                value={schoolCode}
                onChangeText={setSchoolCode}
              />

              {/* Board Selector */}
              <Text style={styles.label}>
                School Board <Text style={styles.required}>*</Text>
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipScroll}
              >
                {boardOptions.map(board => (
                  <TouchableOpacity
                    key={board}
                    style={[styles.chip, selectedBoard === board && styles.chipActive]}
                    onPress={() => setSelectedBoard(board)}
                  >
                    <Text style={[styles.chipText, selectedBoard === board && styles.chipTextActive]}>
                      {board}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Custom Board */}
              {selectedBoard === 'Other' && (
                <>
                  <Text style={styles.label}>
                    Enter Board Name <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Gujarat Board"
                    placeholderTextColor="#999"
                    value={customBoard}
                    onChangeText={setCustomBoard}
                  />
                </>
              )}

              <TouchableOpacity style={styles.mainBtn} onPress={handleStep1Next}>
                <Text style={styles.mainBtnText}>Next → Class Details</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── STEP 2 — Class Information ── */}
          {step === 2 && (
            <>
              <Text style={styles.sectionTitle}>📚 Class Information</Text>

              {/* Class Range */}
              <Text style={styles.label}>
                Classes in School <Text style={styles.required}>*</Text>
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipScroll}
              >
                {classOptions.map(cls => (
                  <TouchableOpacity
                    key={cls}
                    style={[styles.chip, selectedClasses === cls && styles.chipActive]}
                    onPress={() => setSelectedClasses(cls)}
                  >
                    <Text style={[styles.chipText, selectedClasses === cls && styles.chipTextActive]}>
                      {cls}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>
                Sections per Class <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 4  (means A, B, C, D)"
                placeholderTextColor="#999"
                value={sectionsPerClass}
                onChangeText={setSectionsPerClass}
                keyboardType="number-pad"
              />

              <Text style={styles.label}>
                Total Teachers <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 40"
                placeholderTextColor="#999"
                value={totalTeachers}
                onChangeText={setTotalTeachers}
                keyboardType="number-pad"
              />

              <Text style={styles.label}>
                Total Students <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 800"
                placeholderTextColor="#999"
                value={totalStudents}
                onChangeText={setTotalStudents}
                keyboardType="number-pad"
              />

              {/* School Shifts */}
              <Text style={styles.sectionTitle}>🕐 School Shifts</Text>
              <View style={styles.shiftRow}>
                <TouchableOpacity
                  style={[styles.shiftBtn, hasMorningShift && styles.shiftBtnActive]}
                  onPress={() => setHasMorningShift(!hasMorningShift)}
                >
                  <Text style={styles.shiftIcon}>🌅</Text>
                  <Text style={[styles.shiftText, hasMorningShift && styles.shiftTextActive]}>
                    Morning Shift
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.shiftBtn, hasEveningShift && styles.shiftBtnActive]}
                  onPress={() => setHasEveningShift(!hasEveningShift)}
                >
                  <Text style={styles.shiftIcon}>🌆</Text>
                  <Text style={[styles.shiftText, hasEveningShift && styles.shiftTextActive]}>
                    Evening Shift
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Class Timings */}
              <Text style={styles.sectionTitle}>⏰ Class Timings</Text>
              <View style={styles.timeRow}>
                <View style={styles.timeBlock}>
                  <Text style={styles.label}>Start Time</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="8:00 AM"
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
                    placeholder="2:00 PM"
                    placeholderTextColor="#999"
                    value={classEndTime}
                    onChangeText={setClassEndTime}
                  />
                </View>
              </View>

              {/* Summary Preview */}
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>📋 Setup Summary</Text>
                <Text style={styles.summaryLine}>🏫 {schoolName}</Text>
                <Text style={styles.summaryLine}>👤 Principal: {principalName}</Text>
                <Text style={styles.summaryLine}>📍 {city}, {state}</Text>
                <Text style={styles.summaryLine}>
                  📋 {selectedBoard === 'Other' ? customBoard : selectedBoard}
                </Text>
                <Text style={styles.summaryLine}>🎒 Classes: {selectedClasses || '—'}</Text>
                <Text style={styles.summaryLine}>
                  🏢 Shifts: {[hasMorningShift && 'Morning', hasEveningShift && 'Evening'].filter(Boolean).join(' + ') || '—'}
                </Text>
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

          {/* Logout */}
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#f0eeff', paddingHorizontal: 24, paddingTop: 20 },
  header:           { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  appName:          { fontSize: 36, fontWeight: '800', color: '#26215C' },
  headerSub:        { fontSize: 13, color: '#7F77DD', letterSpacing: 2, marginTop: 4 },
  welcomeBox:       { backgroundColor: '#EAE8FF', borderRadius: 14, padding: 16, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#534AB7' },
  welcomeText:      { fontSize: 16, fontWeight: '700', color: '#26215C', marginBottom: 6 },
  welcomeSub:       { fontSize: 13, color: '#534AB7', lineHeight: 20 },
  dotsRow:          { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 28, gap: 12 },
  dot:              { width: 32, height: 32, borderRadius: 16, backgroundColor: '#DDD8FF', justifyContent: 'center', alignItems: 'center' },
  dotActive:        { backgroundColor: '#534AB7' },
  dotText:          { fontSize: 14, fontWeight: '700', color: '#534AB7' },
  dotTextActive:    { color: '#ffffff' },
  sectionTitle:     { fontSize: 16, fontWeight: '700', color: '#26215C', marginBottom: 16, marginTop: 8 },
  label:            { fontSize: 13, fontWeight: '600', color: '#534AB7', marginBottom: 8 },
  required:         { color: '#C00000' },
  input:            { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: '#DDD8FF', color: '#26215C' },
  chipScroll:       { flexGrow: 0, marginBottom: 16 },
  chip:             { backgroundColor: '#ffffff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, borderWidth: 2, borderColor: '#DDD8FF' },
  chipActive:       { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  chipText:         { fontSize: 12, fontWeight: '600', color: '#26215C' },
  chipTextActive:   { color: '#ffffff' },
  shiftRow:         { flexDirection: 'row', gap: 12, marginBottom: 20 },
  shiftBtn:         { flex: 1, backgroundColor: '#ffffff', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 2, borderColor: '#DDD8FF' },
  shiftBtnActive:   { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  shiftIcon:        { fontSize: 24, marginBottom: 6 },
  shiftText:        { fontSize: 12, fontWeight: '700', color: '#26215C' },
  shiftTextActive:  { color: '#ffffff' },
  timeRow:          { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  timeBlock:        { flex: 1 },
  timeSep:          { paddingHorizontal: 10, paddingTop: 8 },
  timeSepText:      { color: '#534AB7', fontWeight: '600' },
  summaryBox:       { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#DDD8FF' },
  summaryTitle:     { fontSize: 14, fontWeight: '700', color: '#26215C', marginBottom: 12 },
  summaryLine:      { fontSize: 13, color: '#534AB7', marginBottom: 6, lineHeight: 20 },
  backBtn:          { alignItems: 'center', marginBottom: 12 },
  backBtnText:      { color: '#534AB7', fontSize: 14, fontWeight: '600' },
  mainBtn:          { backgroundColor: '#534AB7', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  mainBtnDisabled:  { backgroundColor: '#AFA9EC' },
  mainBtnText:      { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  logoutBtn:        { alignItems: 'center', marginTop: 8, marginBottom: 30 },
  logoutText:       { color: '#999', fontSize: 13 },
});