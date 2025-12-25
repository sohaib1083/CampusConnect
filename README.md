# CampusConnect 🎓

<div align="center">

**A Modern AI-Powered Campus Assistant Mobile Application**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-54.0.27-black.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-orange.svg)](https://firebase.google.com/)
[![GROQ AI](https://img.shields.io/badge/GROQ%20AI-llama--3.1--8b--instant-green.svg)](https://groq.com/)
[![License](https://img.shields.io/badge/License-0BSD-lightgrey.svg)](LICENSE)

_Empowering students with AI-driven campus information and modern mobile experience_

</div>

---

## 🌟 Overview

CampusConnect is a cutting-edge React Native mobile application designed to revolutionize how students interact with university information systems. Built with modern UI principles and powered by advanced AI technology, it provides an intuitive, responsive interface for accessing campus resources, policies, and getting instant AI-powered assistance.

### ✨ Key Features

🎨 **Modern UI Design**

- Beautiful gradient-based interface with blue/purple theme
- Smooth animations and entrance effects
- Glass-morphism design elements
- Responsive design for all screen sizes

🚀 **Sliding Drawer Navigation**

- Intuitive left-side sliding panel
- Touch-friendly navigation system
- Modern component architecture
- Seamless user experience

🔐 **Secure Authentication**

- Firebase-powered authentication system
- Secure user registration and login
- Protected routes and user sessions
- Production-ready security measures

🤖 **AI-Powered Assistant**

- GROQ AI integration with llama-3.1-8b-instant model
- RAG (Retrieval Augmented Generation) system
- 25+ curated university knowledge items
- Semantic search capabilities

📚 **Comprehensive Knowledge Base**

- Academic policies and procedures
- Registration and enrollment information
- Examination guidelines and schedules
- Student services and support resources
- Campus facilities and amenities

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development on macOS)

### Installation

```bash
# Clone the repository
git clone https://github.com/sohaib1083/CampusConnect.git
cd CampusConnect

# Install dependencies
npm install

# Start the development server
npm start
```

### Environment Setup

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Configure your environment variables:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# GROQ API Configuration
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

3. Start developing:

```bash
npx expo start
```

## � Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development on macOS)

### Installation

```bash
# Clone the repository
git clone https://github.com/sohaib1083/CampusConnect.git
cd CampusConnect

# Install dependencies
npm install

# Start the development server
npm start
```

### Environment Setup

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Configure your environment variables:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# GROQ API Configuration
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

## 🏗️ Architecture

### Technology Stack

- **Frontend Framework**: React Native 0.81.5
- **Development Platform**: Expo SDK 54.0.27
- **Navigation**: Expo Router + React Navigation Drawer
- **Authentication**: Firebase Auth 12.6.0
- **AI Integration**: GROQ API (llama-3.1-8b-instant)
- **Knowledge System**: Custom RAG with semantic search
- **Build System**: EAS Build for production deployment
- **State Management**: React Context API
- **Styling**: Custom Theme system with React Native StyleSheet

### Project Structure

```
CampusConnect/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation screens
│   ├── auth/              # Authentication screens
│   └── _layout.tsx        # Root layout with drawer
├── components/            # Reusable UI components
├── services/              # API and backend services
├── data/                  # Knowledge base and static data
├── contexts/              # React Context providers
├── config/                # Configuration files
├── constants/             # App constants and theme
├── utils/                 # Utility functions
├── assets/                # Images, fonts, and static assets
└── docs/                  # Comprehensive documentation
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm start              # Start Expo development server
npm run android        # Run on Android device/emulator
npm run ios           # Run on iOS device/simulator
npm run web           # Run in web browser

# Building
npx eas build --platform android --profile production  # Build Android APK
npx eas build --platform ios --profile production     # Build iOS IPA
```

### Key Components

- **Authentication Flow**: Secure Firebase-based login/signup
- **Drawer Navigation**: Modern sliding sidebar with navigation
- **AI Chat System**: GROQ-powered conversational interface
- **RAG Knowledge Base**: Semantic search with 25+ university policies
- **Theme System**: Consistent design language throughout app

## 🤖 AI Integration

### GROQ API Integration

- **Model**: llama-3.1-8b-instant
- **Features**: Natural language processing, contextual responses
- **RAG Enhancement**: Retrieval Augmented Generation for accurate university-specific information

### Knowledge Base

- 25+ curated knowledge items covering:
  - Academic policies and procedures
  - Registration and enrollment processes
  - Examination guidelines
  - Student services and support
  - Campus facilities and resources

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) folder:

- [**Setup Guide**](docs/setup.md) - Detailed installation and development setup
- [**Architecture Overview**](docs/architecture.md) - Technical design and project structure
- [**Features & UI**](docs/features.md) - User interface and component documentation
- [**API & Services**](docs/api-services.md) - Backend integration and services
- [**Deployment Guide**](docs/deployment.md) - Production build and deployment process

## 🚀 Deployment

### Building Production APK

```bash
# Configure EAS (one-time setup)
eas build:configure

# Build production APK
eas build --platform android --profile production

# Monitor build progress
eas build:view [build-id]
```

### Environment Configuration

The app uses environment variables for secure configuration. See [Environment Guide](docs/environment.md) for details on:

- Firebase configuration
- GROQ API key setup
- Build-time vs runtime variables
- Security best practices

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/contributing.md) for details on:

- Development workflow
- Code style guidelines
- Pull request process
- Issue reporting

### Development Guidelines

1. Follow React Native and Expo best practices
2. Maintain consistent code style with Prettier/ESLint
3. Write meaningful commit messages
4. Test thoroughly on both platforms
5. Update documentation for new features

## 📄 License

This project is licensed under the **BSD Zero Clause License (0BSD)**. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **Firebase** for robust authentication and backend services
- **GROQ** for cutting-edge AI language model access
- **React Native Community** for extensive libraries and support

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/sohaib1083/CampusConnect/issues)
- **Email**: [sohaib1083@gmail.com](mailto:sohaib1083@gmail.com)

---

<div align="center">

**Built with ❤️ by [Sohaib](https://github.com/sohaib1083)**

_Empowering education through technology_

</div>
