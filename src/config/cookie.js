export const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearTokenCookie = (res) => {
  res.clearCookie("token");
};

export const getTokenFromCookie = (req) => {
  return req.cookies?.token || null;
};
