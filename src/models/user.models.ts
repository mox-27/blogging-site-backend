import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    role: 'User' | 'Admin';
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the schema
const userSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 3,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User',
    }
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});


export default mongoose.model<IUser>('User', userSchema);