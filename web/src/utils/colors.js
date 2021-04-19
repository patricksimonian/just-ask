// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
/**
 * utility to lighten or darken a hex code color. Important for theming
 * @param {String} color #FFFFF
 * @param {Number} percent whole integer value out of 100. eg: -13, 14, 33
 * @returns {String} the new hex code
 */
export const shadeColor = (color, percent) => {

  var R = parseInt(color.substring(1,3),16);
  var G = parseInt(color.substring(3,5),16);
  var B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;  

  var RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16));
  var GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16));
  var BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
}


/**
 * generates the complete color palette given a base palette and an array of luminosities
 * this matches the theme-ui spec for color modes
 * https://theme-ui.com/color-modes
 * @param {Object} colors { base: {...rgbcolors }, primary, secondary } all values must be hex codes
 * @param {Object} luminosities a map of luminosities {name: Number}
 */
export const createPalette = (colors, luminosities) => {

  const pallete = Object.keys(colors).reduce((palette, colorName) => {
    const hexCode = colors[colorName];
    
    palette[colorName] = hexCode;
    // allows for rebass componenst to acccess shades of a color using dot props
    // color="light.blue" color="very-light.blue"
    // see theme.json for luminosities reference
    Object.keys(luminosities).forEach(l => {
      if(!palette[l]) {
        palette[l] = {};
      }
      palette[l][colorName] = shadeColor(hexCode, luminosities[l]);
    });
    return palette;
  }, {});
  return pallete;
}