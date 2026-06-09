import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { theme } from '../theme/theme';
import { useDriver } from '../context/DriverContext';
import { EarningsCard } from '../components/EarningsCard';
import { StatusBadge } from '../components/StatusBadge';
import { Truck } from 'lucide-react-native';

export const HomeScreen = () => {
  const { isOnline, toggleOnlineStatus, driver } = useDriver();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* location && (
        <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={{ latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }} showsUserLocation={false}>
          <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}>
            <View style={styles.markerContainer}><Truck color="white" size={20} /></View>
          </Marker>
        </MapView>
      ) */}
      <View style={styles.header}>
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.driverName}>Hi, {driver?.name || 'Driver'}</Text>
            <StatusBadge status={isOnline ? 'verified' : 'cancelled'} label={isOnline ? 'ONLINE' : 'OFFLINE'} />
          </View>
          <Switch trackColor={{ false: theme.colors.border.subtle, true: 'rgba(16, 185, 129, 0.3)' }} thumbColor={isOnline ? theme.colors.brand.success : '#f4f3f4'} onValueChange={(val) => { toggleOnlineStatus(val); }} value={isOnline} />
        </View>
      </View>
      <View style={styles.bottomSheet}>
        <Text style={styles.sheetTitle}>Today's Summary</Text>
        <View style={styles.statsRow}>
          <EarningsCard label="Earnings" amount={driver?.earnings?.today || 0} style={styles.flexCard} />
          <View style={styles.tripsCard}>
            <Text style={styles.tripsLabel}>Trips</Text>
            <Text style={styles.tripsValue}>{driver?.earnings?.tripCount || 0}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.primary },
  map: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  markerContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.brand.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'white', ...theme.shadows.glow },
  header: { position: 'absolute', top: 60, left: 20, right: 20 },
  statusCard: { backgroundColor: theme.colors.background.card, borderRadius: theme.radius.xl, padding: theme.spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...theme.shadows.card },
  driverName: { fontFamily: theme.typography.display.fontFamily, fontSize: 18, color: theme.colors.text.primary, marginBottom: 4 },
  bottomSheet: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: theme.colors.background.card, borderRadius: theme.radius.xl, padding: theme.spacing.lg, ...theme.shadows.md },
  sheetTitle: { fontFamily: theme.typography.bodySemibold.fontFamily, fontSize: 16, color: theme.colors.text.primary, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: theme.spacing.md },
  flexCard: { flex: 2 },
  tripsCard: { flex: 1, backgroundColor: theme.colors.background.secondary, borderRadius: theme.radius.xl, padding: theme.spacing.md, justifyContent: 'center', alignItems: 'center' },
  tripsLabel: { fontFamily: theme.typography.bodySemibold.fontFamily, fontSize: 12, color: theme.colors.brand.secondary, textTransform: 'uppercase', marginBottom: 8 },
  tripsValue: { fontFamily: theme.typography.mono.fontFamily, fontSize: 32, fontWeight: 'bold', color: theme.colors.text.primary },
});
