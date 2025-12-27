import type { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type { RegisterUser } from "../utils/type";
import { generateAccessToken } from "../utils/jwt";
import prisma from "@devhire/prisma";
import cloudinaryService from "../service/Cloudinary.service";

class UserController {
  async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password }: RegisterUser = req.body;
      if (!name || !email || !password) {
        throw new Error("all fields are required");
      }

      const dbUser = await prismaClient.user.findFirst({
        where: {
          email,
        },
      });

      if (dbUser) throw new Error("user already exists");

      const hashedPassword: string = await this.helperHashPassword(password);

      const createdUser = await prismaClient.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          username: uuid(),
        },
        select: {
          password: false,
          phoneNumber: false,
        },
      });

      if (!createdUser) throw new Error("registering user failed!");

      return res
        .status(200)
        .json(apiResponse(200, "user created successfully", createdUser));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async registerOAuthUser(email: string, name: string) {
    try {
      const dbUser = await prismaClient.user.findFirst({
        where: {
          email: email,
        },
      });

      if (dbUser) throw new Error("user already exists! Login In");
      const createdUser = await prismaClient.user.create({
        data: {
          name,
          email,
          password: uuid(),
          username: uuid(),
        },
        select: {
          password: false,
          phoneNumber: false,
        },
      });

      if (!createdUser) throw new Error("could not register user");

      return createdUser;
    } catch (error: any) {
      console.log(error);
      return null;
    }
  }
  async helperHashPassword(password: string) {
    if (!password) throw new Error("Password is missing");

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    return hashed;
  }
  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        throw new Error("email and password are missing");

      const dbUser = await prismaClient.user.findFirst({
        where: {
          email,
        },
        select: {
          email: true,
          username: true,
          name: true,
          password: true,
        },
      });

      if (!dbUser) throw new Error("user not found! kindly log in");

      const hashedPassword = await this.helperHashPassword(password);
      if (hashedPassword !== dbUser.password)
        throw new Error("Invalid password");

      const generateToken = generateAccessToken(dbUser);

      const updatedUser = await prismaClient.user.update({
        where: {
          email: dbUser.email,
        },
        data: {
          refreshToken: generateToken,
        },
        select: {
          password: false,
          phoneNumber: false,
        },
      });

      if (!updatedUser) throw new Error("could not update user");

      return res
        .header("Set-Cookie", `bearer ${generateToken}`)
        .status(200)
        .json(apiResponse(200, "user logged in successfully", null));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  async loginOAuthUser(email: string) {
    try {
      const dbUser = await prismaClient.user.findFirst({
        where: {
          email,
        },
        select: {
          email: true,
          username: true,
          name: true,
          password: true,
        },
      });

      if (!dbUser) throw new Error("user not found! kindly log in");

      const generateToken = generateAccessToken(dbUser);

      const updatedUser = await prismaClient.user.update({
        where: {
          email: dbUser.email,
        },
        data: {
          refreshToken: generateToken,
        },
        select: {
          password: false,
          phoneNumber: false,
        },
      });

      if (!updatedUser) throw new Error("could not update user");

      return updatedUser;
    } catch (error: any) {
      console.log(error);
      return null;
    }
  }
  async resetPassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        return res
          .status(200)
          .json(apiResponse(400, "Email and new password are required", null));
      }

      const user = await prismaClient.user.findFirst({ where: { email } });
      if (!user) throw new Error(" user not found ");

      const hashed = await this.helperHashPassword(newPassword);

      // Update DB
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { password: hashed },
        select: {
          password: false,
          phoneNumber: false,
        },
      });

      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "Password reset successfully. You can now log in with your new password.",
            updatedUser
          )
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params;

      const dbUser = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          password: false,
          refreshToken: false,
        },
      });

      if (!dbUser) throw new Error("no such user could be found!");

      return res.status(200).json(apiResponse(200, "user found", dbUser));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;

      const dbUser = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new Error("no registered user found");
      const { name, bio, tagLine, linkedin } = req.body;

      if (!name && !bio && !tagLine && !linkedin)
        throw new Error("atleast one of the field is required");

      const updateProfile = await prismaClient.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          name: name ?? dbUser.name,
          bio: bio ?? dbUser.bio,
          tagline: bio ?? dbUser.tagline,
          linkedinProfile: linkedin ?? dbUser.linkedinProfile,
        },
        select: {
          password: false,
          phoneNumber: false,
        },
      });

      if (!updateProfile) throw new Error("unable to update your profile");

      return res
        .status(200)
        .json(apiResponse(200, "updated profile", updateProfile));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async addInterviwerData(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;

      const dbUser = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new Error("no registered user found");
      if (dbUser.role === "CANDIDATE")
        throw new Error("candidate cannt have interviewer data");

      const { organization, company_role } = req.body;
      const createInterviewer = await prisma.interviewer.create({
        data: {
          userId: dbUser.id,
          organization,
          company_role,
        },
      });

      const updateUserProfile = await prisma.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          role: "INTERVIEWER",
          roleId: createInterviewer.id,
        },
        select: {
          password: false,
          phoneNumber: false,
        },
      });

      if (!updateUserProfile)
        throw new Error("could not update interviewer profile");

      return res
        .status(200)
        .json(apiResponse(200, "added interviewer profile", updateUserProfile));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateInterviwerData(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;

      const dbUser = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new Error("no registered user found");
      if (dbUser.role === "CANDIDATE")
        throw new Error("candidate cannt have interviewer data");

      const interviewerProfile = await prismaClient.interviewer.findFirst({
        where: {
          id: dbUser.roleId!,
        },
      });

      if (!interviewerProfile) throw new Error("complete onboarding first");
      const { organization, company_role } = req.body;
      const updatedInterviewerProfile = await prismaClient.interviewer.update({
        where: {
          id: dbUser.roleId!,
        },
        data: {
          organization: organization ?? interviewerProfile.organization,
          company_role: company_role ?? interviewerProfile.company_role,
        },
      });

      if (!updatedInterviewerProfile)
        throw new Error("could not update interviewer profile");

      return res
        .status(200)
        .json(apiResponse(200, "updated interviewer profile", null));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async addcandidateData(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;

      const dbUser = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new Error("no registered user found");
      if (dbUser.role === "INTERVIEWER")
        throw new Error("interviewer cannt have candidate data");

      const {
        githubUserName,
        leetcodeUserName,
        codeforceUserName,
        mediumUserName,
      } = req.body;
      const createInterviewer = await prisma.candidate.create({
        data: {
          userId: dbUser.id,
          githubUserName,
          leetcodeUserName,
          codeforceUserName,
          mediumUserName,
        },
      });

      const updateUserProfile = await prisma.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          role: "CANDIDATE",
          roleId: createInterviewer.id,
        },
        select: {
          password: false,
          phoneNumber: false,
        },
      });

      if (!updateUserProfile)
        throw new Error("could not update candidate profile");

      return res
        .status(200)
        .json(apiResponse(200, "added candidate profile", updateUserProfile));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateCandidateData(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;

      const dbUser = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new Error("no registered user found");
      if (dbUser.role === "INTERVIEWER")
        throw new Error("interviewer cannt have candidate data");

      const candidateProfile = await prismaClient.candidate.findFirst({
        where: {
          id: dbUser.roleId!,
        },
      });

      if (!candidateProfile) throw new Error("complete onboarding first");
      const {
        githubUserName,
        leetcodeUserName,
        codeforceUserName,
        mediumUserName,
      } = req.body;

      const updatedCandidateProfile = await prismaClient.candidate.update({
        where: {
          id: dbUser.roleId!,
        },
        data: {
          githubUserName: githubUserName ?? candidateProfile.githubUserName,
          leetcodeUserName:
            leetcodeUserName ?? candidateProfile.leetcodeUserName,
          codeforceUserName:
            codeforceUserName ?? candidateProfile.codeforceUserName,
          mediumUserName: mediumUserName ?? candidateProfile.mediumUserName,
        },
      });

      if (!updatedCandidateProfile)
        throw new Error("could not update candidate profile");

      return res
        .status(200)
        .json(apiResponse(200, "updated candidate profile", null));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  //TODO: use cloudinary service for now later on use S3 Bucket
  async uploadCandidateResume(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;

      const dbUser = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new Error("no registered user found");
      if (dbUser.role === "INTERVIEWER")
        throw new Error("interviewer can't upload their resume!");
      if (!req.file) throw new Error("avatar is required!");

      const candidateId = dbUser.roleId;
      if (!candidateId) throw new Error("complete signing in first!");
      const uniqueFilename = `${req.file.originalname}_resume_${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(
        req.file,
        "notes",
        uniqueFilename
      );
      if (!fileLink) throw new Error("file upload failed");
      //TODO: add a text extracter service here and put it into an AI Model for getting yaml
      const candidateUser = await prismaClient.candidate.update({
        where: {
          id: candidateId,
        },
        data: {
          resume: fileLink,
        },
      });

      if (!candidateUser) throw new Error("resume couldn't be parsed");

      return res
        .status(200)
        .json(apiResponse(200, "resume uploaded", candidateUser));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async changeAvatar(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;

      const dbUser = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new Error("no registered user found");
      if (!req.file) throw new Error("avatar is required!");

      const uniqueFilename = `${req.file.originalname}_${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(
        req.file,
        "notes",
        uniqueFilename
      );

      const updatedUser = await prismaClient.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          avatar: fileLink,
        },
        select: {
          id: true,
          email: true,
          username: true,
          avatar: true,
        },
      });

      if (!dbUser) throw new Error("");

      return res
        .status(200)
        .json(apiResponse(200, "avatar changed successfully", updatedUser));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  async sendVerificationOTP(req: Request, res: Response) {}
  // match the expected OTP
  async matchVerificationOTP(req: Request, res: Response) {}
}
export default new UserController();
