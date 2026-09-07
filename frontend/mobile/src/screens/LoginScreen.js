import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/usuarios/login', { email, password });
      await AsyncStorage.setItem('access_token', res.data.access_token);
      
      const userRes = await api.get('/usuarios/me');
      await AsyncStorage.setItem('user', JSON.stringify(userRes.data));
      
      navigation.replace('Scanner');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.detail || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ValidQR</Text>
      <Text style={styles.subtitle}>Panel de Aprendiz</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#71717a"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#71717a"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Iniciar Sesión</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#09090b' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fc00ff', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#a1a1aa', textAlign: 'center', marginBottom: 40 },
  input: {
    backgroundColor: '#18181b', color: '#fff', padding: 14, borderRadius: 10,
    marginBottom: 14, borderWidth: 1, borderColor: '#27272a', fontSize: 16
  },
  button: { backgroundColor: '#fc00ff', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});