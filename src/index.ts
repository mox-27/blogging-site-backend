import express from 'express';
import cors from 'cors';
import { config } from 'dotenv'
config();

import userRouter from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import blogsRoutes from './routes/blogs.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.all('/', (req, res) => {
    res.send("Server is running");
})

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/blogs', blogsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is started on ${PORT}`));