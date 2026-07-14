'use client';

import { useState, useEffect } from 'react';
import SurahSelector from './SurahSelector';
import VerseDisplay from './VerseDisplay';
import SearchBox from './SearchBox';

interface Verse {
  number: number;
  text: string;
  translation: string;
  surah: number;
}

export default function QuranReader() {
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchVerses(selectedSurah);
  }, [selectedSurah]);

  const fetchVerses = async (surah: number) => {
    setLoading(true);
    try {
      // Using Alquran API
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/en.sahih`);
      const data = await response.json();
      
      if (data.data && data.data.ayahs) {
        const formattedVerses: Verse[] = data.data.ayahs.map((ayah: any) => ({
          number: ayah.numberInSurah,
          text: ayah.text,
          translation: ayah.numberInSurah.toString(),
          surah: surah,
        }));
        setVerses(formattedVerses);
      }
    } catch (error) {
      console.error('Error fetching verses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVerses = verses.filter(
    (verse) =>
      verse.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verse.number.toString().includes(searchQuery)
  );

  return (
    <section id="reader" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-green-800 mb-12">
          Quran Reader
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SearchBox value={searchQuery} onChange={setSearchQuery} />
            <SurahSelector selectedSurah={selectedSurah} onChange={setSelectedSurah} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="text-gray-600 mt-4">Loading verses...</p>
              </div>
            ) : (
              <VerseDisplay verses={filteredVerses} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
