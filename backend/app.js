const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require('./routes/authRoutes')
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const adminRoutes = require('./routes/adminRoutes')
const ownerRoutes = require("./routes/ownerRoutes");
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Store Rating API Running"
    });

});


app.use("/api/auth", authRoutes);

app.use("/api/stores", storeRoutes);

app.use("/api/ratings", ratingRoutes);

app.use('/api/admin',adminRoutes)

app.use('/api/owner',ownerRoutes)


app.use((req,res)=>{

return res.status(404).json({

success:false,

message:"Route not found"

});

});

module.exports = app;