import { CSSProperties } from "@mui/material/styles/createTypography";

export type TypographyProps = {
  fontFamily: string;
  body1: TypographyVariant;
  body2: TypographyVariant;
  button: ButtonVariant;
  caption: TypographyVariant;
  subtitle1: TypographyVariant;
  subtitle2: TypographyVariant;
  overline: OverlineVariant;
  h1: HeadingVariant;
  h2: HeadingVariant;
  h3: HeadingVariant;
  h4: HeadingVariant;
  h5: HeadingVariant;
  h6: HeadingVariant;
};

export interface TypographyVariant extends CSSProperties {
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
}

export interface ButtonVariant extends TypographyVariant {}

export interface OverlineVariant extends TypographyVariant {
  letterSpacing: string;
  textTransform: "none" | "capitalize" | "uppercase" | "lowercase";
}

export interface HeadingVariant extends TypographyVariant {
  fontFamily: string;
}

export const createTypography = (): TypographyProps => {
  return {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.57,
    },
    button: {
      fontWeight: 600,
      fontSize: "",
      lineHeight: 1.57,
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 500,
      lineHeight: 1.66,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.57,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.57,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.5px",
      lineHeight: 2.5,
      textTransform: "uppercase",
    },
    h1: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 700,
      fontSize: "3.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 700,
      fontSize: "3rem",
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 700,
      fontSize: "2.25rem",
      lineHeight: 1.2,
    },
    h4: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.2,
    },
    h5: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: 1.2,
    },
    h6: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 700,
      fontSize: "1.125rem",
      lineHeight: 1.2,
    },
  };
};
