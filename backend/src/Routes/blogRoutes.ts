import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import {} from "pushkar-blog-common";
import { createBlogSchema, updateBlogSchema } from "pushkar-blog-common";

export const blogRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWTPASS: string;
  };
  Variables: {
    jwtPayload: string;
  };
}>();

interface ENV {
  DATABASE_URL: string;
}
const getPrisma = (env: ENV) => {
  return new PrismaClient({ datasourceUrl: env.DATABASE_URL }).$extends(
    withAccelerate()
  );
};

blogRoutes.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  let payload;
  try {
    payload = await verify(token, c.env.JWTPASS);
    c.set("jwtPayload", payload.id);
    await next();
  } catch (e) {
    return c.json({ error: "Invalid token" }, 401);
  }
});

//post a blog into it
blogRoutes.post("/test", async (c) => {
  try {
    const userid = c.get("jwtPayload");
    const prisma = await getPrisma(c.env);
    const userinfo = await prisma.user.findFirst({
      where: {
        id: userid,
      },
    });
    if (!userinfo) {
      return c.json(
        {
          message: "invalid Input",
        },
        401
      );
    }
    const { title, content, authorId, imagelink, autherName } =
      await c.req.json();
    const body = await c.req.json();
    const parser = await createBlogSchema.safeParse(body);
    if (!parser.success) {
      return c.json(
        {
          message: "blog input is not valid!!",
        },
        401
      );
    }
    try {
      let blog = await prisma.post.create({
        data: {
          title: body.title,
          content: body.content,
          authorId: userid,
          imagelink: body.imagelink,
          autherName: userinfo?.name || "Anonymous",
          published: true,
        },
      });
      return c.json({
        message: blog,
      });
    } catch (e) {
      console.error(e);
      c.status(500);
      return c.json({ message: "Error Creating Blog Post" });
    }
  } catch (error) {
    return c.json({
      message: "something up with the server or invalid way to send the inputs",
    });
  }
});

blogRoutes.get("/test/myblog", async (c) => {
  try {
    const userid = c.get("jwtPayload");
    const prisma = await getPrisma(c.env);

    const result = await prisma.post.findMany({
      where: { authorId: userid },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({ data: result }, 200);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return c.json({ error: "Failed to fetch blogs" }, 500);
  }
});
blogRoutes.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    c.status(200);
    return c.json({ blogs });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Error fetching blogs" });
  }
});

// Get all blogs
blogRoutes.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    c.status(200);
    return c.json({ blogs });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Error fetching blogs" });
  }
});

blogRoutes.put("/test", async (c) => {
  const prisma = getPrisma(c.env);
  const body = await c.req.json();
  const parser = updateBlogSchema.safeParse(body);
  if (!parser.success) {
    return c.json(
      {
        message: "input is not valid",
      },
      400
    );
  }
  try {
    const blog = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
        imagelink: body.imagelink || "", //if you want to add image too if not then its fine
      },
    });
    c.status(200);
    return c.json({ message: blog });
  } catch (e) {
    return c.json({ message: e });
  }
});

blogRoutes.get("/search/:title",async (c)=>{
  const prisma = getPrisma(c.env)
  const title = await c.req.param("title")
  try{
    const result = await prisma.post.findMany({
      where:{
        title:{
        contains:title,
        mode:"insensitive"
      }
      }
    })
    return c.json({
      message:result
    },200)
  }
  catch(e){
    return c.json({
      message:"no such blog with given title found"
    },400)
  }

})


blogRoutes.delete("/test/:id", async (c) => {
  const blogid =  c.req.param("id");
 console.log(blogid)
  const prisma = await getPrisma(c.env);
  try {
    const result = await prisma.post.delete({
      where: {
        id: blogid,
      },
    });
    return c.json({
      message: "Blog deleted!",
    });
  } catch (err) {
    console.log(err)
    return c.json(
      {
        message: "id is wrong",
      },
      400
    );
  }
});



blogRoutes.get("/test/:id", async (c) => {
  const blogid = await c.req.param("id");
  const prisma = await getPrisma(c.env);
  try {
    const result = await prisma.post.findMany({
      where: {
        id: blogid,
      },
    });
    return c.json({
      message: result,
    });
  } catch (e) {
    return c.json(
      {
        message: "id is wrong",
      },
      400
    );
  }
});



///saved logic
blogRoutes.get("/savedblog/:id", async (c) => {
  const postId = c.req.param("id");
  const prisma = await getPrisma(c.env);

  try {
    const blog = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!blog) {
      return c.json({ error: "Blog not found" }, 404);
    }
    const userId = c.get("jwtPayload");
    const newLike = await prisma.like.create({
      data: { userId, postId },
    });
    return c.json({ message: "Blog saved successfully", like: newLike });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Something went wrong" }, 500);
  }
});


blogRoutes.get("/check/savedblog/:id", async (c) => {
  const postid = c.req.param("id");
  const prisma = await getPrisma(c.env);
  const userid = c.get("jwtPayload"); // assuming jwtPayload contains userId

  try {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userid,
          postId: postid,
        },
      },
    });

    if (like) {
      return c.json(true); 
    } else {
      return c.json(false); 
    }
  } catch (error) {
    console.error(error);
    return c.json(false, 500); // default false if error occurs
  }
});


blogRoutes.get("/savedblog", async (c) => {
  const prisma = await getPrisma(c.env);
  const userId = c.get("jwtPayload"); // Assuming this is the logged-in user's ID

  try {
    const likedPosts = await prisma.like.findMany({
      where: { userId },
      include: {
        post: true, // include the full post object
      },
    });

    // Extract just the post data if you don't need the Like model info
    const posts = likedPosts.map((like) => like.post);

    return c.json({ posts });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Something went wrong" }, 500);
  }
});
  


blogRoutes.get("/check/savedblog/:id", async (c) => {
  const postid = c.req.param("id");
  const prisma = await getPrisma(c.env);
  const userid = c.get("jwtPayload"); // assuming jwtPayload contains userId

  try {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userid,
          postId: postid,
        },
      },
    });

    if (like) {
      return c.json(true); 
    } else {
      return c.json(false); 
    }
  } catch (error) {
    console.error(error);
    return c.json(false, 500); // default false if error occurs
  }
});

blogRoutes.delete("/savedblog/:id", async (c) => {
  const postid = c.req.param("id");
  const prisma = await getPrisma(c.env);
  const userid = c.get("jwtPayload"); // assuming jwtPayload contains userId

  try {
    const like = await prisma.like.delete({
      where: {
        userId_postId: {
          userId: userid,
          postId: postid,
        },
      },
    });

    if (like) {
      return c.json(true); 
    } else {
      return c.json(false); 
    }
  } catch (error) {
    console.error(error);
    return c.json(false, 500); // default false if error occurs
  }
});


