import React, {useState, useEffect} from 'react';
import { ThemeProvider } from 'emotion-theming';
import { baseTheme } from '../theme';
import { luminosities } from '../defaults/theme.json';
import defaultPallete from '../defaults/pallete.json';
import axios from 'axios';
import { createPalette } from '../utils/colors';

const defaultCreatedPallete = createPalette(defaultPallete, luminosities);

export const DynamicThemeProvider = ({children}) => {
  const [palette, setPalette] = useState(null);
  const [ fetched, setFetched ] = useState(false)
  useEffect(() => {
    if(!palette && !fetched) {
      axios.get('/config/pallete.json', {headers: {
        'Content-Type': 'application/json'
      }}).then(response => {
        setPalette(response.data);
      }).catch(e => {
        console.warn('Unable to fetch custom color palette. Using default');
        setPalette(defaultPallete);
      })
      .finally(() => setFetched(true));
    }
  }, [palette, fetched]);

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