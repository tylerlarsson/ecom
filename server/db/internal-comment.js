const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { DEFAULT_OPTIONS } = require('./common');
const { error404 } = require('../core/util');
const User = require('./user');

/* eslint-disable */
const INTERNAL_COMMENT = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: 'user', required: true },
    content: { type: String, required: true },
    commentator: { type: ObjectId, ref: 'user', required: true },
    created: Date
  },
  DEFAULT_OPTIONS
);

INTERNAL_COMMENT.statics.create = async args => {
  const [target, commentator] = await Promise.all([User.findById(args.user), User.findById(args.commentator)]);
  if (!target)
    throw error404({target}, args.user);
  if (!commentator)
    throw error404({commentator}, args.commentator);

  const comment = await new InternalComment({ created: new Date(), ...args }).save();
  await target.addNote(comment._id);
  return comment;
};

INTERNAL_COMMENT.statics.delete = async id => {
  const comment = await InternalComment.findById(id);
  if (!comment)
    throw error404({ comment }, id);
  const user = await User.findById(comment.user);
  await user.deleteNote(comment._id);
  return comment;
};


const InternalComment = mongoose.model('internal-comment', INTERNAL_COMMENT);

module.exports = InternalComment;
