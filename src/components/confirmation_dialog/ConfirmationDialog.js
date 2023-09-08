import { forwardRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { setClose, setConfirmed, setLoading } from "./confirmationDialogSlice";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate, Link, Navigate } from "react-router-dom";

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

const Tpg = ({ content }) => {
  return (
    <Typography
      align="center"
      variant="h6"
      sx={{ mt: 1, color: "rgba(0,0,0,.7)" }}
    >
      {content}
    </Typography>
  );
};

const ConfirmationDialog = () => {
  const {
    open,
    title,
    description,
    isLoading,
    confirmFor,
    confirmBtnText,
    status,
  } = useSelector((state) => state.confirmationDialog);

  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (isLoading && reason === "backdropClick") {
      return;
    }
    dispatch(setClose());
  };

  const onConfirmed = () => {
    dispatch(setLoading({ isLoading: true }));
    dispatch(setConfirmed({ confirmFor: confirmFor }));
  };

  let avatarIcon = <AccountBalanceWalletIcon fontSize="large" />;
  let statusHint = null;
  let avBgColor = "#F42619";
  if (status === "success") {
    avBgColor = "#52BD94";
    avatarIcon = <CheckIcon fontSize="large" sx={{ color: "#fff" }} />;
    statusHint = <Tpg content="Berhasil!" />;
  } else if (status === "failed") {
    avBgColor = "#FF5630";
    avatarIcon = <CloseIcon fontSize="large" sx={{ color: "#fff" }} />;
    statusHint = <Tpg content="Gagal" />;
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        // keepMounted
        onClose={handleClose}
        maxWidth="xs"
        fullWidth={true}
        disableEscapeKeyDown={isLoading}
        sx={{
          ".MuiDialog-paper": {
            p: 4,
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: avBgColor,
            alignSelf: "center",
            height: 80,
            width: 80,
          }}
        >
          {avatarIcon}
        </Avatar>
        <DialogTitle align="center" sx={{ color: "rgba(0,0,0,.7)", pb: 1 }}>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="h4"
            align="center"
            sx={{ color: "rgba(0,0,0,.8)", fontWeight: 700 }}
          >
            {description} ?
          </DialogContentText>
          {statusHint}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Stack spacing={1}>
              {status === "idle" ? (
                <>
                  <Button
                    onClick={onConfirmed}
                    sx={{
                      fontWeight: 700,
                      textTransform: "none",
                      color: "#F42619",
                      fontSize: "18px",
                    }}
                  >
                    {confirmBtnText}
                  </Button>
                  <Button
                    onClick={handleClose}
                    sx={{
                      fontWeight: 700,
                      textTransform: "none",
                      color: "rgba(0,0,0,.5)",
                      fontSize: "18px",
                    }}
                  >
                    Batalkan
                  </Button>
                </>
              ) : (
                <Button
                  LinkComponent={Link}
                  to="/"
                  onClick={handleClose}
                  sx={{
                    fontWeight: 700,
                    textTransform: "none",
                    color: "#F42619",
                    fontSize: "18px",
                  }}
                >
                  Kembali ke Beranda
                </Button>
              )}
            </Stack>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationDialog;
