import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const clientOptions = {
      serverApi: { version: "1", strict: false, deprecationErrors: true },
    };
    const { connection } = await mongoose.connect(
      "mongodb+srv://madhyayuga:memby%40098@madhyayuga.b4mxvx7.mongodb.net/?retryWrites=true&w=majority&appName=Madhyayuga",
      clientOptions
    );

    // const { connection } = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${connection.host}`);
  } catch (error) {
    console.log("error", error);
    process.exit(1);
  }
};
