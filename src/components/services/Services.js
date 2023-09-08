import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { setOpen as setSnackbarOpen } from "../../components/flash_info/flashInfoSlice";
import api from "../../utils/axios";
import { toCurrency } from "../../utils/formatter";
import { setCurrentUser, setIsGuest } from "../auth/authSlice";
import { deepOrange, green } from "@mui/material/colors";
import { useLocation, useNavigate, Link, Navigate } from "react-router-dom";
import { setServicesData } from "../../components/services/servicesSlice";

const Services = () => {
  const services = useSelector((state) => state.services.data);

  const dispatch = useDispatch();

  useEffect(() => {
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
  }, []);
  return (
    <Box sx={{ my: 6 }}>
      <Grid container>
        {services.map((obj, idx) => {
          return (
            <Grid key={obj.service_code} item xs={3} sm={4} lg={1}>
              <Box
                component={Link}
                to={"/transaction/" + obj.service_code}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  px: 2,
                  cursor: "pointer",
                }}
              >
                <Avatar
                  alt={obj.service_name}
                  src={obj.service_icon}
                  sx={{ bgcolor: "transparent", mb: 2, height: 70, width: 70 }}
                  variant="rounded"
                />
                <Typography align="center">{obj.service_name}</Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
export default Services;
