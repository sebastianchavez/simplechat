// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyA948Aqw01I9Mf279QGW-G3er5JzE0rXVc",
    authDomain: "tecnochat-7ffbf.firebaseapp.com",
    projectId: "tecnochat-7ffbf",
    storageBucket: "tecnochat-7ffbf.appspot.com",
    messagingSenderId: "330722857405",
    appId: "1:330722857405:web:5180a5cdef11d6991442d4"
  },
  debbug: true,
  apiPush: 'http://192.168.1.85:3000/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
