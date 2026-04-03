import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Alert
} from 'react-native';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const myClasses = {
  Mon: [
    { time: '9:00 AM', subject: 'Data Science', room: 'A101', batch: 'BT-DS-6A' },
    { time: '11:00 AM', subject: 'AI Fundamentals', room: 'B202', batch: 'BT-AI-4B' },
  ],
  Tue: [
    { time: '10:00 AM', subject: 'Data Science', room: 'A101', batch: 'BT-DS-6A' },
  ],
  Wed: [
    { time: '9:00 AM', subject: 'AI Fundamentals', room: 'B202', batch: 'BT-AI-4B' },
    { time: '2:00 PM', subject: 'Data Science', room: 'A101', batch: 'BT-DS-6B' },
  ],
  Thu: [
    { time: '11:00 AM', subject: 'AI Fundamentals', room: 'B202', batch: 'BT-AI-4A' },
  ],
  Fri: [
    { time: '1:00 PM', subject: 'Data Science', room: 'A101', batch: 'BT-DS-6A' },
  ],
  Sat: [],
};

export default function FacultyDashboard({ onLogout }) {
  const [tab, setTab] = useState('timetable');
  const [selectedDay, setSelectedDay] = useState('Mon');

  const handleSickLeave = () => {
    Alert.alert(
      'Mark Sick Leave',
      'Are you sure? AI will automatically reshuffle your classes and notify students.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Mark Absent', style: 'destructive', onPress: () => Alert.alert('Done!', 'Sick leave marked! Students notified automatically.') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.header}>Faculty Dashboard</Text>
          <Text style={styles.sub}>Dr. Sharma — Data Science</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sickLeaveBtn} onPress={handleSickLeave}>
        <Text style={styles.sickLeaveText}>🤒 Mark Today as Sick Leave</Text>
      </TouchableOpacity>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'timetable' && styles.tabActive]}
          onPress={() => setTab('timetable')}
        >
          <Text style={[styles.tabText, tab === 'timetable' && styles.tabTextActive]}>📅 My Classes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'exam' && styles.tabActive]}
          onPress={() => setTab('exam')}
        >
          <Text style={[styles.tabText, tab === 'exam' && styles.tabTextActive]}>📝 Exam Duty</Text>
        </TouchableOpacity>
      </View>

      {tab === 'timetable' && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
            {days.map(day => (
              <TouchableOpacity
                key={day}
                style={[styles.dayBtn, selectedDay === day && styles.dayBtnActive]}
                onPress={() => setSelectedDay(day)}
              >
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
              myClasses[selectedDay].map((item, index) => (
                <View key={index} style={styles.classCard}>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <View style={styles.classInfo}>
                    <Text style={styles.subjectText}>{item.subject}</Text>
                    <Text style={styles.detailText}>🏫 {item.room}</Text>
                    <Text style={styles.detailText}>👥 {item.batch}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </>
      )}

      {tab === 'exam' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.classCard}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>10 May</Text>
            </View>
            <View style={styles.classInfo}>
              <Text style={styles.subjectText}>Invigilator — Hall A</Text>
              <Text style={styles.detailText}>🕐 10:00 AM — 1:00 PM</Text>
              <Text style={styles.detailText}>📝 Data Science Exam</Text>
            </View>
          </View>
          <View style={styles.classCard}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>14 May</Text>
            </View>
            <View style={styles.classInfo}>
              <Text style={styles.subjectText}>Invigilator — Hall B</Text>
              <Text style={styles.detailText}>🕐 2:00 PM — 5:00 PM</Text>
              <Text style={styles.detailText}>📝 AI Fundamentals Exam</Text>
            </View>
          </View>
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
  logoutBtn: { backgroundColor: '#ffffff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: '#534AB7' },
  logoutText: { color: '#534AB7', fontWeight: '700' },
  sickLeaveBtn: { backgroundColor: '#FCEBEB', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 14, borderWidth: 1.5, borderColor: '#E24B4A' },
  sickLeaveText: { color: '#E24B4A', fontWeight: '700', fontSize: 14 },
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
  emptyText: { fontSize: 16, fontWeight: '700', color: '#26215C' },
});