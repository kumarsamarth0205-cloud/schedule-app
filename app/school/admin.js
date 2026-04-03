import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, ActivityIndicator
} from 'react-native';

const formats = [
  { icon: '📊', label: 'CSV', type: 'csv' },
  { icon: '📗', label: 'Excel', type: 'xlsx' },
  { icon: '📄', label: 'PDF', type: 'pdf' },
  { icon: '📝', label: 'Word', type: 'docx' },
  { icon: '🖼', label: 'Image', type: 'image' },
];

export default function SchoolAdminScreen({ user, onLogout }) {
  const [screen, setScreen] = useState('home');
  const [uploaded, setUploaded] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleUpload = (type) => {
    setUploaded([...uploaded, { type, name: `data_${type}.${type}`, status: '✅ Ready' }]);
    Alert.alert('Uploaded!', `${type.toUpperCase()} file uploaded!`);
  };

  const handleGenerate = () => {
    if (uploaded.length === 0) {
      Alert.alert('Error', 'Please upload a dataset first!');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      Alert.alert('Success!', 'Timetable generated! All users can now see their schedule.');
    }, 3000);
  };

  if (screen === 'upload') {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('home')} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Upload Dataset</Text>
        <Text style={styles.sub}>Upload teacher, subject and class data{'\n'}AI generates timetable automatically</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>SELECT FORMAT</Text>
          <View style={styles.formatGrid}>
            {formats.map((f) => (
              <TouchableOpacity key={f.type} style={styles.formatCard} onPress={() => handleUpload(f.type)}>
                <Text style={styles.formatIcon}>{f.icon}</Text>
                <Text style={styles.formatLabel}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.hint}>
            💡 Your data should include:{'\n'}
            • Teacher names + subjects they teach{'\n'}
            • Class sections (e.g. Class 10-A, 10-B){'\n'}
            • Room/classroom details{'\n'}
            • School timings and periods
          </Text>

          {uploaded.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>UPLOADED FILES</Text>
              <View style={styles.uploadedBox}>
                {uploaded.map((file, i) => (
                  <View key={i} style={styles.fileRow}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    <Text style={styles.fileStatus}>{file.status}</Text>
                  </View>
                ))}
              </View>

              {!generated ? (
                <TouchableOpacity
                  style={[styles.generateBtn, generating && styles.btnDisabled]}
                  onPress={handleGenerate}
                  disabled={generating}
                >
                  {generating ? (
                    <View style={styles.row}>
                      <ActivityIndicator color="#ffffff" />
                      <Text style={styles.generateText}>  Generating Timetable...</Text>
                    </View>
                  ) : (
                    <Text style={styles.generateText}>⚡ Generate Timetable Now</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.successBox}>
                  <Text style={styles.successIcon}>✅</Text>
                  <Text style={styles.successTitle}>Timetable Generated!</Text>
                  <Text style={styles.successDesc}>All teachers, students and parents can now login and see their schedule</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.header}>School Admin</Text>
          <Text style={styles.sub}>Welcome, {user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>STEP 1 — UPLOAD DATA</Text>
        <TouchableOpacity style={[styles.card, styles.cardPrimary]} onPress={() => setScreen('upload')}>
          <Text style={styles.cardIcon}>📤</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitleWhite}>Upload Dataset</Text>
            <Text style={styles.cardDescWhite}>Upload CSV, Excel, PDF, DOCX or Image{'\n'}AI generates timetable automatically</Text>
          </View>
          <Text style={styles.arrowWhite}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>STEP 2 — VIEW & MANAGE</Text>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>📅</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>View Timetable</Text>
            <Text style={styles.cardDesc}>See all generated class timetables</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>📝</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Exam Schedule</Text>
            <Text style={styles.cardDesc}>Generate and manage exam timetable</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>SMART FEATURES</Text>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>🤒</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Sick Leave Reshuffler</Text>
            <Text style={styles.cardDesc}>Auto manage absent teachers</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>👨‍👩‍👧</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>PTM Optimizer</Text>
            <Text style={styles.cardDesc}>No-wait parent teacher meetings</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>👁</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Auto Invigilation</Text>
            <Text style={styles.cardDesc}>Fair exam duty for all teachers</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>📊</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Smart Analytics</Text>
            <Text style={styles.cardDesc}>Classroom usage and reports</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0eeff', paddingHorizontal: 16, paddingTop: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 24, fontWeight: '800', color: '#26215C' },
  sub: { fontSize: 12, color: '#7F77DD', marginTop: 2 },
  logoutBtn: { backgroundColor: '#ffffff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: '#534AB7' },
  logoutText: { color: '#534AB7', fontWeight: '700' },
  backBtn: { marginBottom: 10 },
  backText: { color: '#534AB7', fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#AFA9EC', letterSpacing: 1, marginBottom: 10, marginTop: 14 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#DDD8FF' },
  cardPrimary: { backgroundColor: '#26215C', borderColor: '#26215C' },
  cardIcon: { fontSize: 28, marginRight: 14 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#26215C', marginBottom: 3 },
  cardTitleWhite: { fontSize: 15, fontWeight: '700', color: '#ffffff', marginBottom: 3 },
  cardDesc: { fontSize: 12, color: '#7F77DD', lineHeight: 17 },
  cardDescWhite: { fontSize: 12, color: '#DDD8FF', lineHeight: 17 },
  arrow: { fontSize: 20, color: '#534AB7' },
  arrowWhite: { fontSize: 20, color: '#ffffff' },
  formatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  formatCard: { width: '18%', backgroundColor: '#ffffff', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#DDD8FF' },
  formatIcon: { fontSize: 26, marginBottom: 6 },
  formatLabel: { fontSize: 11, fontWeight: '700', color: '#26215C' },
  hint: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, fontSize: 13, color: '#7F77DD', lineHeight: 22, marginBottom: 20, borderWidth: 1.5, borderColor: '#DDD8FF' },
  uploadedBox: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 16 },
  fileRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0eeff' },
  fileName: { fontSize: 13, color: '#26215C', fontWeight: '600' },
  fileStatus: { fontSize: 13, color: '#639922' },
  generateBtn: { backgroundColor: '#26215C', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20 },
  btnDisabled: { backgroundColor: '#AFA9EC' },
  generateText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center' },
  successBox: { backgroundColor: '#EAF3DE', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1.5, borderColor: '#639922' },
  successIcon: { fontSize: 40, marginBottom: 10 },
  successTitle: { fontSize: 18, fontWeight: '800', color: '#3B6D11', marginBottom: 6 },
  successDesc: { fontSize: 13, color: '#639922', textAlign: 'center', lineHeight: 20 },
});