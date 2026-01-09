import { optional } from "superstruct";
import { ACCESS_TOKEN_COOKIE_NAME } from "../lib/constants.js";
import { prismaClient } from "../lib/prismaClient.js";
import { verifyAccessToken } from "../lib/token.js";
function authenticate(options = { optional: false }) {
  return async (req, res, next) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    console.log("test1");
    if (!accessToken) {
      return res.status(401).send({ message: "Authenticaion required" });
    }
    console.log("test2");
    try {
      const { userId } = verifyAccessToken(accessToken);
      const user = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      req.user = user;
      console.log("test3");
    } catch (error) {
      if (options.optional) {
        return next();
      }
      console.log("test4");
      return res.status(401).send({ message: "Authenticaion required" });
    }
    console.log("test5");
    next();
  };
}
export { authenticate };
