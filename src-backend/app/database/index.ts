import mongoose from 'mongoose';

export const connect = () =>
  mongoose.connect(process.env.DB_CONNECTION_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
