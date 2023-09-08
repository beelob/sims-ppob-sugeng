import { forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { setOpen } from "./flashInfoSlice";
import Grow from '@mui/material/Grow';

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

const FlashInfo = () => {
  const { open, text, type } = useSelector((state) => state.flashInfo);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setOpen({ open: false, type, text }));
  };

  return (
    <Snackbar
      // anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      autoHideDuration={6000}
      TransitionComponent={Transition}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {text}
      </Alert>
    </Snackbar>
  );
};

export default FlashInfo;
