import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { useDispatch } from "react-redux";
import { Button, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { setOpen as setSnackbarOpen } from "../flash_info/flashInfoSlice";
import api from "../../utils/axios";
import { setIsGuest } from "../auth/authSlice";
import { register } from "swiper/element/bundle";
import "swiper/css";
import "swiper/css/autoplay";

register();

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const dispatch = useDispatch();

  const swiperElRef = useRef(null);

  useEffect(() => {
    const abortController = new AbortController();
    const accessToken = localStorage.SimsPpobAdmTkn;
    if (accessToken) {
      (async () => {
        try {
          const { status, data } = await api.get("/banner", {
            signal: abortController.signal,
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (status === 200) {
            setBanners(data.data);
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
      <Typography sx={{ fontWeight: 500, mb: 3 }}>
        Temukan promo menarik
      </Typography>
      <swiper-container
        ref={swiperElRef}
        slides-per-view="4.3"
        speed="500"
        autoplay="true"
        space-between="50"
        navigation="false"
        pagination="false"
      >
        {banners.map((obj, idx) => {
          return (
            <swiper-slide key={obj.banner_name}>
              <Box
                component="img"
                alt={obj.banner_name}
                src={obj.banner_image}
                sx={{ cursor: "pointer", width: "100%" }}
              />
            </swiper-slide>
          );
        })}
      </swiper-container>
    </Box>
  );
};
export default Banners;
