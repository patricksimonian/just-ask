import React, { createContext } from 'react';
import defaultContent from '../defaults/config.json';
import { useConfig } from '../utils/hooks';


export const ConfigContext = createContext();

export const ConfigProvider = ({children}) => {
  const [ content,,,error ] = useConfig('/config/config.json', {
    headers: {
      accept: 'application/json'
    }
  })
  const value = content && !error ? {...defaultContent, ...content}: defaultContent 

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
}