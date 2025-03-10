import { Hct } from "@material/material-color-utilities";

// Function to convert RGB to HCT
function rgbToHct(r, g, b) {
  // Convert RGB to integer format
  const rgbInt = (r << 16) | (g << 8) | b;
  const color = Hct.fromInt(rgbInt);

  // Extract HCT values
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
    l: Math.round(l * 100)
  };
}

// Example input RGB values
const r = 6, g = 137, b = 63; // RGB values for #4285F4

// Get HCT and HSL
const hct = rgbToHct(r, g, b);
const hsl = rgbToHsl(r, g, b);

// Output the results
console.log(`RGB: (${r}, ${g}, ${b})`);
console.log(`HCT - Hue: ${hct.hue}, Chroma: ${hct.chroma}, Tone: ${hct.tone}`);
console.log(`HSL - Hue: ${hsl.h}, Saturation: ${hsl.s}%, Lightness: ${hsl.l}%`);
