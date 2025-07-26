import { en, TranslationKeys } from './en';
import { id } from './id';
import { mapEn, MapTranslationKeys } from './map.en';
import { mapId } from './map.id';
import { facilityEn, FacilityTranslationKeys } from './facility.en';
import { facilityId } from './facility.id';
import { ctaEn, CtaTranslationKeys } from './cta.en';
import { ctaId } from './cta.id';
import { kamarEn, KamarTranslationKeys } from './kamar.en';
import { kamarId } from './kamar.id';
import { roomDetailEn, RoomDetailTranslationKeys } from './room-detail.en';
import { roomDetailId } from './room-detail.id';
import { bookingEn, BookingTranslationKeys } from './booking.en';
import { bookingId } from './booking.id';

export type Language = 'en' | 'id';

export const translations = {
  en,
  id
} as const;

export const mapTranslations = {
  en: mapEn,
  id: mapId
} as const;

export const facilityTranslations = {
  en: facilityEn,
  id: facilityId
} as const;

export const ctaTranslations = {
  en: ctaEn,
  id: ctaId
} as const;

export const kamarTranslations = {
  en: kamarEn,
  id: kamarId
} as const;

export const roomDetailTranslations = {
  en: roomDetailEn,
  id: roomDetailId
} as const;

export const bookingTranslations = {
  en: bookingEn,
  id: bookingId
} as const;

export const getTranslation = (language: Language): TranslationKeys => {
  return translations[language] || translations.en;
};

export const getMapTranslation = (language: Language): MapTranslationKeys => {
  return mapTranslations[language] || mapTranslations.en;
};

export const getFacilityTranslation = (language: Language): FacilityTranslationKeys => {
  return facilityTranslations[language] || facilityTranslations.en;
};

export const getCtaTranslation = (language: Language): CtaTranslationKeys => {
  return ctaTranslations[language] || ctaTranslations.en;
};

export const getKamarTranslation = (language: Language): KamarTranslationKeys => {
  return kamarTranslations[language] || kamarTranslations.en;
};

export const getRoomDetailTranslation = (language: Language): RoomDetailTranslationKeys => {
  return roomDetailTranslations[language] || roomDetailTranslations.en;
};

export const getBookingTranslation = (language: Language): BookingTranslationKeys => {
  return bookingTranslations[language] || bookingTranslations.en;
};

export const defaultLanguage: Language = 'id';
export const supportedLanguages: Language[] = ['en', 'id'];

export * from './en';
export * from './id';
export * from './map.en';
export * from './map.id';
export * from './facility.en';
export * from './facility.id';
export * from './cta.en';
export * from './cta.id';
export * from './kamar.en';
export * from './kamar.id';
export * from './room-detail.en';
export * from './room-detail.id';
export * from './booking.en';
export * from './booking.id'; 