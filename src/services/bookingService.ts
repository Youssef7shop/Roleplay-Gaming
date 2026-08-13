export interface BookingSettings {
  totalSpots: number;
  bookedSpots: number;
}

const BOOKING_KEY = 'nexus_booking_settings';

export const getBookingSettings = (): BookingSettings => {
  try {
    const data = localStorage.getItem(BOOKING_KEY);
    return data ? JSON.parse(data) : { totalSpots: 10, bookedSpots: 0 };
  } catch (e) {
    return { totalSpots: 10, bookedSpots: 0 };
  }
};

export const saveBookingSettings = (settings: BookingSettings) => {
  localStorage.setItem(BOOKING_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event('nexus_booking_updated'));
};

export const reserveSpot = (): boolean => {
  const settings = getBookingSettings();
  if (settings.bookedSpots < settings.totalSpots) {
    settings.bookedSpots += 1;
    saveBookingSettings(settings);
    return true;
  }
  return false;
};

export const subscribeToBookingSettings = (callback: (s: BookingSettings) => void) => {
  callback(getBookingSettings());
  const handleUpdate = () => callback(getBookingSettings());
  window.addEventListener('nexus_booking_updated', handleUpdate);
  return () => window.removeEventListener('nexus_booking_updated', handleUpdate);
};
