import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.models';

export interface IBlog extends Document {
    title: string;
    description: string;
    content: any[];
    slug: string;
    bannerImage?: string;
    author: IUser['_id'];
    isPublished?: boolean;
    tags: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [3, 'Description must be at least 3 characters'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    content: [{
        type: [Schema.Types.Mixed],
        required: [true, 'Content is required']
    }],
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    bannerImage: {
        type: String,
        required: false
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: {
        type: [String],
        required: false
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add indexes for better query performance
blogSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IBlog>('Blog', blogSchema);