const orderStatusColor = (status) => {
  let chipColor = {};
  switch (status) {
    case 'Waiting Payment':
      break;
    case 'Processing':
      chipColor = {
        color: "#0288d1",
        bgcolor: "rgba(2, 136, 209, 0.12)",
      };
      break;
    case 'On Delivery':
      chipColor = {
        color: "#0288d1",
        bgcolor: "rgba(2, 136, 209, 0.12)",
      };
      break;
    case 'Delivered':
      chipColor = {
        color: "#005824",
        bgcolor: "rgba(0, 88, 36, 0.12)",
      };
      break;
    case "Canceled":
      chipColor = {
        color: "#ff1744",
        bgcolor: "rgba(255, 23, 68, 0.12)",
      };
      break;
    case "Returned":
      chipColor = {
        color: "#ed6c02",
        bgcolor: "rgba(237, 108, 2, 0.12)",
      };
      break;
    default:
      break;
  }
  return chipColor;
};
export default orderStatusColor;