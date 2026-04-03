import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView
} from 'react-native';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timetableGenerated = true;

const deptTimetable = {
  Mon: [
    { time: '9:00 AM', subject: 'Data Science', room: 'A101', teacher: 'Dr. Sharma', batch: 'BT-DS-6A' },
    { time: '10:00 AM', subject: 'Machine Learning', room: 'B202', teacher: 'Dr. Verma', batch: 'BT-DS-6B' },
    { time: '2:00 PM', subject: 'Python Lab', room: 'Lab 1', teacher: 'Ms. Gupta', batch: 'BT-DS-4A' },
  ],
  Tue: [
    { time: '9:00 AM', subject: 'Statistics', room: 'A101', teacher: 'Dr. Sharma', batch: 'BT-DS-6A' },
  ],
  Wed: [
    { time: '10:00 AM', subject: 'Data Science', room: 'A101', teacher: 'Dr. Sharma', batch: 'BT-DS-6A' },
    { time: '2:00 PM', subject: 'ML Lab', room: 'Lab 2', teacher: 'Dr. Verma', batch: 'BT-DS-6B' },
  ],
  Thu: [
    { time: '9:00 AM', subject: 'Database', room: 'A103', teacher: 'Mr. Singh', batch: 'BT-DS-4A' },
  ],
  Fri: [
    { time: '9:00 AM', subject: 'Python Lab', room: 'Lab 1', teacher: 'Ms. Gupta', batch: 'BT-DS-6A' },
  ],
  Sat: [],
};

export default function HodScreen({ user, onLogout }) {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [tab, setTab] = useState('timetable');

  if (!timetableGenerated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.header}>HOD Dashboard</Text>
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
          <Text style={styles.header}>HOD Dashboard</Text>
          <Text style={styles.sub}>Welcome, {user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'timetable' && styles.tabActive]} onPress={() => setTab('timetable')}>
          <Text style={[styles.tabText, tab === 'timetable' && styles.tabTextActive]}>📅 Dept Timetable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'club' && styles.tabActive]} onPress={() => setTab('club')}>
          <Text style={[styles.tabText, tab === 'club' && styles.tabTextActive]}>🎯 Club Sync</Text>
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
            {deptTimetable[selectedDay].length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No classes scheduled</Text>
              </View>
            ) : (
              deptTimetable[selectedDay].map((item, i) => (
                <View key={i} style={styles.classCard}>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <View style={styles.classInfo}>
                    <Text style={styles.subjectText}>{item.subject}</Text>
                    <Text style={styles.detailText}>🏫 {item.room}</Text>
                    <Text style={styles.detailText}>👨‍🏫 {item.teacher}</Text>
                    <Text style={styles.detailText}>👥 {item.batch}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </>
      )}

      {tab === 'club' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.clubCard}>
            <Text style={styles.clubTitle}>🎯 Best Club Meeting Times</Text>
            <Text style={styles.clubItem}>• Wednesday 3:00 PM — All BT-DS students free</Text>
            <Text style={styles.clubItem}>• Friday 2:00 PM — All BT-AI students free</Text>
            <Text style={styles.clubItem}>• Saturday 12:00 PM — Combined free slot</Text>
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
  tabActive: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  tabText: { color: '#534AB7', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#ffffff' },
  dayScroll: { flexGrow: 0, marginBottom: 14 },
  dayBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: '#7F77DD', marginRight: 10 },
  dayBtnActive: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  dayText: { color: '#534AB7', fontWeight: '600' },
  dayTextActive: { color: '#ffffff' },
  classCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#534AB7' },
  timeBox: { backgroundColor: '#f0eeff', borderRadius: 10, padding: 10, marginRight: 14, alignItems: 'center', minWidth: 75 },
  timeText: { color: '#534AB7', fontWeight: '700', fontSize: 12 },
  classInfo: { flex: 1 },
  subjectText: { fontSize: 16, fontWeight: '700', color: '#26215C', marginBottom: 4 },
  detailText: { fontSize: 12, color: '#7F77DD', marginBottom: 2 },
  emptyBox: { backgroundColor: '#ffffff', borderRadius: 16, padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 15, color: '#7F77DD' },
  clubCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1.5, borderColor: '#DDD8FF' },
  clubTitle: { fontSize: 16, fontWeight: '700', color: '#26215C', marginBottom: 14 },
  clubItem: { fontSize: 14, color: '#534AB7', marginBottom: 10, lineHeight: 20 },
});