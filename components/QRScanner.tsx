import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { X, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface QRScannerProps {
  onClose: () => void;
  onScanResult: (data: string, isSafe: boolean) => void;
}

export default function QRScanner({ onClose, onScanResult }: QRScannerProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Fake QR code patterns that might indicate fraud
  const suspiciousPatterns = [
    /bit\.ly/i,
    /tinyurl/i,
    /pay.*now/i,
    /urgent.*payment/i,
    /click.*here/i,
    /limited.*time/i,
    /congratulations/i,
    /winner/i,
  ];

  const checkQRSafety = (data: string): boolean => {
    // Check for suspicious patterns
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(data)) {
        return false;
      }
    }

    // Check for legitimate payment apps
    const safePaymentPatterns = [
      /upi:\/\//i,
      /paytm/i,
      /googlepay/i,
      /phonepe/i,
    ];

    // If it contains UPI or known payment apps, it might be safe
    // but we should still be cautious
    return safePaymentPatterns.some(pattern => pattern.test(data));
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    const isSafe = checkQRSafety(data);
    
    setTimeout(() => {
      onScanResult(data, isSafe);
      onClose();
    }, 1000);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            We need your permission to show the camera
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <View style={styles.scanArea}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanText}>
              Position QR code within the frame
            </Text>
          </View>

          {scanned && (
            <View style={styles.resultContainer}>
              <View style={styles.resultIcon}>
                {checkQRSafety('') ? (
                  <CheckCircle size={48} color={Colors.success} />
                ) : (
                  <AlertTriangle size={48} color={Colors.error} />
                )}
              </View>
              <Text style={styles.resultText}>
                {checkQRSafety('') ? 'QR Code appears safe' : 'WARNING: Suspicious QR Code detected!'}
              </Text>
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray900,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scanText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 20,
  },
  resultContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  resultIcon: {
    marginBottom: 12,
  },
  resultText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    color: Colors.gray800,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
});