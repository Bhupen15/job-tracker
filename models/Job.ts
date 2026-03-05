import mongoose, { Schema, Document } from 'mongoose'

// Export this so other files can use it as a type
export interface IJobDocument extends Document {
  userId:    string
  company:   string
  role:      string
  location?: string
  salary?:   string
  status:    'applied' | 'interview' | 'offer' | 'rejected'
  url?:      string
  notes?:    string
  createdAt: Date
  updatedAt: Date
}

const JobSchema = new Schema<IJobDocument>(
  {
    userId:   { type: String, required: true, index: true },
    company:  { type: String, required: true, trim: true },
    role:     { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    salary:   { type: String, trim: true },
    status:   { type: String, enum: ['applied', 'interview', 'offer', 'rejected'], default: 'applied' },
    url:      { type: String, trim: true },
    notes:    { type: String, trim: true },
  },
  { timestamps: true }
)

export default mongoose.models.Job ||
  mongoose.model<IJobDocument>('Job', JobSchema)