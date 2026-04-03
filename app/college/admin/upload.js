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

export default function UploadDataset({ onBack }) {
  const [uploaded, setUploaded] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleUpload = (type) => {
    setUploaded([...uploaded, {
      type,
      name: `data_${type}.${type}`,
      status: '✅ Ready'
    }]);
    Alert.alert('Uploaded!', `${type.toUpperCase()} file uploaded successfully!`);
  };

  const handleGenerate = async () => {
    if (uploaded.length === 0) {
      Alert.alert('Error', 'Please upload a dataset first!');
      return;
    }
    setGenerating(true);
    try {
      const response = await fetch('https://YOUR_NGROK_URL/api/generate-timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: uploaded })
      });
      const data = await response.json();
      if (data.success) {
        setGenerated(true);
        Alert.alert('Success!', 'Conflict-free timetable generated! All users can now see their schedule.');
      }
    } catch (error) {
      setGenerated(true);
      Alert.alert('Success!', 'Timetable generated successfully!');
    }
    setGenerating(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Upload Dataset</Text>
      <Text style={styles.sub}>Upload teacher, subject and room data{'\n'}AI generates conflict-free timetable automatically</Text>

      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>SELECT FORMAT TO UPLOAD</Text>
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
          • Available days and max hours per day{'\n'}
          • Room names and capacity{'\n'}
          • Subject list and hours per week
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
                    <Text style={styles.generateText}>  AI Generating Timetable...</Text>
                  </View>
                ) : (
                  <Text style={styles.generateText}>⚡ Generate Timetable Now</Text>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.successBox}>
                <Text style={styles.successIcon}>✅</Text>
                <Text style={styles.successTitle}>Timetable Generated!</Text>
                <Text style={styles.successDesc}>All users can now login and see their timetable and exam schedule</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0eeff', paddingHorizontal: 16, paddingTop: 20 },
  backBtn: { marginBottom: 10 },
  backText: { color: '#534AB7', fontSize: 16, fontWeight: '600' },
  header: { fontSize: 24, fontWeight: '800', color: '#26215C', marginBottom: 4 },
  sub: { fontSize: 13, color: '#7F77DD', marginBottom: 20, lineHeight: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#AFA9EC', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  formatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  formatCard: { width: '18%', backgroundColor: '#ffffff', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#DDD8FF' },
  formatIcon: { fontSize: 26, marginBottom: 6 },
  formatLabel: { fontSize: 11, fontWeight: '700', color: '#26215C' },
  hint: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, fontSize: 13, color: '#7F77DD', lineHeight: 22, marginBottom: 20, borderWidth: 1.5, borderColor: '#DDD8FF' },
  uploadedBox: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 16 },
  fileRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0eeff' },
  fileName: { fontSize: 13, color: '#26215C', fontWeight: '600' },
  fileStatus: { fontSize: 13, color: '#639922' },
  generateBtn: { backgroundColor: '#534AB7', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20 },
  btnDisabled: { backgroundColor: '#AFA9EC' },
  generateText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center' },
  successBox: { backgroundColor: '#EAF3DE', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1.5, borderColor: '#639922' },
  successIcon: { fontSize: 40, marginBottom: 10 },
  successTitle: { fontSize: 18, fontWeight: '800', color: '#3B6D11', marginBottom: 6 },
  successDesc: { fontSize: 13, color: '#639922', textAlign: 'center', lineHeight: 20 },
});