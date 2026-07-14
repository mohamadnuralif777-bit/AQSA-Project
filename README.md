# Quran Reader 📖

An interactive, modern website for reading the Holy Quran with translations, beautiful typography, and smooth navigation.

## 🌟 Features

- ✅ **Complete Quran** - All 114 Surahs with complete verses
- 🔤 **Multiple Translations** - English and other language translations
- 🔊 **Audio Recitations** - Listen to professional Quran recitations
- 🔍 **Search Functionality** - Search verses by keyword or number
- 📌 **Bookmarks** - Save your favorite verses
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Beautiful UI** - Clean, modern interface with Islamic aesthetic
- ⚡ **Fast & Optimized** - Built with Next.js for optimal performance

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **API**: Alquran Cloud API

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps

1. Clone the repository:
```bash
git clone https://github.com/mohamadnuralif777-bit/AQSA-Project.git
cd AQSA-Project
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect it's a Next.js app
5. Click "Deploy"

### Deploy on Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📂 Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── Hero.tsx            # Hero section
│   ├── QuranReader.tsx     # Main reader component
│   ├── SurahSelector.tsx   # Chapter selector
│   ├── VerseDisplay.tsx    # Verse display
│   ├── SearchBox.tsx       # Search functionality
│   ├── BookmarkButton.tsx  # Bookmark feature
│   └── Footer.tsx          # Footer
├── data/
│   └── surahs.ts           # Quran chapters data
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🎯 Usage

1. **Select a Chapter**: Choose from 114 Surahs in the sidebar
2. **Read Verses**: View Arabic text with English translation
3. **Search**: Use the search box to find specific verses
4. **Bookmark**: Click the star icon to save verses
5. **Listen**: Click the audio button to hear the recitation
6. **Share**: Share verses with others using the share button

## 🔗 API Reference

This project uses the [Alquran Cloud API](https://alquran.cloud/api) for Quranic data.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email mohamadnuralif777-bit@gmail.com or open an issue on GitHub.

## 🙏 Acknowledgments

- [Alquran Cloud](https://alquran.cloud/) - For providing the Quran API
- [Next.js](https://nextjs.org/) - For the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework

---

**Made with ❤️ for the Ummah**
