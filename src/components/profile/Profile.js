import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import Balance from "../balance/Balance";

const Profile = () => {
  const { currentUser, isGuest } = useSelector((state) => state.auth);

  return (
    <Box sx={{ mb: 6 }}>
      <Grid container>
        <Grid item xs={12} md={5}>
          {currentUser && (
            <>
              <Avatar
                alt={currentUser.first_name + " " + currentUser.last_name}
                src={currentUser.profile_image}
                sx={{ mb: 2, width: 100, height: 100 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 400, mb: 1 }}>
                Selamat datang,
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, textTransform: "capitalize" }}
              >
                {currentUser.first_name + " " + currentUser.last_name}
              </Typography>
            </>
          )}
        </Grid>
        <Balance />
      </Grid>
    </Box>
  );
};
export default Profile;
