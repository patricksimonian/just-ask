import React, { useEffect, useState } from "react"
import {   Flex,Image,Text } from "rebass";
import robot from '../images/robot.png';
export const Initialization = () => {
  const [display, setDisplay] = useState(true);
  const [destroy, setDestroy] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDisplay(false);
    }, 1100)
  })

  useEffect(() => {
    if(!display) {
      setTimeout(() => {
        setDestroy(true);
      }, 400);
    }
  }, [display])

  return destroy ? null : (
    <Flex sx={{
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: '#fff',
      opacity: display ? 1 : 0,
      filter: display ? 'blur(0px)': 'blur(3px)',
      zIndex: 1,
      transition: 'all .3s ease-in-out',
    }} alignItems="center" justifyContent="center" flexDirection="column">
      <Text color="#2e2e2e" fontSize="45px">Just Ask!</Text>
      <Image width={[80, 80, 200 ]} src={robot} alt="Just Ask!" />
      <Text color="#2e2e2e" fontSize="23px">Just Setting Things Up..</Text>
  
    </Flex>
  )
}