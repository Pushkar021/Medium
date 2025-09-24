import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";
import { sign, verify } from "hono/jwt";
import { validatrUserSchema, validatrUserSchema2 } from "pushkar-blog-common";
import axios from "axios";

interface ENV {
  DATABASE_URL: string;
}

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWTPASS: string;
  };
}>();

const getPrisma = (env: ENV) =>
  new PrismaClient({ datasourceUrl: env.DATABASE_URL }).$extends(
    withAccelerate()
  );

//signup route

userRouter.post("/signup", async (c) => {
  const prisma = getPrisma(c.env);

  const body = await c.req.json();
  const parser = validatrUserSchema.safeParse(body);

  if (parser.success) {
    const { email, name, password } = parser.data;
    try {
      const hashedpass = await bcrypt.hash(password, 10);
      const create = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedpass,
        },
      });
      const jwtpass = await sign({ id: create.id }, c.env.JWTPASS);
      return c.json({
        message: jwtpass,
        name: name,
      });
    } catch (e) {
      c.status(500);
      console.log(e);
      return c.json({
        message: "something up with the server or try different email",
      });
    }
  } else {
    console.log(parser.error);
    return c.json({
      message: parser.error,
    });
  }
});

//sign in route

userRouter.post("/signin", async (c) => {
  const prisma = getPrisma(c.env);
  const { email, password } = await c.req.json();
  const body = await c.req.json();
  const parser = validatrUserSchema2.safeParse(body);
  if (parser.success) {
    try {
      const validateuser: any = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (!validateuser) {
        c.status(404);
        return c.json({
          message: "user does not exist",
        });
      }
      const result = await bcrypt.compare(password, validateuser.password);
      if (!result) {
        c.status(403);
        return c.json({
          message: "passaword is wrong",
        });
      }
      const jwtpass = await sign({ id: validateuser.id }, c.env.JWTPASS);
      return c.json({
        message: jwtpass,
        name: validateuser.name || "",
      });
    } catch (e) {
      c.status(500);
      return c.json({
        message: "something up with the server",
      });
    }
  } else {
    console.log(parser.error);
    c.status(500);
    return c.json({
      message: parser.error,
    });
  }
});

//user route for google login
userRouter.post("/auth/google", async (c) => {
  const { token } = await c.req.json();
  const prisma = getPrisma(c.env);

  try {
    const googleResponse = await axios.get<{
      email: string;
      name: string;
      picture: string;
    }>(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);

    const { email, name, picture } = googleResponse.data;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: null,
          provider: "google",
          profilepicture: picture,
        },
      });
    }

    // always return JWT
    const jwtpass = await sign({ id: user.id }, c.env.JWTPASS);

    return c.json({
      message: "Login success",
      jwt: jwtpass,
      picture:user.profilepicture,
      Name:name
    });
  } catch (error) {
    console.error("Google login error:", error);
    return c.json({ error: "Invalid Google token" }, 400);
  }
});


//get user by the id

userRouter.get("/getuser/:id", async (c) => {
  const getid = c.req.param("id");
  const prisma = await getPrisma(c.env);

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: getid,
      },
    });
    if (!user) {
      c.status(411);
      return c.json({
        message: "User does not exist anymore",
      });
    }
    c.status(200);
    return c.json({
      name: user.name,
    });
  } catch (e) {
    c.status(404);
    return c.json({
      message: "user not found",
    });
  }
});
