import mongoose from "mongoose"
import config from "../config/config"

mongoose.connect(config.db_url)
    .then(() => console.log("DB connected"))
    .catch((error) => {
        if (error)
            throw new Error(error)
    })