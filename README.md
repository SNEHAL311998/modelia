# 🎨 AI Studio - Modelia

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4)](https://tailwindcss.com/)

A modern, professional AI image generation studio built with Next.js, React, and TypeScript. Upload images, configure prompts with various artistic styles, and generate stunning AI-powered results with an intuitive, accessible interface.

![AI Studio Demo](https://via.placeholder.com/800x400/1f2937/ffffff?text=AI+Studio+Interface)

## ✨ Features

### 🖼️ **Intelligent Image Management**
- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **Format Support**: PNG and JPG files up to 10MB
- **Auto-Compression**: Client-side image optimization to ≤1920px
- **Dual Preview System**: Separate containers for uploaded and generated images
- **Independent Workflows**: Upload and generation previews work independently

### 🎨 **Advanced Configuration**
- **Smart Prompt Input**: 500-character limit with real-time counter
- **5 Artistic Styles**: Editorial, Streetwear, Vintage, Minimalist, Abstract
- **Live Summary**: Real-time configuration preview before generation
- **Form Auto-Clear**: Clean slate after successful generation

### ⚡ **Robust Generation Engine**
- **Mock API Simulation**: Realistic 1-2 second generation delays
- **Error Handling**: 20% error rate simulation with retry logic
- **Exponential Backoff**: Smart retry system (max 3 attempts)
- **Abort Functionality**: Cancel in-flight requests anytime
- **Loading States**: Professional progress indicators

### 📚 **Smart History Management**
- **Local Storage**: Persistent history across browser sessions
- **Last 5 Generations**: Automatic cleanup of old generations
- **Click to Restore**: Instant preview of previous generations
- **Visual Indicators**: Latest generation highlighting
- **Batch Operations**: Clear all history with one click

### ♿ **Accessibility First**
- **Keyboard Navigation**: Full app navigation without mouse
- **Screen Reader Support**: Comprehensive ARIA labels and descriptions
- **Focus Management**: Visible focus states throughout
- **Semantic HTML**: Proper heading hierarchy and landmarks

### 🎨 **Modern UI/UX**
- **Dark Mode**: Automatic system preference detection
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Professional Styling**: Clean, modern interface with TailwindCSS
- **Error Boundaries**: Graceful error handling and recovery
- **Loading States**: Smooth transitions and progress feedback

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd modelia-asignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Production Build
```bash
npm run build
npm start
```

## 📱 How to Use

### 1. **Upload Your Image**
- Drag and drop an image file or click to browse
- Supports PNG/JPG files up to 10MB
- Images are automatically compressed for optimal performance

### 2. **Configure Your Generation**
- Enter a descriptive prompt (up to 500 characters)
- Select from 5 artistic styles
- Review your configuration in the live summary

### 3. **Generate & Explore**
- Click "Generate Image" to create your AI artwork
- View results in the dedicated generated image container
- Browse your generation history anytime

### 4. **Manage Your Work**
- Generated images are saved automatically
- Click any history item to preview again
- Clear history when needed

## 🏗️ Architecture

### **Tech Stack**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: TailwindCSS 4.0
- **State Management**: React useState with optimized callbacks
- **Storage**: Browser localStorage
- **Image Handling**: Next.js Image component with remote patterns

### **Project Structure**
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ErrorBoundary.tsx  # Error handling wrapper
│   ├── GenerationHistory.tsx # History management
│   ├── ImagePreview.tsx   # Image display component
│   ├── ImageUpload.tsx    # File upload handling
│   ├── LoadingSpinner.tsx # Loading indicators
│   ├── PromptInput.tsx    # Text input with validation
│   └── StyleSelector.tsx  # Style selection interface
├── types/                 # TypeScript type definitions
│   └── index.ts          # Shared interfaces
└── utils/                # Utility functions
    ├── api.ts            # Mock API with retry logic
    ├── imageUtils.ts     # Image processing utilities
    └── localStorage.ts   # Data persistence
```

### **Key Design Patterns**
- **Component Composition**: Modular, reusable components
- **Custom Hooks**: Optimized state management with useCallback
- **Error Boundaries**: Fault-tolerant UI with graceful degradation
- **Responsive Design**: Mobile-first approach with progressive enhancement

## 🔧 Configuration

### **Environment Setup**
The application works out of the box with no additional configuration required.

### **Image Domains**
External images are configured in `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'picsum.photos',
      pathname: '/**',
    },
  ],
}
```

### **Mock API Configuration**
Located in `src/utils/api.ts`:
- **Delay**: 1-2 seconds (configurable)
- **Error Rate**: 20% (configurable)
- **Retry Logic**: Exponential backoff with max 3 attempts

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] Upload different image formats and sizes
- [ ] Test drag and drop functionality
- [ ] Verify prompt character limit
- [ ] Test all style options
- [ ] Generate images and verify history
- [ ] Test abort functionality during generation
- [ ] Verify error handling and retry logic
- [ ] Test keyboard navigation
- [ ] Check responsive design on mobile/tablet
- [ ] Verify dark mode functionality

### **Accessibility Testing**
- [ ] Screen reader compatibility
- [ ] Keyboard-only navigation
- [ ] Focus management
- [ ] Color contrast ratios
- [ ] ARIA label accuracy

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Static Export**
```bash
npm run build
npm run export
```

## 🔮 Future Enhancements

### **Planned Features**
- [ ] **Real AI Integration**: Connect to actual AI image generation APIs
- [ ] **User Accounts**: Save generations across devices
- [ ] **Advanced Filters**: More style options and parameters
- [ ] **Batch Processing**: Generate multiple variations
- [ ] **Social Sharing**: Share generations directly to social media
- [ ] **Export Options**: Download in various formats and resolutions

### **Technical Improvements**
- [ ] **Progressive Web App**: Offline functionality
- [ ] **Image Optimization**: WebP format support
- [ ] **Performance**: Implement virtual scrolling for large histories
- [ ] **Testing**: Unit and integration test suite
- [ ] **Analytics**: Usage tracking and performance monitoring

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Use TypeScript for all new code
- Follow the existing component patterns
- Ensure accessibility compliance
- Add proper error handling
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the excellent framework
- **Tailwind CSS** for the utility-first styling approach
- **Picsum Photos** for placeholder images in development
- **React Team** for the component architecture

## 📞 Support

For support, please open an issue on GitHub or contact our development team.

---

**Built with ❤️ by the Modelia Team**

*AI Studio - Where creativity meets artificial intelligence*