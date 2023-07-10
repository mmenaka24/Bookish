import "dotenv/config";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import db from "./db";
import SECRET from "./SECRET";

//jwt boilerplate
//decoding the token - checking it's real and not made up
export const jwtStrat = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
    jsonWebTokenOptions: { algorithms: ["HS256"] },
  },
  async (payload, done) => {
    try {
      let user = await db.one(
        "SELECT * FROM member WHERE UserID = $1",
        payload.sub
      );

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (e) {
      return done(e, false);
    }
  }
);

passport.use(jwtStrat);

export default passport.authenticate("jwt", { session: false });
