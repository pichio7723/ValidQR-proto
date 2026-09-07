// src/screens/ScannerScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          console.log('Usuario cargado:', parsedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      }
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || processing || !user) {
      console.log('Escaneo ignorado:', { scanned, processing, user: !!user });
      return;
    }
    
    console.log('QR escaneado:', { type, data, user });
    setScanned(true);
    setProcessing(true);

    try {
      let codigoId = data;
      if (data.includes('/escanear/')) {
        codigoId = data.split('/escanear/')[1];
      }

      console.log('Obteniendo ubicación...');
      const loc = await Location.getCurrentPositionAsync({ 
        accuracy: Location.Accuracy.Balanced,
      });
      console.log('Ubicación obtenida:', loc.coords);

      console.log('Enviando asistencia...', {
        codigo_id: codigoId,
        aprendiz_id: user.id,
      });

      const response = await api.post('/asistencias/', {
        codigo_id: codigoId,
        aprendiz_id: user.id,
        latitud: loc.coords.latitude,
        longitud: loc.coords.longitude,
      });

      console.log('Asistencia registrada:', response.data);

      Alert.alert('✅ ¡Éxito!', 'Asistencia registrada correctamente', [
        { text: 'Continuar', onPress: () => { 
          setScanned(false); 
          setProcessing(false); 
        }}
      ]);
    } catch (err) {
      console.error('=== ERROR COMPLETO ===');
      console.error('Message:', err.message);
      console.error('Code:', err.code);
      
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', err.response.data);
        console.error('Headers:', err.response.headers);
      } else if (err.request) {
        console.error('No response received. Request:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }
      
      const detail = err.response?.data?.detail || err.message || 'Error desconocido';
      let msg = detail;
      
      if (err.code === 'ECONNABORTED') msg = 'Tiempo de espera agotado. Verifica tu conexión.';
      else if (err.message.includes('Network')) msg = 'Error de red. Verifica que el backend esté corriendo.';
      else if (typeof detail === 'string' && detail.includes('expiró')) msg = 'El código QR ya expiró.';
      else if (typeof detail === 'string' && detail.includes('ya registraste')) msg = 'Ya registraste asistencia hoy.';
      else if (typeof detail === 'string' && detail.includes('físicamente')) msg = 'No estás en el rango de la sede.';

      Alert.alert('❌ Error', msg, [
        { text: 'OK', onPress: () => { 
          setScanned(false); 
          setProcessing(false); 
        }}
      ]);
    } // <--- ✅ AQUÍ ESTABA LA LLAVE FALTANTE
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  // Cargando permisos
  if (!permission || !locationPermission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fc00ff" />
        <Text style={styles.text}>Cargando...</Text>
      </View>
    );
  }

  // Permisos no concedidos
  if (!permission.granted || !locationPermission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Permisos necesarios</Text>
        <Text style={styles.text}>
          Para registrar asistencia necesitamos:
          {'\n'}• Acceso a la cámara
          {'\n'}• Tu ubicación actual
        </Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={async () => { 
            await requestPermission(); 
            await requestLocationPermission(); 
          }}
        >
          <Text style={styles.buttonText}>Conceder permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Vista de cámara
  return (
    <View style={styles.mainContainer}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        ratio="4:3"
        facing="back"
      />
      
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
        <Text style={styles.instructions}>
          {processing ? '⏳ Procesando...' : ' Apunta al código QR'}
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#09090b', 
    padding: 24 
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fc00ff',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: { 
    color: '#e4e4e7', 
    fontSize: 15, 
    textAlign: 'center', 
    marginBottom: 32,
    lineHeight: 24,
  },
  overlay: { 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  scanBox: { 
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 3, 
    borderColor: '#fc00ff', 
    borderRadius: 24, 
    backgroundColor: 'rgba(252,0,255,0.05)',
  },
  instructions: { 
    color: '#fff', 
    marginTop: 32, 
    fontSize: 17, 
    textAlign: 'center', 
    paddingHorizontal: 40, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    paddingVertical: 14, 
    borderRadius: 12,
    fontWeight: '600',
  },
  logoutBtn: { 
    position: 'absolute', 
    top: 50, 
    right: 20, 
    backgroundColor: 'rgba(239,68,68,0.95)', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 10,
  },
  logoutText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  button: { 
    backgroundColor: '#fc00ff', 
    padding: 18, 
    borderRadius: 12,
    paddingHorizontal: 32,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});