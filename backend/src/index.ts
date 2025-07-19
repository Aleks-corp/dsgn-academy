import mongoose from "mongoose";
import "dotenv/config";
// import axios from "axios";

import app from "./app.js";

const { DB_HOST = "", PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connection successful on port ${PORT}`);
    });
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown Error");
    }
    process.exit(1);
  });
