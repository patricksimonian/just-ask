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
  const [ pallete,,, error] = useConfig('/config/pallete.json', {
    headers: {
      accept: 'application/json'
    }
  })

  const [colors, setColors] = useState({...defaultCreatedPallete,
    primaryText: Color(defaultCreatedPallete.primary).isDark() ? defaultCreatedPallete.white : defaultCreatedPallete.text,
    secondaryText: Color(defaultCreatedPallete.secondary).isDark() ? defaultCreatedPallete.white : defaultCreatedPallete.text,
  });

  useEffect(() => {
    if(pallete && !error) {

      setColors({
        ...defaultCreatedPallete, 
        ...pallete, 
        primaryText: Color(pallete.primary).isDark() ? defaultCreatedPallete.white : defaultCreatedPallete.text,
        secondaryText: Color(pallete.secondary).isDark() ? defaultCreatedPallete.white : defaultCreatedPallete.text,
      })
      console.log('created colors', {...defaultCreatedPallete, ...pallete})
    }
  }, [error, pallete])

    console.log('colors', colors)

 return (
    <ThemeProvider theme={{
        ...baseTheme, 
        colors
      }}>
      {children}
    </ThemeProvider>
  )

  

    
}