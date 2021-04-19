import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { baseTheme } from '../theme';
import { luminosities } from '../defaults/theme.json';
import defaultPallete from '../defaults/pallete.json';

import { createPalette } from '../utils/colors';
import { useConfig } from '../utils/hooks';

const defaultCreatedPallete = createPalette(defaultPallete, luminosities);

export const DynamicThemeProvider = ({children}) => {
  const [ palette, fetched] = useConfig('/config/pallete.json')
  
  const content = fetched ? (
    <ThemeProvider theme={{
        ...baseTheme, 
        colors: palette ? createPalette(palette, luminosities) : defaultCreatedPallete
      }}>
      {children}
    </ThemeProvider>
  ) : children

  
  return content
    
}