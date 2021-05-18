import Mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = Mongoose;
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error);
        user.password = hash;
        return next();
      });
    });
  }
});

UserSchema.methods.comparePassword = function (plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

const UserModel = new Mongoose.model('user', UserSchema);

export default UserModel;
