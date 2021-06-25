import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { baseTheme } from '../theme';
import { luminosities } from '../defaults/theme.json';
import defaultPallete from '../defaults/pallete.json';

import { createPalette } from '../utils/colors';
import { useConfig } from '../utils/hooks';
import Color from 'color';
const defaultCreatedPallete = createPalette(defaultPallete, luminosities);

export const DynamicThemeProvider = ({children}) => {
  const [ palette, fetched, error] = useConfig('/config/pallete.json')
  const [colors, setColors] = useState({...defaultCreatedPallete,
    primaryText: Color(defaultCreatedPallete.primary).isDark() ? defaultCreatedPallete.white : defaultCreatedPallete.text,
    secondaryText: Color(defaultCreatedPallete.secondary).isDark() ? defaultCreatedPallete.white : defaultCreatedPallete.text,
  });

  useEffect(() => {
    if(fetched && palette && !error) {

      setColors({...defaultCreatedPallete, ...palette, primaryText: Color(palette.primary).isDark() ? defaultCreatedPallete.white : defaultCreatedPallete.text,

        secondaryText: Color(palette.secondary).isDark() ? defaultCreatedPallete.white : defaultCreatedPallete.text })
    }
  }, [error, fetched, palette])


 return (
    <ThemeProvider theme={{
        ...baseTheme, 
        colors
      }}>
      {children}
    </ThemeProvider>
  )

  

    
}