
import "dotenv/config";
import app from "./app.js";
import connectDb from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });

  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();
