import { Hct } from "@material/material-color-utilities";
import fs from 'fs'; // Import fs module to write to file

// Function to convert HEX to RGB
function hexToRgb(hex) {
  // Remove the '#' character if present
  hex = hex.replace('#', '');
  // Parse RGB values from HEX string
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

// Function to convert RGB to HCT
function rgbToHct(r, g, b) {
  const rgbInt = (r << 16) | (g << 8) | b;
  const color = Hct.fromInt(rgbInt);

  const hue = color.hue;
  const chroma = color.chroma;
  const tone = color.tone;

  return { hue, chroma, tone };
}

// Function to convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Function to convert HCT to HEX
function hctToHex(hue, chroma, tone) {
  const color = Hct.from(hue, chroma, tone);
  const rgbInt = color.toInt();

  // Convert RGB to hex and ensure it’s 6 digits
  let hex = rgbInt.toString(16).padStart(6, '0');
  hex = hex.substring(2,8)
  return `${hex}`; // Ensure the result starts with a '#'
}

// Function to get HCT for different tones
function getHctForTones(hexInput) {
  // Convert HEX to RGB
  const { r, g, b } = hexToRgb(hexInput);

  // Get HCT values (initial H, C, and T)
  const { hue, chroma } = rgbToHct(r, g, b);

  // For each tone from 5 to 90, increment by 5
  let result = {};
  for (let tone = 5; tone <= 95; tone += 5) {
    const hex = hctToHex(hue, chroma, tone);
    result[tone] = hex;  // Store hex with tone as the key
  }

  return result;
}

// Input HEX value(s) (you can input a single HEX value or an array of HEX values)
const hexInputs = ['#5540BF']; // Example HEX values in an array

// Prepare an object to store all results
let allResults = {};

hexInputs.forEach((hexInput) => {
  console.log(`Processing HEX: ${hexInput}`);
  const hctResults = getHctForTones(hexInput);

  // Store the results in the allResults object with tone as key
  allResults[hexInput] = hctResults;
});

// Convert the results to JSON
const jsonResult = JSON.stringify(allResults, null, 2);

// Write the JSON to a file
fs.writeFile('colorConversions.json', jsonResult, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('Results saved to colorConversions.json');
  }
});
