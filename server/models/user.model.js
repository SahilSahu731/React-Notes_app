import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // 📧 Basic Auth Info
    name: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false, 
    },
    role : {
        type : String,
        enum: ["user", "admin", "moderator"],
        default : "user"
    },

    // 🪪 OAuth / Social Logins
    googleId: String,
    githubId: String,
    // 🧑‍🎨 Profile
    avatar: {
      type: String,
      default: "https://api.dicebear.com/7.x/initials/svg?seed=User",
    },
    bio: {
      type: String,
      maxlength: 200,
      default: "Hey there!  I'm using the Notes App.",
    },
    website: String,

    // ⚙️ Preferences
    preferences: {
      theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
      language: { type: String, default: "en" },
      autosaveInterval: { type: Number, default: 30 }, // in seconds
      shortcuts: {
        save: { type: String, default: "Ctrl+S" },
        newNote: { type: String, default: "Ctrl+N" },
        search: { type: String, default: "Ctrl+F" },
      },
    },

    // 🤖 AI Personalization
    ai: {
      model: { type: String, default: "gpt-4-turbo" },
      tone: { type: String, enum: ["formal", "casual", "creative"], default: "casual" },
      useHistory: { type: Boolean, default: true },
    },

    // 🔐 Security
    isVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    lastLogin: { type: Date },
    sessions: [
      {
        device: String,
        ip: String,
        loggedInAt: { type: Date, default: Date.now },
      },
    ],

    // 📊 Analytics / Usage
    noteCount: { type: Number, default: 0 },
    totalStorageUsed: { type: Number, default: 0 }, // bytes
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },

    // 🔗 Connections / Social
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // 🕒 Metadata
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

//
// 🔑 Password hashing middleware
//
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//
// 🔍 Method to verify password
//
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;