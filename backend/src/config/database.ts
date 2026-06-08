// ============================================================================
// In-Memory Database — Mock data store for development
// Replaces Supabase/Firebase until real credentials are provided
// ============================================================================

import { v4 as uuid } from 'uuid';
import type {
  UserProfile, DriverProfile, Booking, Rating, AuditLog,
  BookingStatus, PaymentStatus, VehicleType, KycStatus,
} from '@cargohub/shared';

// ── Users Store ─────────────────────────────────────────────────────────────

const users: Map<string, UserProfile> = new Map();

// Seed admin user
users.set('admin-uid-001', {
  id: uuid(),
  firebaseUid: 'admin-uid-001',
  name: 'CargoHub Admin',
  email: 'admin@cargohub.app',
  phone: '+919999999999',
  role: 'ADMIN',
  accountType: 'STANDARD',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Seed demo user
users.set('user-uid-001', {
  id: uuid(),
  firebaseUid: 'user-uid-001',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '+919876543210',
  role: 'USER',
  accountType: 'STANDARD',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Seed B2B user
users.set('user-uid-b2b', {
  id: uuid(),
  firebaseUid: 'user-uid-b2b',
  name: 'Priya Logistics',
  email: 'priya@logisticscorp.in',
  phone: '+919876543211',
  role: 'USER',
  accountType: 'B2B',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// ── Drivers Store ───────────────────────────────────────────────────────────

const drivers: Map<string, DriverProfile> = new Map();

// Seed demo drivers
const seedDrivers: Array<{
  uid: string; name: string; phone: string; vehicleType: VehicleType;
  vehicleNumber: string; kyc: KycStatus; lat: number; lng: number; rating: number;
}> = [
  { uid: 'driver-uid-001', name: 'Suresh Kumar', phone: '+919812345001', vehicleType: 'TATA_ACE', vehicleNumber: 'UP32AB1234', kyc: 'VERIFIED', lat: 26.8467, lng: 80.9462, rating: 4.7 },
  { uid: 'driver-uid-002', name: 'Ramesh Yadav', phone: '+919812345002', vehicleType: 'TEMPO_407', vehicleNumber: 'UP32CD5678', kyc: 'VERIFIED', lat: 26.8550, lng: 80.9520, rating: 4.5 },
  { uid: 'driver-uid-003', name: 'Ajay Singh', phone: '+919812345003', vehicleType: 'PICKUP_TRUCK', vehicleNumber: 'UP32EF9012', kyc: 'VERIFIED', lat: 26.8400, lng: 80.9350, rating: 4.8 },
  { uid: 'driver-uid-004', name: 'Vijay Patel', phone: '+919812345004', vehicleType: 'LARGE_TRUCK', vehicleNumber: 'UP32GH3456', kyc: 'PENDING', lat: 26.8600, lng: 80.9600, rating: 0 },
  { uid: 'driver-uid-005', name: 'Manoj Tiwari', phone: '+919812345005', vehicleType: 'TATA_ACE', vehicleNumber: 'UP32IJ7890', kyc: 'VERIFIED', lat: 26.8300, lng: 80.9250, rating: 4.3 },
];

seedDrivers.forEach((d) => {
  const driverId = uuid();
  // Create user record for driver
  users.set(d.uid, {
    id: driverId,
    firebaseUid: d.uid,
    name: d.name,
    email: undefined,
    phone: d.phone,
    role: 'DRIVER',
    accountType: 'STANDARD',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  drivers.set(d.uid, {
    id: driverId,
    firebaseUid: d.uid,
    name: d.name,
    phone: d.phone,
    vehicleType: d.vehicleType,
    vehicleNumber: d.vehicleNumber,
    rating: d.rating,
    totalTrips: Math.floor(Math.random() * 200) + 10,
    currentLat: d.lat,
    currentLng: d.lng,
    kycStatus: d.kyc,
    isAvailable: d.kyc === 'VERIFIED',
    isActive: true,
    earnings: {
      today: Math.floor(Math.random() * 2000) + 500,
      thisWeek: Math.floor(Math.random() * 12000) + 3000,
      thisMonth: Math.floor(Math.random() * 45000) + 15000,
      tripCount: Math.floor(Math.random() * 50) + 5,
    },
    createdAt: new Date().toISOString(),
  });
});

// ── Bookings Store ──────────────────────────────────────────────────────────

const bookings: Map<string, Booking> = new Map();

// ── Ratings Store ───────────────────────────────────────────────────────────

const ratings: Map<string, Rating> = new Map();

// ── Audit Logs Store ────────────────────────────────────────────────────────

const auditLogs: AuditLog[] = [];

// ── Notification Tokens ─────────────────────────────────────────────────────

const notificationTokens: Map<string, { fcmToken?: string; apnsToken?: string; oneSignalId?: string; platform: string }> = new Map();

// ============================================================================
// Database Operations (Repository Pattern)
// ============================================================================

export const db = {
  // ── Users ───────────────────────────────────────────────────────────────
  users: {
    findByFirebaseUid: (uid: string) => users.get(uid) || null,
    findById: (id: string) => Array.from(users.values()).find(u => u.id === id) || null,
    create: (user: UserProfile) => { users.set(user.firebaseUid, user); return user; },
    update: (uid: string, data: Partial<UserProfile>) => {
      const user = users.get(uid);
      if (!user) return null;
      const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
      users.set(uid, updated);
      return updated;
    },
    getAll: () => Array.from(users.values()),
  },

  // ── Drivers ─────────────────────────────────────────────────────────────
  drivers: {
    findByFirebaseUid: (uid: string) => drivers.get(uid) || null,
    findById: (id: string) => Array.from(drivers.values()).find(d => d.id === id) || null,
    create: (driver: DriverProfile) => { drivers.set(driver.firebaseUid, driver); return driver; },
    update: (uid: string, data: Partial<DriverProfile>) => {
      const driver = drivers.get(uid);
      if (!driver) return null;
      const updated = { ...driver, ...data };
      drivers.set(uid, updated);
      return updated;
    },
    getAll: () => Array.from(drivers.values()),
    findNearby: (lat: number, lng: number, vehicleType?: VehicleType, radiusKm = 15) => {
      return Array.from(drivers.values())
        .filter(d => d.isAvailable && d.kycStatus === 'VERIFIED' && d.isActive)
        .filter(d => !vehicleType || d.vehicleType === vehicleType)
        .filter(d => {
          if (!d.currentLat || !d.currentLng) return false;
          const dist = haversine(lat, lng, d.currentLat, d.currentLng);
          return dist <= radiusKm;
        })
        .map(d => ({
          ...d,
          distance: d.currentLat && d.currentLng
            ? Math.round(haversine(lat, lng, d.currentLat, d.currentLng) * 10) / 10
            : 999,
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);
    },
  },

  // ── Bookings ────────────────────────────────────────────────────────────
  bookings: {
    findById: (id: string) => bookings.get(id) || null,
    create: (booking: Booking) => { bookings.set(booking.id, booking); return booking; },
    update: (id: string, data: Partial<Booking>) => {
      const booking = bookings.get(id);
      if (!booking) return null;
      const updated = { ...booking, ...data, updatedAt: new Date().toISOString() };
      bookings.set(id, updated);
      return updated;
    },
    findByUserId: (userId: string, page = 1, limit = 20, status?: BookingStatus) => {
      let result = Array.from(bookings.values())
        .filter(b => b.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (status) result = result.filter(b => b.status === status);
      const total = result.length;
      return {
        data: result.slice((page - 1) * limit, page * limit),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    },
    findDriverActive: (driverId: string) => {
      return Array.from(bookings.values()).find(
        b => b.driverId === driverId && !['DELIVERED', 'CANCELLED'].includes(b.status)
      ) || null;
    },
    getAll: (filters?: { status?: BookingStatus; page?: number; limit?: number }) => {
      let result = Array.from(bookings.values())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (filters?.status) result = result.filter(b => b.status === filters.status);
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const total = result.length;
      return {
        data: result.slice((page - 1) * limit, page * limit),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    },
  },

  // ── Ratings ─────────────────────────────────────────────────────────────
  ratings: {
    findByBookingId: (bookingId: string) =>
      Array.from(ratings.values()).find(r => r.bookingId === bookingId) || null,
    create: (rating: Rating) => { ratings.set(rating.id, rating); return rating; },
  },

  // ── Audit Logs ──────────────────────────────────────────────────────────
  auditLogs: {
    create: (log: AuditLog) => { auditLogs.push(log); return log; },
    getAll: () => [...auditLogs].reverse(),
  },

  // ── Notification Tokens ─────────────────────────────────────────────────
  notificationTokens: {
    set: (uid: string, tokens: typeof notificationTokens extends Map<string, infer V> ? V : never) => {
      notificationTokens.set(uid, tokens);
    },
    get: (uid: string) => notificationTokens.get(uid) || null,
  },

  // ── Analytics ───────────────────────────────────────────────────────────
  analytics: {
    getRevenue: () => {
      const allBookings = Array.from(bookings.values()).filter(b => b.paymentStatus === 'PAID');
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(todayStart.getTime() - todayStart.getDay() * 86400000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      return {
        totalRevenue: allBookings.reduce((sum, b) => sum + (b.finalFare || b.fareEstimate), 0),
        daily: allBookings.filter(b => new Date(b.createdAt) >= todayStart)
          .reduce((sum, b) => sum + (b.finalFare || b.fareEstimate), 0),
        weekly: allBookings.filter(b => new Date(b.createdAt) >= weekStart)
          .reduce((sum, b) => sum + (b.finalFare || b.fareEstimate), 0),
        monthly: allBookings.filter(b => new Date(b.createdAt) >= monthStart)
          .reduce((sum, b) => sum + (b.finalFare || b.fareEstimate), 0),
        perVehicleType: {
          TATA_ACE: allBookings.filter(b => b.vehicleType === 'TATA_ACE').reduce((s, b) => s + (b.finalFare || b.fareEstimate), 0),
          TEMPO_407: allBookings.filter(b => b.vehicleType === 'TEMPO_407').reduce((s, b) => s + (b.finalFare || b.fareEstimate), 0),
          PICKUP_TRUCK: allBookings.filter(b => b.vehicleType === 'PICKUP_TRUCK').reduce((s, b) => s + (b.finalFare || b.fareEstimate), 0),
          LARGE_TRUCK: allBookings.filter(b => b.vehicleType === 'LARGE_TRUCK').reduce((s, b) => s + (b.finalFare || b.fareEstimate), 0),
        },
      };
    },
    getHeatmap: () => {
      return Array.from(bookings.values()).map(b => ({
        lat: b.pickupLat,
        lng: b.pickupLng,
        weight: 1,
      }));
    },
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
