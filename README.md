# NoteFlow 📝

**NoteFlow** is a powerful, modern, full-stack note-taking application designed to help you capture, organize, and manage your thoughts effortlessly. Built with a robust **Next.js** frontend and a scalable **Express/MongoDB** backend, NoteFlow offers a premium user experience with cloud synchronization, rich features, and a beautiful interface.

---

## ✨ Key Features

- **🔐 Secure Authentication**  
  Complete authentication system using JWT with HTTP-only cookies for maximum security. Includes logic for password changes and account management.

- **📝 Efficient Note Management**  
  Create, edit, delete, pin, archive, and trash notes. Organize your thoughts just the way you like.

- **📂 Smart Organization**  
  Group related notes into custom, color-coded folders. Navigate easily through your workspace with a collapsible sidebar.

- **🎨 Modern & Responsive UI**  
  A stunning user interface featuring a persistent **Dark/Light mode**, **Grid/List views**, and smooth animations (powered by Shadcn UI & Framer Motion).

- **🖼️ Rich Profile System**  
  Update your personal details and upload custom profile pictures with integrated **Cloudinary** support.

- **⚙️ Advanced Preferences**  
  Customize your experience with settings for specific view modes, auto-save preferences, and data export (JSON).

- **🔍 Global Search**  
  Instantly find any note with a powerful, real-time search functionality.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **State Management:** Zustand (with persistence)
- **Styling:** Tailwind CSS, Shadcn UI
- **Networking:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **File Storage:** Cloudinary
- **Middleware:** Multer (File Uploads), Cookie Parser, CORS

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas Cluster)
- [Cloudinary](https://cloudinary.com/) Account (for image uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/SahilSahu731/React-Notes_app.git
cd my-notes
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add your environment variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<your-username>:<your-password>@cluster0.mongodb.net/noteflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
npm install
```

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

### 4. Usage

Open your browser and visit [http://localhost:3000](http://localhost:3000). You can now sign up, log in, and start creating notes!

---

## 📁 Project Structure

```bash
my-notes/
├── client/                 # Next.js Frontend application
│   ├── src/
│   │   ├── app/            # App Router pages ((auth), (user), dashboard, etc.)
│   │   ├── components/     # Reusable UI components (Sidebar, Navbar, Cards)
│   │   ├── lib/            # Utilities, Zustand Stores, API services
│   │   └── ...
│
├── server/                 # Express Backend API
│   ├── config/             # Database and Service configurations
│   ├── controllers/        # Request logic (User, Note, Folder)
│   ├── middlewares/        # Auth checks, File handling
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # API route definitions
│   └── ...
```

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
