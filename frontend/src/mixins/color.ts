// color.ts - defines color theme

import { darken, complement, readableColor } from 'polished';

export interface ColorTable {
  [variant: string]: string;
}

export const allColors: ColorTable = (() => {
  const colors: ColorTable = ({
    dark:      '#232323',
    light:     '#efefef',
    primary:   '#f18701',
  });

  colors.darkDarken = darken(0.05, colors.dark);
  colors.lightDarken = darken(0.05, colors.light);
  colors.primaryDarken = darken(0.05, colors.primary);

  colors.primaryComplement = complement(colors.primary);

  return colors;
})();

// Here starts the part where the key does not represent the color
// but instead the variant (theme)
// e.g. dark foreground = white ('cause dark theme)

export const backgroundColors = allColors;

// Based on background
// darkens all the colors on HOVER_DARKEN

const HOVER_DARKEN = 0.2;

export const hoverBackgroundColors = (() => (
  Object.fromEntries(
    Object.entries(backgroundColors)
    .map(([variant, color]) =>
      [variant, darken(HOVER_DARKEN, color)]))
))();

export const foregroundColors = (() => (
  Object.fromEntries(
    Object.entries(backgroundColors)
    .map(([variant, color]) =>
      [variant, readableColor(color)]))
))();


// Here go default implementations for styled components
// using variant property

export interface ColorPickerProps {
  // falling back to light as default
  variant?: string
}

// General color picker
export const colorPicker =
  (colors: ColorTable) =>
    ({ variant }: ColorPickerProps) =>
      (colors[variant || 'light']);

// And then define color pickers
export const background = colorPicker(backgroundColors);  
export const hoverBackground = colorPicker(hoverBackgroundColors);  
export const foreground = colorPicker(foregroundColors);

