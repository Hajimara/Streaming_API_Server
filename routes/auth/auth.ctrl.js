import jwt from 'jsonwebtoken';

import User from '../../schemas/user';

const login = async (req, res) => {
  // TODO: 로그인 부분 제작하기
  try {
    // exec() promise
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(400).send({
        code: 400,
        message: 'The Email Does Not Exist',
      });
    }

    user.comparePassword(req.body.password, (error, match) => {
      if (!match) {
        return res.status(400).send({
          code: 400,
          message: 'The password is invalid',
        });
      }
    });

    const token = jwt.sign({
      _id: user._id,
      email: user.email,
    }, process.env.JWT_SECRET, {
      expiresIn: '1h',
      issuer: 'apiServer',
    });

    return res.status(200).send({
      code: 200,
      message: 'Successful Login',
      token,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

const findUser = async (req, res) => {
  try {
    const users = await User.find({});

    return res.status(200).send({
      code: 200,
      message: 'success',
      users,
    });
  } catch (e) {
    return res.status(500).send({
      code: 500,
      message: e,
    });
  }
};

const register = async (req, res) => {
  try {
    const user = new User(req.body);

    user.save((err) => {
      if (err) {
        return res.status(500).send({
          code: 500,
          message: err,
        });
      }
      return res.status(200).send({
        code: 200,
        message: 'success',
      });
    });
  } catch (e) {
    return res.status(500).send({
      code: 500,
      message: e,
    });
  }
};

export {
  login,
  findUser,
  register,
};
