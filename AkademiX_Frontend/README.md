# AkademiX Mobile App

AkademiX is a mobile platform designed for academics and university students to share and discover academic publications, connect with peers, and engage in meaningful discussions.

## Features

- User authentication (login/register)
- Profile management
- Publication creation and viewing
- Like and comment on publications
- Follow other users
- Search publications
- View publication statistics

## Tech Stack

- React Native with Expo
- TypeScript
- React Navigation
- Axios for API calls
- AsyncStorage for local storage

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/akademix.git
cd akademix/AkademiX_Frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
src/
├── components/     # Reusable UI components
├── navigation/     # Navigation configuration
├── screens/        # Screen components
│   ├── auth/      # Authentication screens
│   └── main/      # Main app screens
├── services/      # API services
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 