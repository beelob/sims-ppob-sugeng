import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { setOpen as setSnackbarOpen } from "../../components/flash_info/flashInfoSlice";
import { setAmount, setShow, setRefresh } from "./balanceSlice";
import api from "../../utils/axios";
import { toCurrency } from "../../utils/formatter";
import { setIsGuest } from "../auth/authSlice";
import { useLocation } from "react-router-dom";

const Balance = () => {
  const { amount, show, refresh } = useSelector((state) => state.balance);
  const dispatch = useDispatch();

  const location = useLocation();

  // untuk handle tiap pindah page /, top-up, transaction, history
  useEffect(() => {
    const accessToken = localStorage.SimsPpobAdmTkn;
    if (accessToken) {
      const accessToken = localStorage.SimsPpobAdmTkn;
      if (accessToken) {
        api
          .get("/balance", {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then(({ status, data }) => {
            if (status === 200) {
              dispatch(setAmount({ amount: data.data.balance }));
            }
            // setIsLoading(false);
          })
          .catch(({ response = {} }) => {
            // setIsLoading(false);
            if (response.data) {
              dispatch(
                setSnackbarOpen({
                  text: response.data.message,
                  type: "error",
                })
              );
            }
          });
      } else {
        dispatch(setIsGuest({ isGuest: true }));
      }
    } else {
      dispatch(setIsGuest({ isGuest: true }));
    }
  }, [location.pathname]);
  // untuk handle tiap pindah page /, top-up, transaction, history

  // untuk handle setelah transaksi pembayaran, get balance terupdate
  useEffect(() => {
    if (refresh) {
      const accessToken = localStorage.SimsPpobAdmTkn;
      if (accessToken) {
        const accessToken = localStorage.SimsPpobAdmTkn;
        if (accessToken) {
          api
            .get("/balance", {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then(({ status, data }) => {
              if (status === 200) {
                dispatch(setAmount({ amount: data.data.balance }));
              }
              // setIsLoading(false);
            })
            .catch(({ response = {} }) => {
              // setIsLoading(false);
              if (response.data) {
                dispatch(
                  setSnackbarOpen({
                    text: response.data.message,
                    type: "error",
                  })
                );
              }
            });
        } else {
          dispatch(setIsGuest({ isGuest: true }));
        }
      } else {
        dispatch(setIsGuest({ isGuest: true }));
      }
      dispatch(setRefresh({ refresh: false }));
    }
  }, [refresh]);
  // untuk handle setelah transaksi pembayaran, get balance terupdate

  const handleToggleBalance = () => {
    dispatch(setShow({ show: !show }));

    if (show) {
      // krna disembunyikan maka tdk perlu get balance
      return;
    }

    const accessToken = localStorage.SimsPpobAdmTkn;
    if (accessToken) {
      api
        .get("/balance", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then(({ status, data }) => {
          if (status === 200) {
            dispatch(setAmount({ amount: data.data.balance }));
          }
          // setIsLoading(false);
        })
        .catch(({ response = {} }) => {
          // setIsLoading(false);
          if (response.data) {
            dispatch(
              setSnackbarOpen({ text: response.data.message, type: "error" })
            );
          }
        });
    } else {
      dispatch(setIsGuest({ isGuest: true }));
    }
  };

  return (
    <Grid item xs={12} md={7} sx={{ display: "flex", position: "relative" }}>
      <Box
        component="img"
        alt="background saldo"
        src="/assets/Background-Saldo.png"
        sx={{
          zIndex: 0,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: "250px",
          width: "100%",
        }}
      />
      <Box
        sx={{
          zIndex: 1,
          px: 4,
          py: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          // alignItems: "center",
          width: "100%",
          height: "250px",
        }}
      >
        <Typography variant="h6" sx={{ color: "#fff" }}>
          Saldo anda
        </Typography>
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
          {show ? (
            toCurrency.format(amount)
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  "Rp &#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679;",
              }}
            ></div>
          )}
        </Typography>
        <Button
          onClick={handleToggleBalance}
          sx={{
            width: "fit-content",
            color: "#fff",
            textTransform: "none",
            fontSize: 16,
          }}
        >
          {show ? "Tutup Saldo" : "Lihat Saldo"}
        </Button>
      </Box>
    </Grid>
  );
};
export default Balance;
