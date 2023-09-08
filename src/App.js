import loadable from "@loadable/component";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsGuest, setCurrentUser } from "./components/auth/authSlice";
import api from "./utils/axios";
import Main from "./page/main/Main";
import Registration from "./page/registration/Registration";
import Account from "./page/account/Account";
import Topup from "./page/topup/Topup";
import Transaction from "./page/transaction/Transaction";
import TransactionHistory from "./page/transaction_history/TransactionHistory";

const Layout = loadable(() => import("./layout/Layout"));
const ConfirmationDialog = loadable(() =>
  import("./components/confirmation_dialog/ConfirmationDialog")
);
const FlashInfo = loadable(() => import("./components/flash_info/flashInfo"));
const NotFound = loadable(() => import("./page/not_found/NotFound"));
const Login = loadable(() => import("./page/login/Login"));

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isGuest } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // untuk selalu mengecek status user apakah login atau guest
  useEffect(() => {
    const accessToken = localStorage.SimsPpobAdmTkn;
    if (accessToken) {
      (async () => {
        try {
          const { status, data } = await api.get("/profile", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (status === 200) {
            dispatch(setIsGuest({ isGuest: data.message !== "Sukses" }));
            dispatch(setCurrentUser({ currentUser: data.data }));
          }
        } catch (error) {}
      })();
    } else {
      dispatch(setIsGuest({ isGuest: true }));
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isGuest) {
      if (
        location.pathname !== "/login" &&
        location.pathname !== "/registration"
      ) {
        navigate(location.state ? location.state.from.pathname : "/login");
      }
    } else if (isGuest === false) {
      if (
        location.pathname === "/login" ||
        location.pathname === "/registration"
      ) {
        navigate(location.state ? location.state.from.pathname : "/");
      }
    } else if (isGuest === null) {
      if (location.pathname === "/login") {
      }
    }
  }, [isGuest]);

  return (
    <>
      <Routes>
        <Route
          element={
            <Layout fallback={<div>Loading...</div>} isGuest={isGuest} />
          }
        >
          {/* cara kerja layout lihat: https://stackoverflow.com/a/69982280 */}
          <Route path="/" element={<Main />} />
          <Route path="/transaction">
            <Route path=":serviceCode" element={<Transaction />} />
            <Route path="history" element={<TransactionHistory />} />
          </Route>
          <Route path="/top-up" element={<Topup />} />
          <Route path="/account" element={<Account />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ConfirmationDialog />
      <FlashInfo />
    </>
  );
};

export default App;
