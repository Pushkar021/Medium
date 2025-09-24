import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { userRouter } from './Routes/userRoutes'
import { blogRoutes } from './Routes/blogRoutes'
import { cors } from 'hono/cors'
interface ENV{
  DATABASE_URL:string
}
//it will specify the type of environment varibale
const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWTPASS:string
  }
}>()

app.use(cors())

const getPrisma = (env:ENV)=>{
  return new PrismaClient({datasourceUrl:env.DATABASE_URL}).$extends(withAccelerate())
  
}




app.get("/", async (c) => {
  const prisma = getPrisma(c.env);
    const users = await prisma.user.findMany()
    return c.json({users});
  });



app.route("/api/v1/user",userRouter)
app.route("/api/v1/blog",blogRoutes)  






export default app
