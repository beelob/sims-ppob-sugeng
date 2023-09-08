import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MoneyOutlined from "@mui/icons-material/MoneyOutlined";
import { useState, forwardRef, useEffect } from "react";
import { setOpen as setSnackbarOpen } from "../../components/flash_info/flashInfoSlice";
import { setAmount, setShow } from "../../components/balance/balanceSlice";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../utils/axios";
import { toCurrency } from "../../utils/formatter";
import Profile from "../../components/profile/Profile";
import NumberFormat from "react-number-format";
import {
  setOpen,
  setStatus,
  setTitle,
  setDescription,
  setConfirmFor,
  setLoading,
  setConfirmBtnText,
  TOP_UP,
} from "../../components/confirmation_dialog/confirmationDialogSlice";

const CustomAmountComponent = forwardRef((props, ref) => {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
            // name: other.name,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      displayType="input"
    />
  );
});

const Topup = () => {
  const [amountError, setAmountError] = useState("");

  const [amountValue, setAmountValue] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const topUpConfirmed = useSelector((state) => state.confirmationDialog.topUp);

  useEffect(() => {
    dispatch(setShow({ show: true }));
  }, []);

  useEffect(() => {
    if (topUpConfirmed) {
      setIsLoading(true);
      dispatch(setTitle({ title: "Top Up sebesar" }));

      const abortController = new AbortController();
      const accessToken = localStorage.SimsPpobAdmTkn;
      const conf = {
        signal: abortController.signal,
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      api
        .post(
          "/topup",
          {
            top_up_amount: +amountValue,
          },
          conf
        )
        .then(({ status, data }) => {
          if (status === 200) {
            dispatch(setAmount({ amount: data.data.balance }));
            dispatch(setStatus({ status: "success" }));
          }
          setIsLoading(false);
          dispatch(setLoading({ isLoading: false }));
        })
        .catch(({ response = {} }) => {
          dispatch(setStatus({ status: "failed" }));
          setIsLoading(false);
          dispatch(setLoading({ isLoading: false }));
          if (response.data) {
            if (response.data.status === 102) {
              if (response.data.message.toLowerCase().includes("amount")) {
                setAmountError(response.data.message);
                return;
              }
            }
            dispatch(
              setSnackbarOpen({ text: response.data.message, type: "error" })
            );
          }
        });
      return () => {
        abortController.abort();
      };
    }
  }, [amountValue, topUpConfirmed]);

  const handleSubmit = (event) => {
    event.preventDefault();

    setAmountError("");

    dispatch(setOpen());
    dispatch(setTitle({ title: "Anda yakin untuk Top Up sebesar" }));
    dispatch(setDescription({ description: toCurrency.format(amountValue) }));
    dispatch(setConfirmFor({ confirmFor: TOP_UP }));
    dispatch(setConfirmBtnText({ text: "Ya, lanjutkan Top Up" }));
  };

  const handleAmountChange = (e) => {
    setAmountValue(e.target.value);
  };

  return (
    <Box>
      <Profile />
      <Typography variant="h6" sx={{ fontWeight: 400, mb: 1 }}>
        Silahkan masukkan
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Nominal Top Up
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <TextField
              error={amountError ? true : false}
              helperText={amountError}
              margin="none"
              autoFocus
              required
              fullWidth
              id="amount"
              label=""
              name="amount"
              value={amountValue}
              onChange={handleAmountChange}
              sx={{ mb: 1 }}
              InputProps={{
                inputComponent: CustomAmountComponent,
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyOutlined />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                height: 56,
                bgcolor: "#F42619",
                textTransform: "capitalize",
              }}
              disabled={isLoading || !amountValue}
              disableElevation
            >
              {isLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
              Top Up
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Grid container spacing={2}>
            {[10000, 20000, 50000, 100000, 250000, 500000].map((money, idx) => (
              <Grid item xs={4} key={money}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  onClick={() => setAmountValue(money)}
                  sx={{
                    mt: 0,
                    height: 56,
                    color: "rgba(0,0,0,.7)",
                    borderColor: "rgba(0,0,0,.3)",
                    fontSize: 16,
                    textTransform: "none",
                  }}
                >
                  {toCurrency.format(money).replace("RP", "Rp")}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Topup;
