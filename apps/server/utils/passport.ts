import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma";

passport.serializeUser(function (user: any, done: any) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done: any) {
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_OAUTH_CLIENTID!,
      clientSecret: process.env.GITHUB_OAUTH_SECRET!,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL! ||
        "http://localhost:8000/oauth/redirect/github",
      passReqToCallback: true,
      scope: ["user"],
    },
    async function (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      //TODO: just complete the user authentication with the controller
      return done(null, profile);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENTID!,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET!,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL! ||
        "http://localhost:8000/oauth/redirect/google",
      passReqToCallback: true,
    },
    async function (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      /*
        profile example:
        profile.id
        profile.emails[0].value
        profile.displayName
        profile.photos[0].value
      */

      // TODO: handle user persistence with Prisma
      return done(null, profile);
    }
  )
);
