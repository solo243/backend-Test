const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile"); 
const ProfilePost = require("../models/ProfilePost");
const Deals = require("../models/Deal");


router.get("/profiles", (req, res) => {
  res.status(200).json({ message: "API is running perfectly" });
});


router.post("/v1/profile/:uid", async (req, res) => {
  const { uid } = req.params;
  const { name, email, mobile, userprofile, location, desc } = req.body;

  if (!name || !email || !mobile || !userprofile || !location || !desc) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const newProfile = new Profile({
      uid,
      name,
      email,
      mobile,
      userprofile,
      location,
      desc,
    });

    await newProfile.save();

    res.status(201).json({ message: "Profile added successfully", profile: newProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/v2/addpost/:uid", async (req, res) => {
  const { uid } = req.params;
  const { title, price, rating,duration, score, image ,category,description} = req.body;

  if (!title || !price || !rating || !score || !image ||!duration || !category || !description) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const post = new ProfilePost({
      uid,
      title,
      price,
      rating,
      duration,
      score,
      image,
      category,
      description,
    });

    await post.save();

    res.status(201).json({ message: "Post saved successfully", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/v3/profileview/:uid', async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(401).json({ message: 'You need to pass uid' });
  }

  try {
    const userProfile = await Profile.findOne({ uid });
  

    if (!userProfile ) {
      return res.status(404).json({ message: 'Post Not Found ' });
    }

    

    
    res.status(200).json(userProfile);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

router.get("/v4/profilepost/:uid", async (req,res)=>{
  const { uid } = req.params;

  if (!uid) {
    return res.status(401).json({ message: 'You need to pass uid' });
  }

  try {
    const userProfile = await ProfilePost.find({ uid });

    if (!userProfile) {
      return res.status(404).json({ message: 'User not foun' });
    }

    
    res.status(200).json(userProfile);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }

})


router.delete("/v5/profile/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  try {
    const deletedProfile = await Profile.findOneAndRemove({ uid });

    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    
    await ProfilePost.deleteMany({ uid });

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.delete("/v6/postdelete/:uid/:postId", async (req, res) => {
  const { uid, postId } = req.params;

  if (!uid || !postId) {
    return res.status(400).json({ message: "UID and Post ID are required" });
  }

  try {
  
    const profile = await Profile.findOne({ uid: uid });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const deletedPost = await ProfilePost.findOneAndRemove({ _id: postId, uid: uid });

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/v7/updateprofile/:uid", async (req, res) => {
  const { uid } = req.params;
  const updateData = req.body;

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  try {
   
    const updatedProfile = await Profile.findOneAndUpdate({ uid: uid }, updateData, {
      new: true, 
    });

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.put("/v8/postupdate/:uid/:postid", async (req, res) => {
  const { uid, postid } = req.params;
  const updateData = req.body;

  if (!uid || !postid) {
    return res.status(400).json({ message: "UID and Post ID are required in the URL" });
  }

  try {
    const profile = await Profile.findOne({ uid });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const updatedPost = await ProfilePost.findOneAndUpdate(
      { _id: postid, uid: uid },
      updateData,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/v9/categoryposts/:category", async (req,res)=>{
         const { category } = req.params;

         if(!category){
          res.status(401).json({message:"you need to pass category string"});
         }

         try{
          const categoryProduct = await ProfilePost.find({category:category})

          res.status(201).json(categoryProduct);

         }catch(err){
          res.status(401).json(err)
         }
})



router.get("/v10/posts/search/:title", async (req, res) => {
  const { title } = req.params;

  if (!title) {
    return res.status(400).json({ message: "Title is required in the URL" });
  }

  try {
    const posts = await ProfilePost.find({ title: { $regex: title, $options: "i" } });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found matching the title" });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




router.get("/v11/postdetail/:postid", async (req, res) => {
  const { postid } = req.params;

  if (!postid) {
    return res.status(400).json({ message: "Post ID is required in the URL" });
  }

  try {
  
    const post = await ProfilePost.findById(postid);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

   
    const uid = post.uid;

    const profile = await Profile.findOne({ uid });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }


    res.status(200).json({ message: "Post and Profile details", post, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.get("/v12/popular/post", async (req, res) => {
  try {
    const popularPosts = await ProfilePost.find()
      .sort({ score: -1 }) 
      .limit(10); 

    if (!popularPosts || popularPosts.length === 0) {
      return res.status(404).json({ message: "No popular posts found" });
    }

    res.status(200).json({ message: "Popular Posts", posts: popularPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/v14/deals", async  (req,res)=>{
  try{

    const Deal = await Deals.find();

    if(!Deal){
      res.status(401).json({message:"deals not found"});

    }

    res.status(201).json(Deal);

  }catch(err){
    res.status(201).json(err)
  }


})









module.exports = router;
