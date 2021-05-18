const mongoose = require('mongoose');

const userDB = process.env.DB_USER_PASS

mongoose
    .connect(
        `mongodb+srv://${userDB}@cluster0.fp0ul.mongodb.net/pintobook?retryWrites=true&w=majority`,
        
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log("Failed to connect  to MongoDB", err))