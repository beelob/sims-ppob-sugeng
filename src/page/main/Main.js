import Box from "@mui/material/Box";
import Services from "../../components/services/Services";
import Banners from "../../components/banners/Banners";
import Profile from "../../components/profile/Profile";

const Main = () => {
  return (
    <Box>
      <Profile />
      <Services />
      <Banners />
    </Box>
  );
};
export default Main;
