import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView
} from 'react-native';
import UploadDataset from './upload';
import ViewTimetable from './viewTimetable';
import ExamSchedule from './examSchedule';

export default function AdminDashboard({ onLogout }) {
  const [screen, setScreen] = useState(null);

  if (screen === 'upload') return <UploadDataset onBack={() => setScreen(null)} />;
  if (screen === 'timetable') return <ViewTimetable onBack={() => setScreen(null)} />;
  if (screen === 'exam') return <ExamSchedule onBack={() => setScreen(null)} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.header}>Admin Panel</Text>
          <Text style={styles.sub}>Full Control</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>Timetable Management</Text>

        <TouchableOpacity style={styles.card} onPress={() => setScreen('upload')}>
          <Text style={styles.cardIcon}>📤</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Upload Dataset</Text>
            <Text style={styles.cardDesc}>Upload CSV, Excel, PDF, DOCX or Image to generate timetable</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setScreen('timetable')}>
          <Text style={styles.cardIcon}>📅</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>View Timetable</Text>
            <Text style={styles.cardDesc}>See all generated timetables — Student, Faculty, Admin view</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setScreen('exam')}>
          <Text style={styles.cardIcon}>📝</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Exam Schedule</Text>
            <Text style={styles.cardDesc}>Generate and manage exam timetable</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Smart Features</Text>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>🔮</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>What-If Simulator</Text>
            <Text style={styles.cardDesc}>Simulate any change before applying</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>📊</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Smart Analytics</Text>
            <Text style={styles.cardDesc}>Room usage, electricity savings report</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>👁</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Auto Invigilation</Text>
            <Text style={styles.cardDesc}>Fair exam duty rotation for all faculty</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>👨‍👩‍👧</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>PTM Optimizer</Text>
            <Text style={styles.cardDesc}>No-wait parent teacher meeting schedule</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>🌿</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Green Campus</Text>
            <Text style={styles.cardDesc}>Cluster classes to save electricity</Text>
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
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#AFA9EC', letterSpacing: 1, marginBottom: 10, marginTop: 10 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#DDD8FF' },
  cardIcon: { fontSize: 28, marginRight: 14 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#26215C', marginBottom: 3 },
  cardDesc: { fontSize: 12, color: '#7F77DD', lineHeight: 17 },
  arrow: { fontSize: 20, color: '#534AB7' },
});