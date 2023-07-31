const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      // useCreateIndex: true,
      // useFindAndModify: true,
      // useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log('Db is Connected Successfully');
  } catch (error) {
    console.log(`Error ${error.message}`);
  }
};

module.exports = dbConnect;
