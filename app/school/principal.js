import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView
} from 'react-native';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timetableGenerated = true;

const fullTimetable = {
  Mon: [
    { time: '8:00 AM', subject: 'Mathematics', room: 'Room 1', teacher: 'Mr. Kumar', class: 'Class 10-A' },
    { time: '9:00 AM', subject: 'Science', room: 'Room 2', teacher: 'Mrs. Priya', class: 'Class 9-B' },
    { time: '10:00 AM', subject: 'English', room: 'Room 3', teacher: 'Ms. Rani', class: 'Class 8-A' },
    { time: '11:00 AM', subject: 'Hindi', room: 'Room 4', teacher: 'Mr. Sharma', class: 'Class 10-B' },
    { time: '2:00 PM', subject: 'Social Science', room: 'Room 1', teacher: 'Mrs. Gupta', class: 'Class 9-A' },
  ],
  Tue: [
    { time: '8:00 AM', subject: 'Science', room: 'Lab 1', teacher: 'Mrs. Priya', class: 'Class 10-A' },
    { time: '10:00 AM', subject: 'Mathematics', room: 'Room 2', teacher: 'Mr. Kumar', class: 'Class 9-A' },
    { time: '12:00 PM', subject: 'English', room: 'Room 3', teacher: 'Ms. Rani', class: 'Class 10-B' },
  ],
  Wed: [
    { time: '8:00 AM', subject: 'Mathematics', room: 'Room 1', teacher: 'Mr. Kumar', class: 'Class 8-A' },
    { time: '9:00 AM', subject: 'Hindi', room: 'Room 4', teacher: 'Mr. Sharma', class: 'Class 9-B' },
    { time: '2:00 PM', subject: 'Science Lab', room: 'Lab 1', teacher: 'Mrs. Priya', class: 'Class 10-A' },
  ],
  Thu: [
    { time: '8:00 AM', subject: 'English', room: 'Room 3', teacher: 'Ms. Rani', class: 'Class 9-A' },
    { time: '10:00 AM', subject: 'Social Science', room: 'Room 2', teacher: 'Mrs. Gupta', class: 'Class 10-B' },
  ],
  Fri: [
    { time: '8:00 AM', subject: 'Mathematics', room: 'Room 1', teacher: 'Mr. Kumar', class: 'Class 10-A' },
    { time: '10:00 AM', subject: 'Science', room: 'Room 2', teacher: 'Mrs. Priya', class: 'Class 8-A' },
    { time: '12:00 PM', subject: 'Hindi', room: 'Room 4', teacher: 'Mr. Sharma', class: 'Class 9-A' },
  ],
  Sat: [
    { time: '8:00 AM', subject: 'Revision', room: 'Room 1', teacher: 'Mr. Kumar', class: 'Class 10-A' },
  ],
};

export default function PrincipalScreen({ user, onLogout }) {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [tab, setTab] = useState('timetable');

  if (!timetableGenerated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.header}>Principal</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.waitBox}>
          <Text style={styles.waitIcon}>⏳</Text>
          <Text style={styles.waitTitle}>Timetable Not Generated Yet</Text>
          <Text style={styles.waitDesc}>Admin needs to upload data and generate the timetable first.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.header}>Principal</Text>
          <Text style={styles.sub}>Welcome, {user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'timetable' && styles.tabActive]} onPress={() => setTab('timetable')}>
          <Text style={[styles.tabText, tab === 'timetable' && styles.tabTextActive]}>📅 Full Timetable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'ptm' && styles.tabActive]} onPress={() => setTab('ptm')}>
          <Text style={[styles.tabText, tab === 'ptm' && styles.tabTextActive]}>👨‍👩‍👧 PTM</Text>
        </TouchableOpacity>
      </View>

      {tab === 'timetable' && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
            {days.map(day => (
              <TouchableOpacity key={day} style={[styles.dayBtn, selectedDay === day && styles.dayBtnActive]} onPress={() => setSelectedDay(day)}>
                <Text style={[styles.dayText, selectedDay === day && styles.dayTextActive]}>{day}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView showsVerticalScrollIndicator={false}>
            {fullTimetable[selectedDay].map((item, i) => (
              <View key={i} style={styles.classCard}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <View style={styles.classInfo}>
                  <Text style={styles.subjectText}>{item.subject}</Text>
                  <Text style={styles.detailText}>🏫 {item.room}</Text>
                  <Text style={styles.detailText}>👨‍🏫 {item.teacher}</Text>
                  <Text style={styles.detailText}>👥 {item.class}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {tab === 'ptm' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.ptmCard}>
            <Text style={styles.ptmTitle}>📅 Next PTM Schedule</Text>
            <Text style={styles.ptmDate}>Saturday, 20 April 2026</Text>
            <Text style={styles.ptmItem}>• 9:00 AM — Class 10-A Parents</Text>
            <Text style={styles.ptmItem}>• 10:00 AM — Class 10-B Parents</Text>
            <Text style={styles.ptmItem}>• 11:00 AM — Class 9-A Parents</Text>
            <Text style={styles.ptmItem}>• 12:00 PM — Class 9-B Parents</Text>
            <Text style={styles.ptmItem}>• 2:00 PM — Class 8-A Parents</Text>
            <Text style={styles.ptmNote}>✅ No waiting — each parent has a fixed slot</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0eeff', paddingHorizontal: 16, paddingTop: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  header: { fontSize: 24, fontWeight: '800', color: '#26215C' },
  sub: { fontSize: 12, color: '#7F77DD', marginTop: 2 },
  logoutBtn: { backgroundColor: '#ffffff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: '#534AB7' },
  logoutText: { color: '#534AB7', fontWeight: '700' },
  waitBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  waitIcon: { fontSize: 60, marginBottom: 20 },
  waitTitle: { fontSize: 20, fontWeight: '800', color: '#26215C', marginBottom: 12, textAlign: 'center' },
  waitDesc: { fontSize: 14, color: '#7F77DD', textAlign: 'center', lineHeight: 22 },
  tabRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  tab: { flex: 1, backgroundColor: '#ffffff', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#DDD8FF' },
  tabActive: { backgroundColor: '#26215C', borderColor: '#26215C' },
  tabText: { color: '#26215C', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#ffffff' },
  dayScroll: { flexGrow: 0, marginBottom: 14 },
  dayBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: '#26215C', marginRight: 10 },
  dayBtnActive: { backgroundColor: '#26215C', borderColor: '#26215C' },
  dayText: { color: '#26215C', fontWeight: '600' },
  dayTextActive: { color: '#ffffff' },
  classCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#26215C' },
  timeBox: { backgroundColor: '#f0eeff', borderRadius: 10, padding: 10, marginRight: 14, alignItems: 'center', minWidth: 75 },
  timeText: { color: '#26215C', fontWeight: '700', fontSize: 12 },
  classInfo: { flex: 1 },
  subjectText: { fontSize: 16, fontWeight: '700', color: '#26215C', marginBottom: 4 },
  detailText: { fontSize: 12, color: '#7F77DD', marginBottom: 2 },
  ptmCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1.5, borderColor: '#DDD8FF' },
  ptmTitle: { fontSize: 16, fontWeight: '700', color: '#26215C', marginBottom: 6 },
  ptmDate: { fontSize: 13, color: '#534AB7', fontWeight: '600', marginBottom: 14 },
  ptmItem: { fontSize: 14, color: '#26215C', marginBottom: 8, lineHeight: 20 },
  ptmNote: { fontSize: 13, color: '#639922', marginTop: 10, fontWeight: '600' },
});