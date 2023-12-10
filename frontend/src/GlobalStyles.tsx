import React from 'react';
import { CssBaseline } from '@mui/material';
import { Global, css } from '@emotion/react';

const GlobalStyles: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Global
        styles={css`
          body {
            font-family: 'Roboto', sans-serif; // You can use any font of your preference
            background-color: #CF9FFF; 
            color: #333; // Default text color
            line-height: 1.6; 
          }
          a {
            color: #0077cc; 
            text-decoration: none; 
            &:hover {
              text-decoration: underline;
            }
          }
          input, button, textarea, select {
            font-family: 'Roboto', sans-serif;
            font-size: 16px;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            &:focus {
              outline: none;
              border-color: #0077cc;
            }
          }
          button {
            cursor: pointer;
            background-color: #7F00FF;
            color: white;
            &:hover {
              background-color: #005fa3;
            }
            &:disabled {
              background-color: #ccc;
              cursor: not-allowed;
            }
          }
          * {
            box-sizing: border-box;
          }
        `}
      />
    </React.Fragment>
  );
};

export default GlobalStyles;
