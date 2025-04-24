import express from 'express';
import cors from 'cors';
import { config } from 'dotenv'
config();

import userRouter from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import blogsRoutes from './routes/blogs.routes';
import { connectDB } from './config/db.conn';
import cookieParser from 'cookie-parser';
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.all('/', (_req, res) => {
    res.send("🚀 Server is running — API is alive and kicking!");
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/blogs', blogsRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server is started on ${PORT}`));
});
