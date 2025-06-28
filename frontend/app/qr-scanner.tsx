import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { X, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Shield, Camera } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';

export default function QRScanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<{ data: string; isSafe: boolean } | null>(null);
  const { updateUserStats } = useAppContext();

  // Suspicious QR code patterns that might indicate fraud
  const suspiciousPatterns = [
    /bit\.ly/i,
    /tinyurl/i,
    /pay.*now/i,
    /urgent.*payment/i,
    /click.*here/i,
    /limited.*time/i,
    /congratulations/i,
    /winner/i,
    /free.*money/i,
    /claim.*prize/i,
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
      /^upi:\/\//i,
      /paytm\.com/i,
      /googlepay/i,
      /phonepe/i,
      /bhim/i,
    ];

    // If it contains UPI or known payment apps, it might be safe
    return safePaymentPatterns.some(pattern => pattern.test(data));
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    const isSafe = checkQRSafety(data);
    setScanResult({ data, isSafe });
    
    // Update user stats
    if (!isSafe) {
      updateUserStats({ fraudBlocked: 13 }); // Increment fraud blocked count
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleRescan = () => {
    setScanned(false);
    setScanResult(null);
  };

  const renderPermissionRequest = () => (
    <View style={styles.permissionContainer}>
      <Camera size={64} color={Colors.gray400} />
      <Text style={styles.permissionTitle}>Camera Access Required</Text>
      <Text style={styles.permissionText}>
        We need camera permission to scan QR codes and detect potential fraud
      </Text>
      <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
        <Text style={styles.permissionButtonText}>Grant Permission</Text>
      </TouchableOpacity>
    </View>
  );

  const renderScanResult = () => {
    if (!scanResult) return null;

    return (
      <View style={styles.resultOverlay}>
        <View style={styles.resultContainer}>
          <View style={styles.resultIcon}>
            {scanResult.isSafe ? (
              <CheckCircle size={48} color={Colors.success} />
            ) : (
              <AlertTriangle size={48} color={Colors.error} />
            )}
          </View>
          
          <Text style={styles.resultTitle}>
            {scanResult.isSafe ? 'QR Code Appears Safe' : 'WARNING: Suspicious QR Code!'}
          </Text>
          
          <Text style={styles.resultDescription}>
            {scanResult.isSafe 
              ? 'This QR code appears to be from a legitimate source. However, always verify before proceeding with any transactions.'
              : 'This QR code contains suspicious patterns commonly used in fraud attempts. Do not proceed with any payments or downloads.'
            }
          </Text>

          <View style={styles.qrDataContainer}>
            <Text style={styles.qrDataLabel}>QR Code Content:</Text>
            <Text style={styles.qrDataText} numberOfLines={3}>
              {scanResult.data}
            </Text>
          </View>

          {!scanResult.isSafe && (
            <View style={styles.warningTips}>
              <Text style={styles.warningTipsTitle}>Safety Tips:</Text>
              <Text style={styles.warningTip}>• Never scan QR codes from unknown sources</Text>
              <Text style={styles.warningTip}>• Verify merchant details before payment</Text>
              <Text style={styles.warningTip}>• Check URLs for spelling mistakes</Text>
              <Text style={styles.warningTip}>• Report suspicious QR codes to authorities</Text>
            </View>
          )}

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.rescanButton} onPress={handleRescan}>
              <Text style={styles.rescanButtonText}>Scan Another</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        {renderPermissionRequest()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
              <X size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>QR Code Scanner</Text>
            <View style={styles.headerRight} />
          </View>

          {/* Scan Area */}
          <View style={styles.scanArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.scanText}>
              Position QR code within the frame
            </Text>
            <Text style={styles.scanSubtext}>
              We'll automatically detect and analyze the code for safety
            </Text>
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <Shield size={20} color={Colors.white} />
            <Text style={styles.securityText}>Fraud Detection Active</Text>
          </View>
        </View>

        {scanResult && renderScanResult()}
      </CameraView>
    </SafeAreaView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  headerRight: {
    width: 40,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.white,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginTop: 30,
  },
  scanSubtext: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 40,
    gap: 8,
  },
  securityText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  resultIcon: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 12,
    color: Colors.gray800,
  },
  resultDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  qrDataContainer: {
    width: '100%',
    backgroundColor: Colors.gray100,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  qrDataLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray600,
    marginBottom: 8,
  },
  qrDataText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray800,
  },
  warningTips: {
    width: '100%',
    backgroundColor: Colors.error + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  warningTipsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.error,
    marginBottom: 8,
  },
  warningTip: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.error,
    marginBottom: 4,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  rescanButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  rescanButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  closeButton: {
    flex: 1,
    backgroundColor: Colors.gray200,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray700,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    opacity: 0.9,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
  },
});