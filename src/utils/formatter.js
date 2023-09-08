export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const upperCaseFirstLetter = (words) => {
  return words
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.substr(1))
    .join(" ");
};

export const toSnakeCase = (words) => {
  return words.toLowerCase().replace(/\W/g, "_");
};

export const snakeCaseToNormal = (words) => {
  return words.replace(/[_]/g, " ");
};

// Create our number formatter.
export const toCurrency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const queryObjectToUrl = (qObj, prefix) => {
  const yy = Object.keys(qObj).map((str) => {
    return str + "=" + qObj[str];
  });
  if (yy.length) {
    return (prefix ? prefix : "") + yy.join("&");
  }
  return prefix ? prefix.replace("?", "") : "";
};
