# Goodnight, Human Race �

An AI-powered storytelling app that explains complex topics through whimsical bedtime stories featuring construction vehicles. Inspired by "Goodnight, Goodnight, Construction Site," this app uses Google's Gemini AI to generate both narrative text and cute illustrations to make learning fun and engaging.

## ✨ Features

- **AI-Generated Stories**: Explains complex topics (neural networks, black holes, quantum physics, etc.) using construction vehicle metaphors
- **Custom Illustrations**: Each story segment comes with AI-generated minimal black ink illustrations of construction vehicles
- **Interactive Examples**: Click on example prompts or enter your own topics
- **Slideshow Format**: Stories are presented as engaging slides with text and images
- **Real-time Generation**: Watch your story unfold in real-time as the AI creates it
- **Bedtime Story Format**: Stories follow the pattern of vehicles working hard during the day and settling down for bedtime

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd goodnight-human-race
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🎯 How to Use

1. **Try the examples**: Click on any of the pre-written example prompts
2. **Enter your own topic**: Type any complex topic you'd like explained in the text area
3. **Press Enter**: Watch as the AI generates a story with tiny cat metaphors
4. **Enjoy the slideshow**: Each story segment appears with a cute illustration

### Example Topics

- "Explain how neural networks work"
- "Explain how The Matrix works"
- "Explain how spaghettification works"
- "Explain quantum entanglement"
- "Explain how cryptocurrency works"

## 🛠 Development

### Project Structure

```
├── index.html          # Main HTML file
├── index.tsx           # Main TypeScript/React logic
├── index.css           # Styling
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite build configuration
└── docs/               # Project documentation
    ├── PRD.md          # Product Requirements Document
    └── rules/          # Development guidelines
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Technology Stack

- **Frontend**: TypeScript, Vite
- **AI Integration**: Google Gemini AI (text + image generation)
- **Styling**: CSS
- **Markdown**: Marked.js for text formatting

## 🔮 Future Enhancements

See [docs/PRD.md](docs/PRD.md) for detailed roadmap including:

- **Custom Themes**: Beyond tiny cats (cute monsters, naughty sledgehammers, etc.)
- **Story Persistence**: Save and revisit generated stories
- **Personal API Keys**: Use your own Gemini API key
- **Sound Effects**: Background music and sound effects
- **Google Cloud Integration**: Firestore for storage, Firebase Auth

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the Apache 2.0 License - see the license header in source files for details.

## 🐛 Troubleshooting

### Common Issues

**"API key not found" error**
- Make sure you've created a `.env.local` file with your Gemini API key
- Verify your API key is valid at [Google AI Studio](https://aistudio.google.com/)

**Stories not generating**
- Check your internet connection
- Verify your Gemini API key has sufficient quota
- Check the browser console for error messages

**Images not displaying**
- Ensure your Gemini API key has image generation permissions
- Try refreshing the page and generating a new story

---

Made with ❤️ and lots of tiny cats 🐱
