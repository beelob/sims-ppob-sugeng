import CircularProgress from "@mui/material/CircularProgress";

const AuthLoading = () => {
    return (<div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <CircularProgress />
    </div>);
}

export default AuthLoading;