import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import api from "../../utils/axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import AuthLoading from "../../components/auth/AuthLoading";
import { setOpen as setSnackbarOpen } from "../../components/flash_info/flashInfoSlice";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const Registration = () => {
  const [allError, setAllError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isGuest } = useSelector((state) => state.auth);

  const handleSubmit = (event) => {
    event.preventDefault();

    setAllError("");
    setEmailError("");
    setFirstNameError("");
    setLastNameError("");
    setPasswordError("");
    setPasswordConfirmationError("");

    const data = new FormData(event.currentTarget);

    // VALIDASI
    if (data.get("password") !== data.get("password_confirmation")) {
      setPasswordConfirmationError("password tidak sama");
      return;
    }
    // VALIDASI
    setIsLoading(true);

    api
      .post("/registration", {
        email: data.get("email"),
        first_name: data.get("first_name"),
        last_name: data.get("last_name"),
        password: data.get("password"),
      })
      .then(({ status, data }) => {
        if (status === 200) {
          navigate("/login");
          dispatch(setSnackbarOpen({ text: data.message }));
        }
        setIsLoading(false);
      })
      .catch(({ response = {} }) => {
        setIsLoading(false);
        if (response.data) {
          if (response.data.status === 102) {
            if (response.data.message.toLowerCase().includes("email")) {
              setEmailError(response.data.message);
            } else if (response.data.message.includes("first_name")) {
              setFirstNameError(response.data.message);
            } else if (response.data.message.includes("last_name")) {
              setLastNameError(response.data.message);
            } else if (
              response.data.message.toLowerCase().includes("password")
            ) {
              setPasswordError(response.data.message);
            }
          } else {
            setAllError(response.data.message);
          }
          dispatch(
            setSnackbarOpen({ text: response.data.message, type: "error" })
          );
        }
      });
    // });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordConfirmation = () =>
    setShowPasswordConfirmation((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return isGuest === null ? (
    <AuthLoading />
  ) : (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // borderLeft: "6px solid #2e7d32",
        }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "50%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: "#F42619" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 500 }}>
              SIMS PPOB
            </Typography>
          </Box>
          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: 5, fontWeight: 500 }}
          >
            Lengkapi data untuk membuat akun
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              error={emailError || allError ? true : false}
              helperText={emailError || allError}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Masukkan email anda"
              name="email"
              autoFocus
              color="warning"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              error={firstNameError || allError ? true : false}
              helperText={firstNameError || allError}
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="Nama depan"
              name="first_name"
              color="warning"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              error={lastNameError || allError ? true : false}
              helperText={lastNameError || allError}
              margin="normal"
              required
              fullWidth
              id="last_name"
              label="Nama belakang"
              name="last_name"
              color="warning"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              error={passwordError || allError ? true : false}
              helperText={passwordError || allError}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Masukkan password anda"
              type={showPassword ? "text" : "password"}
              id="password"
              color="warning"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              error={passwordConfirmationError || allError ? true : false}
              helperText={passwordConfirmationError || allError}
              margin="normal"
              required
              fullWidth
              name="password_confirmation"
              label="Konfirmasi password"
              type={showPasswordConfirmation ? "text" : "password"}
              id="password_confirmation"
              color="warning"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordConfirmation}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPasswordConfirmation ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "#F42619 !important",
                textTransform: "capitalize",
              }}
              disabled={isLoading}
              disableElevation
            >
              {isLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
              Registrasi
            </Button>
            <Box
              sx={{
                textAlign: "center",
                fontSize: "14px",
                color: "rgba(0,0,0,.5)",
              }}
            >
              Sudah punya akun? login{" "}
              <Link
                to="/login"
                style={{ color: "#F42619", fontWeight: "bold" }}
              >
                {"Di sini"}
              </Link>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        component={Paper}
        elevation={0}
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundImage: "url(./assets/Illustrasi-Login.png)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: "-1",
          // "&:before": {
          //   content: '""',
          //   position: "absolute",
          //   top: 0,
          //   left: 0,
          //   width: "100%",
          //   height: "100%",
          //   backgroundColor: "#24242491",
          //   zIndex: "-1",
          // },
        }}
      ></Grid>
    </Grid>
  );
};

export default Registration;
