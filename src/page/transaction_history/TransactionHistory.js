import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Profile from "../../components/profile/Profile";
import { useEffect, useState } from "react";
import { setIsGuest } from "../../components/auth/authSlice";
import { useDispatch } from "react-redux";
import api from "../../utils/axios";
import { setOpen as setSnackbarOpen } from "../../components/flash_info/flashInfoSlice";
import { formatDate, toCurrency } from "../../utils/formatter";
import { setShow } from "../../components/balance/balanceSlice";

const TransactionHistory = () => {
  const [limit, setLimit] = useState(3);
  const [histories, setHistories] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setShow({ show: true }));
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const accessToken = localStorage.SimsPpobAdmTkn;
    if (accessToken) {
      (async () => {
        try {
          const { status, data } = await api.get("/transaction/history", {
            params: {
              offset: 0,
              limit: limit,
            },
            signal: abortController.signal,
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (status === 200) {
            setHistories(data.data.records);
            // dispatch(setServicesData({ services: data.data }));
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
  }, [limit]);

  const handleShowMore = () => {
    setLimit((prev) => prev + 3);
  };

  return (
    <Box>
      <Profile />
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
        Semua Transaksi
      </Typography>
      <Stack spacing={2}>
        {histories.map((obj, idx) => {
          let plusMinus = "",
            colorType = "";
          if (obj.transaction_type === "TOPUP") {
            plusMinus = "+";
            colorType = "#52BD94";
          } else if (obj.transaction_type === "PAYMENT") {
            plusMinus = "-";
            colorType = "#FF5630";
          }
          return (
            <Paper
              key={obj.invoice_number}
              variant="outlined"
              sx={{
                py: 1.5,
                px: 3,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  component="p"
                  sx={{
                    color: colorType,
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  {`${plusMinus} ${toCurrency.format(obj.total_amount)}`}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(0,0,0,.5)" }}>
                  {formatDate(obj.created_on)}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{}}>
                {obj.description}
              </Typography>
            </Paper>
          );
        })}
      </Stack>
      {histories.length ? (
        <Button
          fullWidth
          sx={{ textTransform: "none", mt: 2 }}
          onClick={handleShowMore}
        >
          Show more
        </Button>
      ) : null}
    </Box>
  );
};
export default TransactionHistory;
