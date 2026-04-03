import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, ActivityIndicator
} from 'react-native';

const formats = [
  { icon: '📊', label: 'CSV File', type: 'csv', desc: 'Comma separated data' },
  { icon: '📗', label: 'Excel File', type: 'xlsx', desc: '.xlsx or .xls format' },
  { icon: '📄', label: 'PDF File', type: 'pdf', desc: 'PDF document' },
  { icon: '📝', label: 'Word File', type: 'docx', desc: '.docx document' },
  { icon: '🖼', label: 'Image', type: 'image', desc: 'Photo of timetable data' },
];

export default function UploadDataset({ onBack }) {
  const [uploaded, setUploaded] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleUpload = (type) => {
    const newFile = {
      type,
      name: `dataset_${type}_${Date.now()}`,
      status: '✅ Ready'
    };
    setUploaded([...uploaded, newFile]);
    Alert.alert('Success!', `${type.toUpperCase()} file uploaded successfully!`);
  };

  const handleGenerate = async () => {
    if (uploaded.length === 0) {
      Alert.alert('Error', 'Please upload a dataset first!');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      Alert.alert('Success!', 'Conflict-free timetable generated successfully!');
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Upload Dataset</Text>
      <Text style={styles.sub}>Upload in any format — AI reads automatically</Text>

      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>SELECT FORMAT</Text>
        <View style={styles.formatGrid}>
          {formats.map((f) => (
            <TouchableOpacity
              key={f.type}
              style={styles.formatCard}
              onPress={() => handleUpload(f.type)}
            >
              <Text style={styles.formatIcon}>{f.icon}</Text>
              <Text style={styles.formatLabel}>{f.label}</Text>
              <Text style={styles.formatDesc}>{f.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
                style={[styles.generateBtn, generating && styles.generateBtnDisabled]}
                onPress={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#ffffff" />
                    <Text style={styles.generateText}>  Generating Timetable...</Text>
                  </View>
                ) : (
                  <Text style={styles.generateText}>⚡ Generate Timetable</Text>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.successBox}>
                <Text style={styles.successText}>✅ Timetable Generated Successfully!</Text>
                <Text style={styles.successSub}>All users can now login to view their timetable</Text>
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
  sub: { fontSize: 13, color: '#7F77DD', marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#AFA9EC', letterSpacing: 1, marginBottom: 12 },
  formatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  formatCard: { width: '47%', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#DDD8FF' },
  formatIcon: { fontSize: 30, marginBottom: 8 },
  formatLabel: { fontSize: 13, fontWeight: '700', color: '#26215C', marginBottom: 4 },
  formatDesc: { fontSize: 11, color: '#7F77DD', textAlign: 'center' },
  uploadedBox: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16 },
  fileRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0eeff' },
  fileName: { fontSize: 13, color: '#26215C', fontWeight: '600' },
  fileStatus: { fontSize: 13, color: '#639922' },
  generateBtn: { backgroundColor: '#534AB7', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20 },
  generateBtnDisabled: { backgroundColor: '#AFA9EC' },
  generateText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },
  successBox: { backgroundColor: '#EAF3DE', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 20 },
  successText: { fontSize: 16, fontWeight: '700', color: '#3B6D11', marginBottom: 6 },
  successSub: { fontSize: 13, color: '#639922', textAlign: 'center' },
});