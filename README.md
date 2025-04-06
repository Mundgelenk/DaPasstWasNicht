This is a project we are working on that should make it very easy to report issues no matter if you are in a company, outside or at home. So far we have a general idea of how it should look and what features it will include.

The project will begin with a set of basic features and once these are implemented we can work on the more advanced features. I want to use Expo Go to test the app along the go as it worked well in older projects and I plan to use the React Native framework for the frontend.

Basic features should include:
	•	Startup Screen:
An engaging splash screen with an animated illustration of a building undergoing repairs and a progress bar. It directs users to either the registration page if they are not logged in or directly to the home screen if they are.
	•	Log In and Registration Screen:
A minimal design with ample white space that features clearly labeled fields for email and password. Users have the option to create a new account or sign in using Google. The clean layout ensures that users can easily register or log in.
	•	Home Screen:
The central hub of the app where users can access all features. This screen features a clear and intuitive layout with a prominent button for reporting an issue by taking a photo. Future functionalities are hinted at on this screen to provide a seamless transition as the app evolves.
	•	Photo Screen:
A Snapchat-like camera interface that allows users to capture a photo. The screen offers a full-screen camera preview and a large circular shutter button at the bottom to keep the experience simple and distraction free.
	•	After Photo Screen:
Once a photo is taken, this screen displays a small preview of the image along with the location where it was captured. It includes a text field for adding a detailed description of the issue and buttons for retaking the photo or sending the report.

Future features include:


	•	Payment Integration:
The possibility to connect PayPal or any kind of banking details so that users receive a reward from the party that reported the issue. This adds motivation to report problems.
	•	Multi-Level Issue Management:
A system that manages private, city wide and company issues. For example, if a lamp is broken in your home or if there is a problem in a restaurant you are sitting in, the app can use the photo’s location data to determine the most likely entity. Businesses will have an account for receiving these reports and can respond by sending money, coupons or other rewards.

Overall the app is designed to empower users to quickly and efficiently report problems wherever they are. Its clean modern design and intuitive navigation guide users step by step from capturing a photo to submitting a detailed report. This solid foundation will not only improve problem reporting but will also pave the way for future enhancements that reward proactive reporting.

flowchart TD
    A[Startup Screen] -->|If not logged in| B[Register]
    A -->|If logged in| D[Home Screen]

    B -->|Submit registration| F[Login]
    F -->|Login successful| D

    D -->|Report issue| C[Camera]
    C -->|Take photo| E[After Photo]
    E -->|Submit report| G[Send]

    C -->|Back| D


The github is https://github.com/Mundgelenk/DaPasstWasNicht 
the folder structure should be similar to : /project-root
├── /assets
│   ├── /images               # All static images (icons, logos, etc.)
│   │   ├── logo.png
│   │   ├── splash.gif
│   │   └── background.jpg
│   └── /fonts                # Custom fonts if used
│       ├── Roboto-Regular.ttf
│       └── Roboto-Bold.ttf
│
├── /src
│   ├── /components           # Reusable UI components (buttons, headers, etc.)
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   └── Card.tsx
│   │
│   ├── /screens              # Each major view gets its own folder
│   │   ├── /StartupScreen
│   │   │   ├── StartupScreen.tsx
│   │   │   └── StartupScreen.styles.ts
│   │   ├── /LoginScreen
│   │   │   ├── LoginScreen.tsx
│   │   │   └── LoginScreen.styles.ts
│   │   ├── /HomeScreen
│   │   │   ├── HomeScreen.tsx
│   │   │   └── HomeScreen.styles.ts
│   │   ├── /PhotoScreen
│   │   │   ├── PhotoScreen.tsx
│   │   │   └── PhotoScreen.styles.ts
│   │   └── /AfterPhotoScreen
│   │       ├── AfterPhotoScreen.tsx
│   │       └── AfterPhotoScreen.styles.ts
│   │
│   ├── /navigation           # Navigation setup (e.g., stack, tab, drawer)
│   │   ├── AppNavigator.tsx
│   │   └── routes.ts
│   │
│   ├── /services             # API calls, authentication, backend integration
│   │   ├── firebase.ts       // Firebase configuration and initialization
│   │   ├── authService.ts    // Firebase auth methods
│   │   └── reportService.ts  // Methods for handling issue reports
│   │
│   ├── /constants            # App-wide constants (colors, font sizes, etc.)
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   └── index.ts
│   │
│   ├── /utils                # Helper functions and utilities
│   │   ├── helpers.ts
│   │   └── validation.ts
│   │
│   └── /store                # State management (Redux slices or Context providers)
│       ├── index.ts          // Store configuration
│       ├── rootReducer.ts
│       └── slices
│           ├── userSlice.ts
│           └── reportSlice.ts
│
├── /server                   # (Optional) Custom backend code if needed
│   ├── /api                  # Express (or other framework) routes and controllers
│   │   ├── index.js
│   │   └── reports.js
│   │
│   ├── /models               # Database models/schemas (if using a custom backend)
│   │   ├── reportModel.js
│   │   └── userModel.js
│   │
│   └── /controllers          # Business logic for handling requests
│       ├── reportController.js
│       └── userController.js
│
├── app.json                  # Expo configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation