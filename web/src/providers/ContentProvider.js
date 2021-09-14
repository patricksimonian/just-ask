import React, { createContext } from 'react';
import defaultContent from '../defaults/content.json';
import { useConfig } from '../utils/hooks';


export const ContentContext = createContext();

export const ContentProvider = ({children}) => {
  const [ content ] = useConfig('/config/content.json', {
    headers: {
      accept: 'application/json'
    }
  })
  const value = content ? {...defaultContent, ...content}: defaultContent 

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
}