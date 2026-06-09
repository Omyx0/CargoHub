import React, { useState } from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { theme } from '../theme/theme';
import { useDriver } from '../context/DriverContext';
import { StepIndicator } from '../components/StepIndicator';
import { GradientButton } from '../components/GradientButton';
import { Header } from '../components/Header';
import { Phone, MapPin, Navigation as NavIcon } from 'lucide-react-native';

export const JobScreen = () => {
  const { activeBooking, driver } = useDriver();
  const [step, setStep] = useState(0);

  if (!activeBooking) return null;

  const handleNextStep = () => { if (step < 3) setStep(step + 1); };

  const getButtonText = () => {
    switch (step) { case 0: return 'Arrived at Pickup'; case 1: return 'Start Delivery'; case 2: return 'Take Delivery Photo'; case 3: return 'Complete Job'; default: return 'Next'; }
  };

  return (
    <View style={styles.container}>
      <Header title="Active Job" />
      {/* <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={{ latitude: (activeBooking.pickupLat + activeBooking.dropLat) / 2, longitude: (activeBooking.pickupLng + activeBooking.dropLng) / 2, latitudeDelta: Math.abs(activeBooking.pickupLat - activeBooking.dropLat) * 2 || 0.1, longitudeDelta: Math.abs(activeBooking.pickupLng - activeBooking.dropLng) * 2 || 0.1 }}>
        <Marker coordinate={{ latitude: activeBooking.pickupLat, longitude: activeBooking.pickupLng }}><View style={[styles.marker, { backgroundColor: theme.colors.brand.primary }]}><MapPin size={16} color="white" /></View></Marker>
        <Marker coordinate={{ latitude: activeBooking.dropLat, longitude: activeBooking.dropLng }}><View style={[styles.marker, { backgroundColor: theme.colors.brand.secondary }]}><NavIcon size={16} color="white" /></View></Marker>
        {driver?.currentLat && driver?.currentLng && <Marker coordinate={{ latitude: driver.currentLat, longitude: driver.currentLng }}><View style={[styles.marker, styles.driverMarker]} /></Marker>}
      </MapView> */}
      <View style={styles.bottomSheet}>
        <StepIndicator currentStep={step} />
        <View style={styles.customerCard}>
          <View style={styles.customerInfo}>
            <View style={styles.avatar}><Text style={styles.avatarText}>C</Text></View>
            <View><Text style={styles.customerName}>Customer</Text><Text style={styles.customerDetails}>{activeBooking.loadType} • ₹{activeBooking.fareEstimate}</Text></View>
          </View>
          <GradientButton title="" icon={<Phone size={20} color={theme.colors.brand.primary} />} variant="secondary" onPress={() => Linking.openURL(`tel:+919999999999`)} style={styles.callBtn} />
        </View>
        <GradientButton title={getButtonText()} onPress={handleNextStep} variant={step === 3 ? 'coral' : 'primary'} style={styles.actionBtn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.primary },
  map: { flex: 1 },
  marker: { padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white', ...theme.shadows.sm },
  driverMarker: { backgroundColor: '#10B981', width: 20, height: 20, borderRadius: 10, padding: 0 },
  bottomSheet: { backgroundColor: theme.colors.background.card, borderTopLeftRadius: theme.radius.xxl, borderTopRightRadius: theme.radius.xxl, padding: theme.spacing.lg, paddingBottom: 40, ...theme.shadows.md },
  customerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.colors.background.secondary, padding: theme.spacing.md, borderRadius: theme.radius.lg, marginVertical: theme.spacing.md },
  customerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.brand.primaryLight, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontFamily: theme.typography.display.fontFamily, color: 'white', fontSize: 20 },
  customerName: { fontFamily: theme.typography.bodySemibold.fontFamily, fontSize: 16, color: theme.colors.text.primary },
  customerDetails: { fontFamily: theme.typography.body.fontFamily, fontSize: 13, color: theme.colors.text.muted },
  callBtn: { width: 48, height: 48, paddingHorizontal: 0, paddingVertical: 0 },
  actionBtn: { marginTop: 8 },
});
