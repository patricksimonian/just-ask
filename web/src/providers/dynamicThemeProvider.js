import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { baseTheme } from '../theme';
import { luminosities } from '../defaults/theme.json';
import defaultPallete from '../defaults/pallete.json';

import { createPalette } from '../utils/colors';
import { useConfig } from '../utils/hooks';
import Color from 'color';
const defaultCreatedPallete = createPalette(defaultPallete, luminosities);

export const DynamicThemeProvider = ({children}) => {
  const [ palette, fetched] = useConfig('/config/pallete.json')
  let primaryText = '#fff';
  let secondaryText  = '#000';
  if(fetched && palette) {
    console.log(palette);
     primaryText = Color(palette.primary).isDark ? defaultCreatedPallete.white : defaultCreatedPallete.text;
     secondaryText = Color(palette.secondary).isDark ? defaultCreatedPallete.white : defaultCreatedPallete.text;

  }
 return (
    <ThemeProvider theme={{
        ...baseTheme, 
        colors: {...defaultCreatedPallete, ...palette, primaryText, secondaryText}
      }}>
      {children}
    </ThemeProvider>
  )

  

    
}