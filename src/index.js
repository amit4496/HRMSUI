import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";
import { getMessaging } from 'firebase/messaging';
import { basename } from './config/paths';

const firebaseConfig = {
  apiKey: "AIzaSyB51UpROKbFDiEnPtrsuaMYlKSqCBJlImg",
  authDomain: "hrmsreact.firebaseapp.com",
  projectId: "hrmsreact",
  storageBucket: "hrmsreact.appspot.com",
  messagingSenderId: "179429612820",
  appId: "1:179429612820:web:2774125953e1b2456df601"
};

firebase.initializeApp(firebaseConfig);
const messaging = getMessaging();

ReactDOM.render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('src\firebase-messaging-sw.js', { type: 'module' })
      .then((registration) => {
        messaging.useServiceWorker(registration);
        console.log('Service worker registered:', registration);
      })
      .catch((error) => {
        console.error('Error registering service worker:', error);
      });
  });
}
