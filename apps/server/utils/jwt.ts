import jwt from "jsonwebtoken";

/**
 * take the useremail and id and hash them to generate the accesstoken with 1 day expiry
 * again hash the useremail and id to generate a refersh token with 20 day expiry
 */
export function generateFreshTokens(payload: any) {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken };
}
/**
 * incase when the access token gets expired, then generate a new accesstoken but before that check
 * for the refreshToken verification
 */
export function generateAccessToken(payload: any) {
  //TODO: verify pre-existing refreshToken

  const options = {
    expiresIn: "1d", // Token expiration time
  };
  //@ts-ignore
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, options);
  return token;
}
/**
 * incase when the refresh token gets expired, then generate a new refreshtoken
 */
export function generateRefreshToken(payload: any) {
  const options = {
    expiresIn: "20d", // Token expiration time
  };
  //@ts-ignore
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, options);
  return token;
}
/**
 * decode the accessToken here.
 */
export function verifyAccessToken(accessToken: string) {}
function verifyRefreshToken(refreshToken: string) {}
