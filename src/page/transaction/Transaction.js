import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MoneyOutlined from "@mui/icons-material/MoneyOutlined";
import { useState, forwardRef, useEffect } from "react";
import { setOpen as setSnackbarOpen } from "../../components/flash_info/flashInfoSlice";
import { setRefresh, setShow } from "../../components/balance/balanceSlice";
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
  TRANSACTION,
} from "../../components/confirmation_dialog/confirmationDialogSlice";
import { useParams } from "react-router-dom";
import { setServicesData } from "../../components/services/servicesSlice";
import { setIsGuest } from "../../components/auth/authSlice";

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

const getSingleService = (services, serviceCode) => {
  for (let i = 0; i < services.length; i++) {
    const elm = services[i];
    if (elm.service_code === serviceCode) {
      return elm;
    }
  }
  return;
};

const Transaction = () => {
  const [amountError, setAmountError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { serviceCode } = useParams();

  const dispatch = useDispatch();

  const services = useSelector((state) => state.services.data);

  const transactionConfirmed = useSelector(
    (state) => state.confirmationDialog.transaction
  );

  useEffect(() => {
    dispatch(setShow({ show: true }));
  }, []);

  // untuk handle kalau langsung akses urlnya tanpa lewat beranda
  useEffect(() => {
    if (!services.length) {
      const abortController = new AbortController();
      const accessToken = localStorage.SimsPpobAdmTkn;
      if (accessToken) {
        (async () => {
          try {
            const { status, data } = await api.get("/services", {
              signal: abortController.signal,
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (status === 200) {
              dispatch(setServicesData({ services: data.data }));
            }
          } catch ({ response = {} }) {
            //   if (!abortController.signal.aborted) {
            if (response.data) {
              dispatch(
                setSnackbarOpen({ text: response.data.message, type: "error" })
              );
            }
            //   }
          }
        })();
      } else {
        dispatch(setIsGuest({ isGuest: true }));
      }
      return () => {
        abortController.abort();
      };
    }
  }, [services]);
  // untuk handle kalau langsung akses urlnya tanpa lewat beranda

  useEffect(() => {
    if (transactionConfirmed) {
      setIsLoading(true);

      const servItem = getSingleService(services, serviceCode);

      dispatch(
        setTitle({ title: `Pembayaran ${servItem.service_name} sebesar` })
      );

      const abortController = new AbortController();
      const accessToken = localStorage.SimsPpobAdmTkn;
      const conf = {
        signal: abortController.signal,
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      api
        .post(
          "/transaction",
          {
            service_code: servItem.service_code,
          },
          conf
        )
        .then(({ status, data }) => {
          if (status === 200) {
            dispatch(setRefresh({ refresh: true }));
            dispatch(setStatus({ status: "success" }));
          }
          setIsLoading(false);
          dispatch(setLoading({ isLoading: false }));
        })
        .catch(({ response = {} }) => {
          setIsLoading(false);
          dispatch(setLoading({ isLoading: false }));
          dispatch(setStatus({ status: "failed" }));
          if (response.data) {
            dispatch(
              setSnackbarOpen({ text: response.data.message, type: "error" })
            );
          }
        });
      return () => {
        abortController.abort();
      };
    }
  }, [transactionConfirmed]);

  const servItem = getSingleService(services, serviceCode);

  const handleSubmit = (event) => {
    event.preventDefault();

    setAmountError("");

    dispatch(setOpen());
    dispatch(setTitle({ title: `Beli ${servItem.service_name} senilai` }));
    dispatch(
      setDescription({
        description: toCurrency.format(servItem.service_tariff),
      })
    );
    dispatch(setConfirmFor({ confirmFor: TRANSACTION }));
    dispatch(setConfirmBtnText({ text: "Ya, lanjutkan Bayar" }));
  };

  return servItem ? (
    <Box>
      <Profile />
      <Typography variant="h6" sx={{ fontWeight: 400, mb: 1 }}>
        PemBayaran
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar
          src={servItem.service_icon}
          alt={servItem.service_name}
          sx={{ height: 70, width: 70 }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700, ml: 1 }}>
          {servItem.service_name}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <TextField
              error={amountError ? true : false}
              helperText={amountError}
              margin="none"
              required
              fullWidth
              id="amount"
              label=""
              name="amount"
              defaultValue={servItem.service_tariff}
              disabled
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
                fontSize: 20,
              }}
              disabled={isLoading || !servItem.service_tariff}
              disableElevation
            >
              {isLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
              Bayar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  ) : null;
};
export default Transaction;
