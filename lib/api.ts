// lib/api.ts

const QURAN_API_BASE = 'https://api.alquran.cloud/v1';

export interface AyahData {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajdah: boolean;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Madinan';
  ayahs: AyahData[];
}

export interface QuranResponse<T> {
  code: number;
  status: string;
  data: T;
}

export async function fetchSurah(surahNumber: number, translation: string = 'en.sahih'): Promise<SurahData> {
  try {
    const response = await fetch(`${QURAN_API_BASE}/surah/${surahNumber}/${translation}`);
    if (!response.ok) throw new Error('Failed to fetch Surah');
    const data: QuranResponse<SurahData> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Surah:', error);
    throw error;
  }
}

export async function fetchAllSurahs(): Promise<SurahData[]> {
  try {
    const response = await fetch(`${QURAN_API_BASE}/quran/chapters`);
    if (!response.ok) throw new Error('Failed to fetch Surahs');
    const data: QuranResponse<SurahData[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching all Surahs:', error);
    throw error;
  }
}

export async function searchVerses(query: string): Promise<AyahData[]> {
  try {
    const response = await fetch(`${QURAN_API_BASE}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search');
    const data = await response.json();
    return data.data?.ayahs || [];
  } catch (error) {
    console.error('Error searching verses:', error);
    throw error;
  }
}
