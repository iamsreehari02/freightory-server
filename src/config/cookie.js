export const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", // true in prod (HTTPS)
    sameSite: "lax", 
    path: "/", 
    domain: process.env.NODE_ENV === "production" ? ".indlognetwork.com" : "localhost", 
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearTokenCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".indlognetwork.com" : "localhost",
  });
};




export const getTokenFromCookie = (req) => {
  return req.cookies?.token || null;
};
