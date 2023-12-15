export const getFormattedHostUrl = (host = "") =>
  `${host.includes("localhost") ? "http" : "https"}://${host}`;
