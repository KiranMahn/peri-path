# Welcome to Peri Path 👋

## Get started
1. Clone this project 

2. cd into this project 

3. Install dependencies

   ```bash
   npm install
   ```

4. Start the app

   ```bash
    npm start
   ```
5. Install the expo app on your mobile device 

6. Scan the QR code with your phone and the project will open in the expo app

## Project Stucture 
```
── README.md
├── TODO.md
├── __mocks__ **A pretend async storage used for testing**
│   └── @react-native-async-storage
│       └── async-storage.js
├── app
│   ├── (tabs) **Each screen in the app**
│   │   ├── analysis.js
│   │   ├── calendar.js
│   │   ├── home.tsx
│   │   ├── learn.js
│   │   ├── profile.js
│   │   ├── settings.js
│   │   └── track.js
│   ├── +not-found.tsx
│   ├── _layout.tsx **The root of the app where navigation and screen headers are defined**
│   ├── settings-context.tsx **Defined and handles the switching of user settings like large text or high contrast**
│   └── widgets **reusable stylised components** 
│       ├── TabButton.js
│       ├── TableRow.js
│       ├── analysis 
│       │   ├── analysis-wigi.tsx
│       │   ├── cycle-length.js
│       │   ├── getLastPeriodStartDate.ts
│       │   ├── last-period.tsx
│       │   ├── most-common-symptom.tsx
│       │   ├── period-chart.js
│       │   ├── period-length.js
│       │   └── symptom-chart.js
│       ├── calendar
│       │   ├── day-box.js
│       │   ├── month.js
│       │   └── two-week.js
│       ├── nav.tsx
│       └── track
│           ├── MostCommon.js
│           ├── PeriodSquare.js
│           └── Slider.js
├── app.css
├── app.json
├── articles.json **The articles used in learn**
├── articles.schema.json
├── assets
│   ├── fonts
│   │   └── SpaceMono-Regular.ttf
│   └── images
│       ├── adaptive-icon.png
│       ├── favicon.png
│       ├── icon.png
│       ├── partial-react-logo.png
│       ├── react-logo.png
│       ├── react-logo@2x.png
│       ├── react-logo@3x.png
│       └── splash-icon.png
├── components
│   ├── __tests__ **All the JEST Tests**
│   │   ├── Analysis-test.tsx
│   │   ├── Calendar-test.tsx
│   │   ├── Home-test.tsx
│   │   ├── Learn-test.tsx
│   │   ├── MostCommon-test.tsx
│   │   ├── PeriodSquare-test.tsx
│   │   ├── Slider-test.tsx
│   │   ├── TabButton-test.tsx
│   │   ├── Track-test.tsx
│   │   ├── TwoWeek-test.tsx
│   │   └── __snapshots__
│   │       └── TabButton-test.tsx.snap
│   └── setup **Testing setup definitions and specifications** 
│       └── jest.setup.js
├── eas.json
├── expo-env.d.ts
├── package-lock.json
├── package.json **Defines versions of packages used and dependencies** 
├── symptoms.json **List of symptoms used throughout the app** 
├── symptoms.schema.json
├── tsconfig.json
└── userdata.schema.json 
```

## Tests 
Run `jest` in the root of the project to run the tests which are located in `components/__tests__`. The mocked components are in `__mocks__/` and the setup for JEST testing is defined in `components/setup/jest.setup.js`

