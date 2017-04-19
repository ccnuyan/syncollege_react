// import withWidth from 'material-ui/utils/withWidth';
// import muiThemeable from 'material-ui/styles/muiThemeable';
// import spacing from 'material-ui/styles/spacing';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// API:https://github.com/callemall/material-ui/blob/v0.17.1/src/styles/getMuiTheme.js

// {
//   primary1Color: cyan500,
//   primary2Color: cyan700,
//   primary3Color: grey400,
//   accent1Color: pinkA200,
//   accent2Color: grey100,
//   accent3Color: grey500,
//   textColor: darkBlack,
//   alternateTextColor: white,
//   canvasColor: white,
//   borderColor: grey300,
//   disabledColor: fade(darkBlack, 0.3),
//   pickerHeaderColor: cyan500,
//   clockCircleColor: fade(darkBlack, 0.07),
//   shadowColor: fullBlack,
// }

const flex = {
  display: 'flex',
};

let theme = {};

if (window.localStorage.getItem('mui_theme') === 'darkBaseTheme') {
  theme = getMuiTheme(darkBaseTheme);
} else {
  theme = getMuiTheme(lightBaseTheme);
}

export default {
  styles: {
    flexRow: {
      ...flex,
      flexDirection: 'row',
    },
    flexColumn: {
      ...flex,
      flexDirection: 'column',
    },
    deadCenter: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    flexBetweenStretch: {
      justifyContent: 'space-between',
      alignItem: 'stretch',
    },
    flexAround: {
      justifyContent: 'space-around',
    },
    flexStretch: {
      alignItem: 'stretch',
    },
    flexCenter: {
      alignItem: 'center',
    },
    active: {
      color: theme.palette.alternateTextColor,
      backgroundColor: theme.palette.primary1Color,
      fontWeight: 'bold',
    },
    plain: {
      color: theme.palette.primary1Color,
      backgroundColor: 'transparent',
    },
  },
  theme,
};
