'use client';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search verses..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-600 focus:outline-none transition text-gray-700"
      />
      <p className="text-xs text-gray-500 mt-2">
        💡 Search by keyword or verse number
      </p>
    </div>
  );
}
