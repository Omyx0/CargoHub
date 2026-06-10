import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Vibration, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { theme } from '../theme/theme';
import { GradientButton } from '../components/GradientButton';
import { CountdownTimer } from '../components/CountdownTimer';
import { MapPin, Navigation, Package, IndianRupee } from 'lucide-react-native';

const { height } = Dimensions.get('window');

interface IncomingJobProps {
  visible: boolean;
  job: any;
  onAccept: () => void;
  onDecline: () => void;
}

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#0d0f1a" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0d0f1a" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#6b7280" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#2a2d3e" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#161824" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#2a2d3e" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca3af" }] },
  { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#090b11" }] }
];

export const IncomingJobModal: React.FC<IncomingJobProps> = ({ visible, job, onAccept, onDecline }) => {
  useEffect(() => {
    if (visible) {
      Vibration.vibrate([0, 500, 200, 500], true);
    } else {
      Vibration.cancel();
    }
    return () => Vibration.cancel();
  }, [visible]);

  if (!job) return null;

  const hasCoordinates = job.pickupLat && job.pickupLng && job.dropLat && job.dropLng;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>New Booking Request</Text>
            <View style={styles.timerWrapper}>
              <CountdownTimer duration={30} onComplete={onDecline} size={40} strokeWidth={4} />
            </View>
          </View>

          {hasCoordinates && (
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                customMapStyle={darkMapStyle}
                initialRegion={{
                  latitude: (job.pickupLat + job.dropLat) / 2,
                  longitude: (job.pickupLng + job.dropLng) / 2,
                  latitudeDelta: Math.abs(job.pickupLat - job.dropLat) * 2 || 0.05,
                  longitudeDelta: Math.abs(job.pickupLng - job.dropLng) * 2 || 0.05,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                <Polyline
                  coordinates={[
                    { latitude: job.pickupLat, longitude: job.pickupLng },
                    { latitude: job.dropLat, longitude: job.dropLng }
                  ]}
                  strokeColor={theme.colors.brand.primary}
                  strokeWidth={3}
                  lineDashPattern={[10, 10]}
                />
                <Marker coordinate={{ latitude: job.pickupLat, longitude: job.pickupLng }}>
                  <View style={[styles.marker, { backgroundColor: theme.colors.brand.primary }]}>
                    <MapPin size={12} color="white" />
                  </View>
                </Marker>
                <Marker coordinate={{ latitude: job.dropLat, longitude: job.dropLng }}>
                  <View style={[styles.marker, { backgroundColor: theme.colors.brand.secondary }]}>
                    <Navigation size={12} color="white" />
                  </View>
                </Marker>
              </MapView>
            </View>
          )}

          <View style={styles.routeContainer}>
            <View style={styles.routeItem}>
              <MapPin size={20} color={theme.colors.brand.primary} />
              <View style={styles.routeText}>
                <Text style={styles.routeLabel}>PICKUP</Text>
                <Text style={styles.addressText} numberOfLines={2}>{job.pickupAddress}</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeItem}>
              <Navigation size={20} color={theme.colors.brand.secondary} />
              <View style={styles.routeText}>
                <Text style={styles.routeLabel}>DROP</Text>
                <Text style={styles.addressText} numberOfLines={2}>{job.dropAddress}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Package size={20} color={theme.colors.text.muted} />
              <Text style={styles.detailText}>{job.loadType}</Text>
            </View>
            <View style={styles.detailItem}>
              <IndianRupee size={20} color={theme.colors.brand.success} />
              <Text style={styles.fareText}>₹{job.fareEstimate}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <GradientButton title="Decline" variant="secondary" onPress={onDecline} style={styles.btn} />
            <GradientButton title="Accept Job" onPress={onAccept} style={styles.btn} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 15, 26, 0.85)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    padding: theme.spacing.xl,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
    maxHeight: height * 0.9,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: theme.typography.display.fontFamily,
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  timerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    height: 140,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  map: {
    flex: 1,
  },
  marker: {
    padding: 6,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    ...theme.shadows.sm,
  },
  routeContainer: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    marginBottom: 20,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: theme.colors.border.subtle,
    marginLeft: 9,
    marginVertical: 4,
  },
  routeText: {
    flex: 1,
  },
  routeLabel: {
    fontFamily: theme.typography.bodySemibold.fontFamily,
    fontSize: 11,
    color: theme.colors.text.muted,
  },
  addressText: {
    fontFamily: theme.typography.bodyMedium.fontFamily,
    fontSize: 14,
    color: theme.colors.text.primary,
    marginTop: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.background.tertiary,
    padding: 12,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  detailText: {
    fontFamily: theme.typography.bodySemibold.fontFamily,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  fareText: {
    fontFamily: theme.typography.mono.fontFamily,
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.brand.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  btn: {
    flex: 1,
  },
});
