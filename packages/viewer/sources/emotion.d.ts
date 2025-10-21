import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      primary: string;
      primaryHover: string;
      border: string;
      hover: string;
      active: string;
      error: string;
    };
  }
}
