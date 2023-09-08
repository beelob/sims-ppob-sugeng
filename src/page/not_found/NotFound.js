import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";

const NotFound = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Box sx={{ display: "flex"}}>
        <Typography variant="h5" color={grey[400]}>
          404
        </Typography>
        <Divider flexItem orientation="vertical" sx={{ mx: 3 }} />
        <Typography variant="h5" color={grey[400]}>
          Not Found
        </Typography>
      </Box>
    </Box>
  );
};

export default NotFound;
