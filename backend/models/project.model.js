import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    require: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trime: true,
    require: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  fileTree: {
    type: Object,
    default: {},
  },
  refreshToken: {
    type: String,
  },
});

const Project = mongoose.model("project", projectSchema);

export default Project;
