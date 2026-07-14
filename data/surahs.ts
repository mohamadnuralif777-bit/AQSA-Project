export interface Surah {
  number: number;
  englishName: string;
  arabicName: string;
  revelationType: string;
  ayahCount: number;
}

export const SURAHS: Surah[] = [
  { number: 1, englishName: 'Al-Fatiha', arabicName: 'الفاتحة', revelationType: 'Meccan', ayahCount: 7 },
  { number: 2, englishName: 'Al-Baqarah', arabicName: 'البقرة', revelationType: 'Madinan', ayahCount: 286 },
  { number: 3, englishName: 'Al-Imran', arabicName: 'آل عمران', revelationType: 'Madinan', ayahCount: 200 },
  { number: 4, englishName: 'An-Nisa', arabicName: 'النساء', revelationType: 'Madinan', ayahCount: 176 },
  { number: 5, englishName: 'Al-Maidah', arabicName: 'المائدة', revelationType: 'Madinan', ayahCount: 120 },
  { number: 6, englishName: 'Al-Anam', arabicName: 'الأنعام', revelationType: 'Meccan', ayahCount: 165 },
  { number: 7, englishName: 'Al-Araf', arabicName: 'الأعراف', revelationType: 'Meccan', ayahCount: 206 },
  { number: 8, englishName: 'Al-Anfal', arabicName: 'الأنفال', revelationType: 'Madinan', ayahCount: 75 },
  { number: 9, englishName: 'At-Taubah', arabicName: 'التوبة', revelationType: 'Madinan', ayahCount: 129 },
  { number: 10, englishName: 'Yunus', arabicName: 'يونس', revelationType: 'Meccan', ayahCount: 109 },
  { number: 11, englishName: 'Hud', arabicName: 'هود', revelationType: 'Meccan', ayahCount: 123 },
  { number: 12, englishName: 'Yusuf', arabicName: 'يوسف', revelationType: 'Meccan', ayahCount: 111 },
  { number: 13, englishName: 'Ar-Rad', arabicName: 'الرعد', revelationType: 'Madinan', ayahCount: 43 },
  { number: 14, englishName: 'Ibrahim', arabicName: 'إبراهيم', revelationType: 'Meccan', ayahCount: 52 },
  { number: 15, englishName: 'Al-Hijr', arabicName: 'الحجر', revelationType: 'Meccan', ayahCount: 99 },
  { number: 16, englishName: 'An-Nahl', arabicName: 'النحل', revelationType: 'Meccan', ayahCount: 128 },
  { number: 17, englishName: 'Al-Isra', arabicName: 'الإسراء', revelationType: 'Meccan', ayahCount: 111 },
  { number: 18, englishName: 'Al-Kahf', arabicName: 'الكهف', revelationType: 'Meccan', ayahCount: 110 },
  { number: 19, englishName: 'Maryam', arabicName: 'مريم', revelationType: 'Meccan', ayahCount: 98 },
  { number: 20, englishName: 'Ta-Ha', arabicName: 'طه', revelationType: 'Meccan', ayahCount: 135 },
];
