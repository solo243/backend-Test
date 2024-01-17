const express = require("express");
const Profile = require("../models/Profile");
const Request = require("../models/Request");
const ProfilePost = require("../models/ProfilePost");

const router = express.Router();

// Route for creating a new request
router.post("/r1/request/:suid/:ruid/:postid", async (req, res) => {
  const { suid, ruid, postid } = req.params;

  try {
    // Find sender, receiver, and post based on their IDs
    const senderProfile = await Profile.findOne({ uid: suid });
    const receiverProfile = await Profile.findOne({ uid: ruid });
    const post = await ProfilePost.findOne({ _id: postid });

    // Check if sender, receiver, and post exist
    if (!senderProfile || !receiverProfile || !post) {
      return res.status(401).json({ message: "Both sender and receiver profiles must exist." });
    }

    // Check if the request already exists
    const existingRequest = await Request.findOne({ sender: suid, receiver: ruid, postid: postid });

    if (existingRequest) {
      return res.status(401).json({ message: "Request already exists." });
    }

    // Create a new request
    const newRequest = new Request({
      sender: suid,
      receiver: ruid,
      postid: postid,
    });

    await newRequest.save();
    res.status(201).json({ message: "Request sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/r2/accept-request/:requestId/:status", async (req, res) => {
  const requestId = req.params.requestId;
  const status = req.params.status;

  try {
  
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

 
    if (request.status === "accepted") {
      return res.status(200).json({ message: "Request has already been accepted." });
    }

 
    if (status === "ignore") {
      await Request.findByIdAndDelete(requestId);
      return res.json({ message: "Request ignored successfully." });
    }

 
    const receiverProfile = await Profile.findOne({ uid: request.receiver });

    if (!receiverProfile) {
      return res.status(404).json({ message: "Receiver profile not found." });
    }

    request.mobile = receiverProfile.mobile;
    request.status = "accepted";
    await request.save();

    res.json({ message: "Request accepted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/r3/checkrequest/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const requests = await Request.find({
      $or: [{ sender: uid }, { receiver: uid }],
    });

    if (!requests || requests.length === 0) {
      res.status(404).json({ message: "No matching requests found." });
    } else {
      res.status(200).json(requests);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
