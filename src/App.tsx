import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route } from "react-router-dom";
import { PATHS } from "@/constants/routes";
import { Login } from "@/pages/Login";
import { createTheme } from "@/theme";
import { ThemeProvider } from "@mui/material/styles";
import { NotFound } from "@/pages/404";
import { Device } from "@/pages/Device";

function App() {
  const theme = createTheme();

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path={PATHS.signIn} element={<Login />} />
          <Route
            path={PATHS.device}
            element={
              //<RequireAuth roles={AdminsRoles}>
                <Device />
              //</RequireAuth>
            }
          />
          <Route path={PATHS.notFound} element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
