// color.ts - defines color theme

import { darken } from 'polished';

export const allColors = ({
  dark:      '#121212',
  light:     '#eeeeee',
  primary:   '#ff9b54',
  secondary: '#f25c54',
});

// Here starts the part where the key does not repsent the color
// but instead the varint (theme)
// e.g. dark foreground = white ('cause dark theme)

export const backgroundColors = ({
  dark:      allColors.dark,
  light:     allColors.light,
  primary:   allColors.primary,
  secondary: allColors.secondary,
});

// Based on background
// darkens all the colors on HOVER_DARKEN

const HOVER_DARKEN = 0.2;

export const hoverBackgroundColors = (() => {
  return (
    Object.fromEntries(
      Object.entries(backgroundColors)
        .map(([variant, color]) =>
          [variant, darken(HOVER_DARKEN, color)]))
  );
})();

export const foregroundColors = ({
  dark:  allColors.light,
  light: allColors.dark,
});

// Here go default implementations for styled components
// using variant property

export interface ColorPickerProps {
  // falling back to light as default
  variant?: string
}

export interface ColorTable {
  [variant: string]: string;
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

