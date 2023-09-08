import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Outlet } from "react-router-dom";
import AuthLoading from "../components/auth/AuthLoading";
import Avatar from "@mui/material/Avatar";
import { useLocation, Link, Navigate } from "react-router-dom";

const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#F42619",
    },
  },
});

const Layout = (props) => {
  const location = useLocation();

  if (props.isGuest === null) {
    return <AuthLoading />;
  }

  return props.isGuest ? (
    <Navigate to="/login" state={{ from: location }} />
  ) : (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="absolute"
          sx={{ ml: 0, width: "100%", bgcolor: "#fff" }}
          elevation={1}
        >
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  marginRight: "36px",
                  bgcolor: "#F42619",
                  mr: 3.5,
                }}
              >
                <AccountBalanceWalletIcon />
              </Avatar>
              <Typography component="span" variant="h5" sx={{ color: "#000" }}>
                SIMS PPOB
              </Typography>
            </Box>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            ></Typography>
            <Box sx={{ mx: 2 }}>
              <Stack direction="row" spacing={6}>
                <Link
                  to="/top-up"
                  style={{
                    color:
                      location.pathname === "/top-up"
                        ? "#F42619"
                        : "rgba(0,0,0,.78)",
                    fontWeight: "bold",
                  }}
                >
                  Top Up
                </Link>
                <Link
                  to="/transaction/history"
                  style={{
                    color:
                      location.pathname === "/transaction/history"
                        ? "#F42619"
                        : "rgba(0,0,0,.78)",
                    fontWeight: "bold",
                  }}
                >
                  Transaction
                </Link>
                <Link
                  to="/account"
                  style={{
                    color:
                      location.pathname === "/account"
                        ? "#F42619"
                        : "rgba(0,0,0,.78)",
                    fontWeight: "bold",
                  }}
                >
                  Akun
                </Link>
              </Stack>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Toolbar />
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <Container className="name-mu" maxWidth={false} sx={{ my: 4 }}>
              <Outlet
              // context={[open]} // cara kirim props see: https://reactrouter.com/docs/en/v6/hooks/use-outlet-context
              />
              {/* bukan pake props.children, cara kerja layout react-router-dom v6 lihat: https://stackoverflow.com/a/69982280 */}
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
