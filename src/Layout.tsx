import {
  Box,
  Typography,
  Grid2,
  Link,
  createTheme,
  ThemeProvider,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router";
import supabase from "./utils/supabase";
import { Logout } from "@mui/icons-material";

const theme = createTheme();

export function Layout({ children }: React.PropsWithChildren) {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box
        color="white"
        margin={0}
        padding="30px 25px"
        height="100%"
        sx={{
          backgroundColor: theme.palette.primary.dark,
        }}
        minHeight="100vh"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          marginBottom={8}
        >
          <Typography
            variant="h3"
            fontWeight={500}
            style={{ marginBottom: "20px" }}
          >
            Planos Mensais
          </Typography>

          <Grid2
            container
            flexDirection="row"
            bgcolor={theme.palette.background.paper}
            borderRadius={1}
            padding={1.5}
            width={250}
            justifyContent="space-between"
            alignItems="center"
          >
            <Link
              style={{ cursor: "pointer" }}
              variant="button"
              underline="hover"
              onClick={() => navigate("/")}
            >
              Ver Planos
            </Link>
            <Divider orientation="vertical" flexItem />
            <Link
              style={{ cursor: "pointer" }}
              variant="button"
              underline="hover"
              onClick={() => navigate("/criar")}
            >
              Criar
            </Link>
            <Divider orientation="vertical" flexItem />
            <Link
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              color="error"
              variant="button"
              underline="hover"
              onClick={() => supabase.auth.signOut()}
            >
              Sair
              <Logout />
            </Link>
          </Grid2>
        </Box>
        <Grid2 container>
          <Grid2
            size={{ xs: 10, md: 8 }}
            offset={{ xs: 1, md: 2 }}
            bgcolor="#f2f2f2"
            borderRadius={1}
            color={"#282c34"}
            padding="55px 35px"
            sx={{
              boxShadow: "-11px 11px 30px -12px rgba(0,0,0,0.75)",
            }}
          >
            {children}
          </Grid2>
        </Grid2>
      </Box>
    </ThemeProvider>
  );
}
