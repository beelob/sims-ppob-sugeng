import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { setOpen as setSnackbarOpen } from "../../components/flash_info/flashInfoSlice";
import { setCurrentUser } from "../../components/auth/authSlice";

const Account = () => {
  const [onEdit, setOnEdit] = useState(false);

  const [allError, setAllError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  
  const { currentUser, isGuest } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
       setFirstName(currentUser.first_name)
       setLastName(currentUser.last_name)
    }
  }, [currentUser])

  const handleCancel = () => {
    setFirstName(currentUser.first_name)
    setLastName(currentUser.last_name)
    setFirstNameError("")
    setLastNameError("")
    setOnEdit(false)
  }

  const handleOnFirstNameChange = (e) => {
    setFirstName(e.target.value)
  }
  
  const handleOnLastNameChange = (e) => {
    setLastName(e.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setAllError("");
    setFirstNameError("");
    setLastNameError("");

    setIsLoading(true);

    const { first_name, last_name } = event.currentTarget.elements;

    const accessToken = localStorage.SimsPpobAdmTkn;

    api
      .put(
        "/profile/update",
        {
          first_name: first_name.value,
          last_name: last_name.value,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(({ status, data }) => {
        if (status === 200) {
          setOnEdit(false);
          dispatch(setCurrentUser({ currentUser: data.data }));
          dispatch(setSnackbarOpen({ text: data.message }));
        }
        setIsLoading(false);
      })
      .catch(({ response = {} }) => {
        setIsLoading(false);
        if (response.data) {
          // dispatch(
          //   setSnackbarOpen({ text: response.data.message, type: "error" })
          // );
          if (response.data.message.includes("first_name")) {
            setFirstNameError(response.data.message);
          } else if (response.data.message.includes("last_name")) {
            setLastNameError(response.data.message);
          }
        }
      });
    // });
  };

  const handleSubmitImage = async (event) => {
    const formData = new FormData();
    if (event.target.files && event.target.files[0]) {
      formData.append("file", event.target.files[0]);
    } else {
      return;
    }

    try {
      const accessToken = localStorage.SimsPpobAdmTkn;

      const { status, data } = await api.put("/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (status === 200) {
        dispatch(setCurrentUser({ currentUser: data.data }));
      }
      setIsLoading(false);
      dispatch(setSnackbarOpen({ text: data.message }));
    } catch ({ response = {} }) {
      setIsLoading(false);
      if (response.data) {
        dispatch(
          setSnackbarOpen({ text: response.data.message, type: "error" })
        );
      }
    }
  };

  const handleClickSubmit = (e) => {
 if (!onEdit) {
  e.preventDefault()
  setOnEdit(true)
 }

  }

  const handleLogout = () => {
    localStorage.removeItem("SimsPpobAdmTkn");
    navigate("/login");
  };

  return currentUser ? (
    <Container maxWidth="md">
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            alt={currentUser.first_name + " " + currentUser.last_name}
            src={currentUser.profile_image}
            sx={{ width: 150, height: 150 }}
          />
          <Box
            component="label"
            htmlFor="profile_img"
            sx={{
              position: "absolute",
              right: 0,
              bottom: 0,
              cursor: "pointer",
            }}
          >
            <Box
              component="span"
              sx={{
                borderRadius: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(0,0,0,.4)",
                bgcolor: "#fff",
                width: 36,
                height: 36,
              }}
            >
              <EditIcon />
            </Box>
          </Box>
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/jpeg, image/png"
            id="profile_img"
            onChange={handleSubmitImage}
          />
        </Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, my: 4, textTransform: "capitalize" }}
        >
          {currentUser.first_name + " " + currentUser.last_name}
        </Typography>
      </Box>
      <Box>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <label htmlFor="email">Email</label>
          <TextField
            error={emailError || allError ? true : false}
            helperText={emailError || allError}
            margin="normal"
            required
            fullWidth
            id="email"
            label=""
            name="email"
            defaultValue={currentUser.email}
            disabled
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <label htmlFor="first_name">Nama Depan</label>
          <TextField
            error={firstNameError || allError ? true : false}
            helperText={firstNameError || allError}
            margin="normal"
            autoFocus
            required
            fullWidth
            id="first_name"
            label=""
            name="first_name"
            value={firstName}
            onChange={handleOnFirstNameChange}
            disabled={!onEdit}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <label htmlFor="last_name">Nama Belakang</label>
          <TextField
            error={lastNameError || allError ? true : false}
            helperText={lastNameError || allError}
            margin="normal"
            required
            fullWidth
            id="last_name"
            label=""
            name="last_name"
            value={lastName}
            onChange={handleOnLastNameChange}
            disabled={!onEdit}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type={onEdit ? "submit" : "button"}
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              bgcolor: "#F42619",
              textTransform: "capitalize",
            }}
            disabled={isLoading}
            disableElevation
            onClick={handleClickSubmit}
          >
            {isLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
            {onEdit ? "Simpan" : "Edit Profile"}
          </Button>
          {!onEdit ? (
            <Button
              fullWidth
              variant="outlined"
              sx={{
                mt: 3,
                mb: 2,
                textTransform: "capitalize",
              }}
              disableElevation
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              type="button"
              fullWidth
              variant="outlined"
              sx={{
                mt: 3,
                mb: 2,
                textTransform: "capitalize",
              }}
              disableElevation
              onClick={handleCancel}
            >
              Batal
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  ) : null;
};
export default Account;
