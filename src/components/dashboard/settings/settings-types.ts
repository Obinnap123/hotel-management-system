export type HotelProfileSettingsValues = {
  hotelName: string;
  phoneNumber: string;
  emailAddress: string;
  physicalAddress: string;
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
  currency: string;
};

export type ReservationWebsiteSettingsValues = {
  hotelName: string;
  websiteTitle: string;
  websiteDescription: string;
  heroImages: string[];
  heroImagePublicIds: string[];
  updatedAt: string;
};
