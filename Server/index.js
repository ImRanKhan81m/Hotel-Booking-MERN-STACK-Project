import express from "express"
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRouter from "./routes/auth.js"
import usersRouter from "./routes/users.js"
import hotelsRouter from "./routes/hotels.js"
import roomsRouter from "./routes/rooms.js"
import cookieParser from "cookie-parser"
import cors from "cors"

 
const app = express();
dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("connected to mongoDB");
    } catch (error) {
        throw error
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected");
});
mongoose.connection.on("connected", () => {
    console.log("mongoDB connected");
});

app.get("/", (req, res) => {
    res.send("Hello, This is Hotel Booking Backend Server")
})

// middleware
app.use(cookieParser())
app.use(cors())
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/rooms", roomsRouter);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.listen(5000, () => {
    connect();
    console.log("connected to database!");
})

