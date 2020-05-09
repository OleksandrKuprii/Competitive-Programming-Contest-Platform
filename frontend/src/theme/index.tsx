import theme from 'styled-theming';
import { darken } from 'polished';

export const background = theme('mode', {
  dark: '#121212',
});

export const foreground = theme('mode', {
  dark: '#eee',
});

export const color = theme.variants('mode', 'variant', {
  primary: { dark: '#e76f51' },
  danger: { dark: '#f94144' },
  warning: { dark: '#f3722c' },
  success: { dark: '#90be6d' },
  dark: { dark: '#212121' },
  grey: { dark: '#555' },
});

export const hoverColor = theme.variants('mode', 'variant', {
  primary: { dark: darken(0.1, '#e76f51') },

  danger: { dark: darken(0.1, '#f94144') },

  dark: { dark: darken(0.2, '#212121') },
  grey: { dark: darken(0.2, '#555') },
});
