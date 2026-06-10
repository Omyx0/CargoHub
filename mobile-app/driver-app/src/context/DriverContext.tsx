import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { startLocationTracking, stopLocationTracking } from '../services/locationTask';

interface DriverContextType {
  driver: any | null;
  activeBooking: any | null;
  isOnline: boolean;
  isLoading: boolean;
  refreshDriverData: () => Promise<void>;
  toggleOnlineStatus: (status: boolean) => Promise<boolean>;
  setActiveBooking: (booking: any | null) => void;
  draftBooking: any | null;
  setDraftBooking: (booking: any | null) => void;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [driver, setDriver] = useState<any | null>(null);
  const [activeBooking, setActiveBooking] = useState<any | null>(null);
  const [draftBooking, setDraftBooking] = useState<any | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDriverData = async () => {
    if (!user || user.role !== 'DRIVER') return;
    setIsLoading(true);
    try {
      const response = await api.get(`/drivers/${user.firebaseUid}`);
      if (response.data?.data) {
        setDriver(response.data.data);
        setIsOnline(response.data.data.isAvailable);
      }
      const activeResp = await api.get('/bookings/driver/active');
      if (activeResp.data?.data) setActiveBooking(activeResp.data.data);
    } catch (error) {
      console.log('Error fetching driver data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDriverData();
    } else {
      setDriver(null);
      setActiveBooking(null);
      setIsOnline(false);
      stopLocationTracking();
    }
  }, [user]);

  const toggleOnlineStatus = async (status: boolean) => {
    try {
      const response = await api.patch('/drivers/availability', { available: status });
      if (response.data?.success) {
        setIsOnline(status);
        status ? await startLocationTracking() : await stopLocationTracking();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to toggle availability', error);
      return false;
    }
  };

  return (
    <DriverContext.Provider value={{ driver, activeBooking, isOnline, isLoading, refreshDriverData: fetchDriverData, toggleOnlineStatus, setActiveBooking, draftBooking, setDraftBooking }}>
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) throw new Error('useDriver must be used within DriverProvider');
  return context;
};
