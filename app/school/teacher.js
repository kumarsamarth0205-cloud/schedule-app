import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert
} from 'react-native';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timetableGenerated = true;

const myClasses = {
  Mon: [
    { time: '8:00 AM', subject: 'Mathematics', room: 'Room 1', class: 'Class 10-A' },
    { time: '10:00 AM', subject: 'Mathematics', room: 'Room 2', class: 'Class 9-B' },
  ],
  Tue: [
    { time: '10:00 AM', subject: 'Mathematics', room: 'Room 2', class: 'Class 9-A' },
  ],
  Wed: [
    { time: '8:00 AM', subject: 'Mathematics', room: 'Room 1', class: 'Class 8-A' },
  ],
  Thu: [],
  Fri: [
    { time: '8:00 AM', subject: 'Mathematics', room: 'Room 1', class: 'Class 10-A' },
  ],
  Sat: [
    { time: '8:00 AM', subject: 'Revision', room: 'Room 1', class: 'Class 10-A' },
  ],
};

const examDuty = [
  { date: '10', month: 'May', hall: 'Hall A', time: '9:00 AM - 12:00 PM', exam: 'Mathematics — Class 10' },
  { date: '15', month: 'May', hall: 'Hall B', time: '2:00 PM - 5:00 PM', exam: 'Science — Class 9' },
];

export default function TeacherScreen({ user, onLogout }) {
  const [tab, setTab] = useState('timetable');
  const [selectedDay, setSelectedDay] = useState('Mon');

  const handleSickLeave = () => {
    Alert.alert(
      'Mark Sick Leave',
      'AI will automatically reshuffle your classes and notify students and parents.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: () => Alert.alert('Done!', 'Sick leave marked! Everyone notified.') }
      ]
    );
  };

  if (!timetableGenerated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.header}>Teacher</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.waitBox}>
          <Text style={styles.waitIcon}>⏳</Text>
          <Text style={styles.waitTitle}>Timetable Not Ready Yet</Text>
          <Text style={styles.waitDesc}>Admin is preparing the timetable. Please check back soon!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.header}>Teacher Dashboard</Text>
          <Text style={styles.sub}>Welcome, {user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sickLeaveBtn} onPress={handleSickLeave}>
        <Text style={styles.sickLeaveText}>🤒 Mark Today as Sick Leave</Text>
      </TouchableOpacity>

      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'timetable' && styles.tabActive]} onPress={() => setTab('timetable')}>
          <Text style={[styles.tabText, tab === 'timetable' && styles.tabTextActive]}>📅 My Classes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'exam' && styles.tabActive]} onPress={() => setTab('exam')}>
          <Text style={[styles.tabText, tab === 'exam' && styles.tabTextActive]}>📝 Exam Duty</Text>
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
            {myClasses[selectedDay].length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No classes today 🎉</Text>
              </View>
            ) : (
              myClasses[selectedDay].map((item, i) => (
                <View key={i} style={styles.classCard}>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <View style={styles.classInfo}>
                    <Text style={styles.subjectText}>{item.subject}</Text>
                    <Text style={styles.detailText}>🏫 {item.room}</Text>
                    <Text style={styles.detailText}>👥 {item.class}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </>
      )}

      {tab === 'exam' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {examDuty.map((item, i) => (
            <View key={i} style={styles.examCard}>
              <View style={styles.dateBox}>
                <Text style={styles.dateNum}>{item.date}</Text>
                <Text style={styles.dateMon}>{item.month}</Text>
              </View>
              <View style={styles.classInfo}>
                <Text style={styles.subjectText}>Invigilator — {item.hall}</Text>
                <Text style={styles.detailText}>🕐 {item.time}</Text>
                <Text style={styles.detailText}>📝 {item.exam}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0eeff', paddingHorizontal: 16, paddingTop: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  header: { fontSize: 24, fontWeight: '800', color: '#26215C' },
  sub: { fontSize: 12, color: '#7F77DD', marginTop: 2 },
  logoutBtn: { backgroundColor: '#ffffff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: '#26215C' },
  logoutText: { color: '#26215C', fontWeight: '700' },
  waitBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  waitIcon: { fontSize: 60, marginBottom: 20 },
  waitTitle: { fontSize: 20, fontWeight: '800', color: '#26215C', marginBottom: 12, textAlign: 'center' },
  waitDesc: { fontSize: 14, color: '#7F77DD', textAlign: 'center', lineHeight: 22 },
  sickLeaveBtn: { backgroundColor: '#FCEBEB', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 14, borderWidth: 1.5, borderColor: '#E24B4A' },
  sickLeaveText: { color: '#E24B4A', fontWeight: '700', fontSize: 14 },
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
  examCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#E24B4A' },
  timeBox: { backgroundColor: '#f0eeff', borderRadius: 10, padding: 10, marginRight: 14, alignItems: 'center', minWidth: 75 },
  timeText: { color: '#26215C', fontWeight: '700', fontSize: 12 },
  dateBox: { backgroundColor: '#FCEBEB', borderRadius: 10, padding: 10, marginRight: 14, alignItems: 'center', minWidth: 55 },
  dateNum: { color: '#E24B4A', fontWeight: '800', fontSize: 20 },
  dateMon: { color: '#E24B4A', fontWeight: '600', fontSize: 11 },
  classInfo: { flex: 1 },
  subjectText: { fontSize: 16, fontWeight: '700', color: '#26215C', marginBottom: 4 },
  detailText: { fontSize: 12, color: '#7F77DD', marginBottom: 2 },
  emptyBox: { backgroundColor: '#ffffff', borderRadius: 16, padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#26215C' },
});