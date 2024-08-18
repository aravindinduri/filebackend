import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: String,
  url: String,  
  size: Number,
  contentType: String,
}
);

const File = mongoose.model('File', fileSchema);

export default File;
