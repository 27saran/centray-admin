import { ReactNode } from "react";
import { Box, Typography, Grid } from "@mui/material";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flex: "1 1 auto",
        height: "100vh",
      }}
    >
      <Grid container sx={{ flex: "1 1 auto" }}>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {children}
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            alignItems: "center",
            background:
              "radial-gradient(50% 50% at 50% 50%, #071012 0%, #090E23 100%)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            "& img": {
              maxWidth: "100%",
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={{
                fontSize: "24px",
                lineHeight: "32px",
                mb: 1,
              }}
              variant="h1"
            >
              Welcome to{" "}
              <Box
                component="a"
                sx={{ color: "#15B79E" }}
                target="_blank"
                fontWeight={900}
              >
                Centray Admin App
              </Box>
            </Typography>
            <Typography align="center" sx={{ mb: 3 }} variant="subtitle1">
              Currently in{" "}
              <Box
                component="a"
                sx={{ color: "#15B79E" }}
                target="_blank"
                fontWeight={900}
              >
                {import.meta.env.VITE_APP_ENV}
              </Box>{" "}
              mode.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
