# Campus Connect - University Chatbot App

A comprehensive mobile application for university students built with React Native, Expo, and AI-powered chatbot functionality.

## 🎯 Features

### Core Features
- **AI Chatbot Assistant**: Get instant answers to campus-related questions 24/7
- **Course Information**: Browse and search all available courses
- **Events Calendar**: Stay updated on campus events and activities
- **Campus Map**: Navigate facilities and locations
- **Departments Directory**: Find contact information for all departments
- **User Profile**: Manage your student account and preferences

### Technical Features
- React Native with Expo for cross-platform development
- Expo Router for file-based navigation
- TypeScript for type safety
- Dark mode support
- Offline-first architecture (planned)
- Push notifications (planned)

## 📱 Screenshots

(Add screenshots here)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd campus-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API endpoints and keys.

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator

## 🏗️ Project Structure

```
campus-connect/
├── app/                    # App screens using Expo Router
│   ├── (tabs)/            # Main tab navigation
│   │   ├── index.tsx      # Chat screen
│   │   ├── explore.tsx    # Explore screen
│   │   └── profile.tsx    # Profile screen
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── onboarding.tsx
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── QuickActions.tsx
│   ├── CategoryCard.tsx
│   ├── SearchBar.tsx
│   ├── LoadingState.tsx
│   └── EmptyState.tsx
├── contexts/              # React Context providers
│   ├── AuthContext.tsx
│   └── ChatContext.tsx
├── services/              # API services
│   ├── api.ts
│   ├── authService.ts
│   ├── chatService.ts
│   └── universityService.ts
├── utils/                 # Utility functions
│   ├── dateUtils.ts
│   ├── validation.ts
│   └── storage.ts
├── constants/            # App constants
│   └── Colors.ts
└── assets/               # Images, fonts, etc.
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
EXPO_PUBLIC_API_URL=https://your-api-url.com/api
EXPO_PUBLIC_UNIVERSITY_DOMAIN=university.edu
```

### Customization

1. **Brand Colors**: Edit `constants/Colors.ts`
2. **University Domain**: Update validation in `utils/validation.ts`
3. **API Endpoints**: Configure in `services/api.ts`

## 📦 Key Dependencies

- **expo**: Framework for React Native apps
- **expo-router**: File-based routing
- **react-native-gifted-chat**: Chat UI components
- **axios**: HTTP client
- **@react-native-async-storage/async-storage**: Local storage

## 🔌 API Integration

### Backend Requirements

Your backend API should provide these endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/verify` - Token verification

#### Chat
- `POST /chat/message` - Send message to chatbot
- `GET /chat/history/:userId` - Get chat history
- `POST /chat/save` - Save chat message
- `DELETE /chat/history/:userId` - Clear history

#### University Data
- `GET /courses` - Get all courses
- `GET /events` - Get events
- `GET /departments` - Get departments
- `GET /facilities` - Get campus facilities
- `GET /search` - Global search

### Chatbot Integration

The app is designed to work with various AI backends:
- OpenAI GPT
- Custom trained models
- University-specific chatbots

Configure your chatbot service in `services/chatService.ts`.

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linter
npm run lint
```

## 📱 Building for Production

### Android
```bash
npm run android
eas build --platform android
```

### iOS
```bash
npm run ios
eas build --platform ios
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the 0BSD License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React Native community
- Expo team
- University IT department

## 📞 Support

For support, email support@university.edu or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Offline mode support
- [ ] Push notifications for events
- [ ] Calendar integration
- [ ] Course registration
- [ ] Grade tracking
- [ ] Library integration
- [ ] Meal plan tracking
- [ ] Study group finder
- [ ] Document scanner
- [ ] AR campus tour
