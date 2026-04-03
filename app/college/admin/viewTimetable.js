import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView
} from 'react-native';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const views = ['Student View', 'Faculty View', 'Admin View'];

const timetable = {
  Mon: [
    { time: '9:00 AM', subject: 'Data Science', room: 'A101', teacher: 'Dr. Sharma', dept: 'BT-DS' },
    { time: '10:00 AM', subject: 'Machine Learning', room: 'B202', teacher: 'Dr. Verma', dept: 'BT-DS' },
    { time: '11:00 AM', subject: 'AI Fundamentals', room: 'C301', teacher: 'Dr. Khan', dept: 'BT-AI' },
    { time: '2:00 PM', subject: 'Python Lab', room: 'Lab 1', teacher: 'Ms. Gupta', dept: 'BT-DS' },
  ],
  Tue: [
    { time: '9:00 AM', subject: 'Statistics', room: 'A101', teacher: 'Dr. Sharma', dept: 'BT-DS' },
    { time: '11:00 AM', subject: 'Database', room: 'B202', teacher: 'Mr. Singh', dept: 'BT-AI' },
  ],
  Wed: [
    { time: '10:00 AM', subject: 'Data Science', room: 'A101', teacher: 'Dr. Sharma', dept: 'BT-DS' },
    { time: '2:00 PM', subject: 'ML Lab', room: 'Lab 2', teacher: 'Dr. Verma', dept: 'BT-DS' },
  ],
  Thu: [
    { time: '9:00 AM', subject: 'Database', room: 'A103', teacher: 'Mr. Singh', dept: 'BT-AI' },
    { time: '11:00 AM', subject: 'AI Fundamentals', room: 'A101', teacher: 'Dr. Khan', dept: 'BT-AI' },
  ],
  Fri: [
    { time: '9:00 AM', subject: 'Python Lab', room: 'Lab 1', teacher: 'Ms. Gupta', dept: 'BT-DS' },
    { time: '1:00 PM', subject: 'Data Science', room: 'A101', teacher: 'Dr. Sharma', dept: 'BT-DS' },
  ],
  Sat: [
    { time: '10:00 AM', subject: 'Revision', room: 'A101', teacher: 'Dr. Sharma', dept: 'BT-DS' },
  ],
};

export default function ViewTimetable({ onBack }) {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [selectedView, setSelectedView] = useState('Admin View');
  const [conflictChecked, setConflictChecked] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Generated Timetable</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.viewScroll}>
        {views.map(v => (
          <TouchableOpacity
            key={v}
            style={[styles.viewBtn, selectedView === v && styles.viewBtnActive]}
            onPress={() => setSelectedView(v)}
          >
            <Text style={[styles.viewText, selectedView === v && styles.viewTextActive]}>{v}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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

      <TouchableOpacity
        style={[styles.conflictBtn, conflictChecked && styles.conflictBtnDone]}
        onPress={() => setConflictChecked(true)}
      >
        <Text style={styles.conflictText}>
          {conflictChecked ? '✅ Zero Conflicts Found — Certificate Ready!' : '🔍 Run Conflict Check'}
        </Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {timetable[selectedDay].map((item, index) => (
          <View key={index} style={styles.classCard}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <View style={styles.classInfo}>
              <Text style={styles.subjectText}>{item.subject}</Text>
              <Text style={styles.detailText}>🏫 {item.room}</Text>
              <Text style={styles.detailText}>👨‍🏫 {item.teacher}</Text>
              {selectedView === 'Admin View' && (
                <Text style={styles.deptText}>🏛 {item.dept}</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0eeff', paddingHorizontal: 16, paddingTop: 20 },
  backBtn: { marginBottom: 10 },
  backText: { color: '#534AB7', fontSize: 16, fontWeight: '600' },
  header: { fontSize: 24, fontWeight: '800', color: '#26215C', marginBottom: 12 },
  viewScroll: { flexGrow: 0, marginBottom: 12 },
  viewBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#7F77DD', marginRight: 8 },
  viewBtnActive: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  viewText: { color: '#534AB7', fontWeight: '600', fontSize: 13 },
  viewTextActive: { color: '#ffffff' },
  dayScroll: { flexGrow: 0, marginBottom: 12 },
  dayBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: '#7F77DD', marginRight: 10 },
  dayBtnActive: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  dayText: { color: '#534AB7', fontWeight: '600' },
  dayTextActive: { color: '#ffffff' },
  conflictBtn: { backgroundColor: '#ffffff', borderRadius: 12, padding: 12, alignItems: 'center', marginBottom: 12, borderWidth: 1.5, borderColor: '#534AB7' },
  conflictBtnDone: { backgroundColor: '#EAF3DE', borderColor: '#639922' },
  conflictText: { color: '#26215C', fontWeight: '700', fontSize: 13 },
  classCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#534AB7' },
  timeBox: { backgroundColor: '#f0eeff', borderRadius: 10, padding: 10, marginRight: 14, alignItems: 'center', minWidth: 75 },
  timeText: { color: '#534AB7', fontWeight: '700', fontSize: 12 },
  classInfo: { flex: 1 },
  subjectText: { fontSize: 16, fontWeight: '700', color: '#26215C', marginBottom: 4 },
  detailText: { fontSize: 12, color: '#7F77DD', marginBottom: 2 },
  deptText: { fontSize: 12, color: '#534AB7', fontWeight: '600', marginTop: 2 },
});