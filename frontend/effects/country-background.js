// Picks the animated background for the opening pages based on country.
//
// 'temple' is the verified Temple Night renderer (procedural Kyoto mountain
// temple after dark, Three.js r149) used for Japan, China, and as the default.
// 'india' is an original Indian temple night scene built for this app.
// Add more country codes here as new scenes are created.

import { startTempleNight } from './temple-night/host.js';
import { startIndiaNight } from './india-night/indiaNight.js';

const THEMES = {
  JP: 'temple',
  CN: 'temple',
  IN: 'india',
};

export function themeForCountry(code) {
  return THEMES[code] || 'temple';
}

// Starts the animated background on a canvas for a country code.
// Returns a function that stops and disposes it.
export function startCountryBackground(canvas, countryCode) {
  if (themeForCountry(countryCode) === 'india') {
    return startIndiaNight(canvas);
  }
  return startTempleNight(canvas) || function () {};
}
