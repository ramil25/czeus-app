# czeus (Expo React Native)

This is an Expo React Native project created with create-expo-app.

## 🚀 Quick Start

### 1. Setup Environment Variables (Required)

⚠️ **Important**: Copy the environment file before running the app to avoid demo mode fallback.

```bash
# Copy the environment configuration
cp .env.example .env
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the App

```bash
npx expo start
```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## 📱 Features

This app includes a complete user management system with:

- **Users List**: Browse all users with search and filtering
- **Add User**: Create new users with role assignment  
- **User Details**: View detailed user information
- **Edit User**: Update user profiles
- **Supabase Integration**: Real-time database connectivity

## 🔧 Configuration

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed environment configuration instructions.

## 🧪 Testing

Run the test suite to verify functionality:

```bash
node test/test-user-management.js
```

---

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
