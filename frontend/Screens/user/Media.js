import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Audio from 'expo-av';

export default function MediaPostScreen() {
  const [caption, setCaption] = useState('');
  const [mediaUri, setMediaUri] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'photo', 'video', 'audio'
  const [recording, setRecording] = useState(null);
  const [recordedAudioPath, setRecordedAudioPath] = useState(null);

  // Zgjedh foto nga galeria
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setMediaUri(result.uri);
      setMediaType('photo');
      setRecordedAudioPath(null);
    }
  };

  // Zgjedh video nga galeria
  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.cancelled) {
      setMediaUri(result.uri);
      setMediaType('video');
      setRecordedAudioPath(null);
    }
  };

  // Regjistrimi audio
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Leje e nevojshme', 'Duhet leje për mikrofon');
        return;
      }

      await Audio.Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Audio.Recording.createAsync(
        Audio.Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedAudioPath(uri);
      setMediaType('audio');
      setMediaUri(null);
      setRecording(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Dërgimi i medias në backend
  const handlePost = async () => {
    if (!mediaType) {
      Alert.alert('Gabim', 'Zgjidhni foto, video ose regjistroni audio.');
      return;
    }

    let uriToSend = mediaUri || recordedAudioPath;
    if (!uriToSend) {
      Alert.alert('Gabim', 'Nuk ka file për të ngarkuar.');
      return;
    }

    const fileName = uriToSend.split('/').pop();
    const fileType =
      mediaType === 'photo' ? 'image/jpeg' :
      mediaType === 'video' ? 'video/mp4' :
      'audio/mp4';

    const formData = new FormData();
    formData.append('media', {
      uri: uriToSend,
      type: fileType,
      name: fileName,
    });
    formData.append('caption', caption);

    try {
      const response = await fetch('http://YOUR_SERVER_IP:3000/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Sukses', 'Media u postua me sukses!');
        setCaption('');
        setMediaUri(null);
        setRecordedAudioPath(null);
        setMediaType(null);
      } else {
        Alert.alert('Gabim', data.error || 'Ndodhi një gabim');
      }
    } catch (error) {
      Alert.alert('Gabim', 'Nuk u arrit të dërgohej media.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Posto Foto/Video/Audio me Fast Food</Text>

      <TextInput
        placeholder="Shkruaj caption"
        value={caption}
        onChangeText={setCaption}
        style={styles.input}
      />

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Zgjidh Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickVideo}>
          <Text style={styles.buttonText}>Zgjidh Video</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recordContainer}>
        <TouchableOpacity
          style={[styles.recordButton, recording && styles.recording]}
          onPress={recording ? stopRecording : startRecording}
        >
          <Text style={styles.buttonText}>
            {recording ? 'Ndalo Regjistrimin' : 'Regjistro Audio'}
          </Text>
        </TouchableOpacity>
      </View>

      {mediaUri && mediaType === 'photo' && (
        <Image source={{ uri: mediaUri }} style={styles.previewImage} />
      )}

      {mediaUri && mediaType === 'video' && (
        <Text style={styles.previewText}>Video e zgjedhur: {mediaUri.split('/').pop()}</Text>
      )}

      {recordedAudioPath && mediaType === 'audio' && (
        <Text style={styles.previewText}>Audio e regjistruar: {recordedAudioPath.split('/').pop()}</Text>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handlePost}>
        <Text style={styles.submitButtonText}>Posto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 15,
  },
  buttonsRow: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50', 
    padding: 12, 
    borderRadius: 8,
  },
  buttonText: {
    color: 'white', 
    fontWeight: 'bold',
  },
  recordContainer: {
    alignItems: 'center', 
    marginBottom: 15,
  },
  recordButton: {
    backgroundColor: '#F44336', 
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 25,
  },
  recording: {
    backgroundColor: '#D32F2F',
  },
  previewImage: {
    width: 200, 
    height: 200, 
    marginBottom: 15, 
    alignSelf: 'center',
  },
  previewText: {
    textAlign: 'center', 
    marginBottom: 15, 
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#2196F3', 
    padding: 15, 
    borderRadius: 30, 
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 18,
  },
});
