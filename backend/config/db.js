import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://musa24:musa24@cluster0.qgt58.mongodb.net/proshop?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    );
    console.log('Database is connected');
  } catch (error) {
    console.log(error);
  }
};

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useFindAndModify: false,
//       useCreateIndex: true,
//     });
//     console.log('Database is connected');
//   } catch (error) {
//     console.log(error);
//   }
// };

export default connectDB;
