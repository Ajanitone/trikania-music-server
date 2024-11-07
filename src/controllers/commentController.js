import Post from "../models/Post.js";

export const addComment = async (req, res) => {
  try {
    console.log("🇯🇲 hello addComment ", req.body);

    const post = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: {
          comments: {
            text: req.body.text,
            author: req.user,
          },
        },
      },
      { new: true }
    ).populate({
      path: "comments.author",
      select: "username email profileImage ",
    });

    console.log("🇯🇲 addComment ~ post", post);

    res.send({ success: true, comments: post.comments });
  } catch (error) {
    console.log("🇯🇲 addComment ~ error", error.message);

    res.send({ success: false, error: error.message });
  }
};

// export const listComment = async (req, res) => {
//   try {
//     console.log(" 🇯🇲 hello listComment ");

//     const comments = await Comment.find()
//       .select("-__v")
//       .populate({ path: "author", select: "username email image profileImage" }) // post owner
//       .populate({ path: "postId", select: "_id text" }); // postId

//     res.send({ success: true, comments });
//     console.log("🇯🇲 hello listComment ", comments);
//   } catch (error) {
//     console.log(" 🇯🇲 listComments ~ error", error.message);

//     res.send({ success: false, error: error.message });
//   }
// };

export const deleteComment = async (req, res) => {
  try {
    console.log("🇯🇲 ~ hello deleteComment ", req.params);

    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    ).populate({
      path: "comments.author",
      select: "username profileImage email",
    });
    console.log("deleteComment new", post);

    res.send({ success: true, comments: post.comments });
  } catch (error) {
    console.log("🇯🇲 deleteComment ~ error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const editComment = async (req, res) => {
  try {
    console.log("🇯🇲 hello editComment ", req.body);

    const post = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $set: { "comments.$[elem].text": req.body.text },
      },

      { arrayFilters: [{ "elem._id": req.body.commentId }], new: true }
    ).populate({
      path: "comments.author",
      select: "username profileImage email",
    });
    console.log(" 🇯🇲 edit ~ newComment", post);

    res.send({ success: true, comments: post.comments });
  } catch (error) {
    console.log("🇯🇲 editComment ~ error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const editCommentJS = async (req, res) => {
  try {
    console.log("🚀 ~ hello editComment ", req.body);

    const post = await Post.findById(req.body.postId);

    const commentIdx = post.comments.findIndex(
      (item) => item._id.toString() === req.body.commentId
    );

    post.comments[commentIdx].comment = req.body.comment;

    const newPost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        comments: post.comments,
      },
      {
        new: true,
      }
    ).populate({ path: "comments.owner", select: "username image email" });

    console.log("🚀 ~ editCommentJS ~ post", commentIdx);

    res.send({ success: true, comments: newPost.comments });
  } catch (error) {
    console.log("🚀 ~ editComment ~ error", error.message);

    res.send({ success: false, error: error.message });
  }
};
