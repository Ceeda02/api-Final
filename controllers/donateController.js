const UserModel = require("../models/userModel");
const AdminModel = require("../models/AdminModel");

// Create a new donation
exports.createDonation = async (req, res) => {
  try {
    const { phoneNumber, ewasteType, donationAmount } = req.body;
    const userId = req.user._id; // Using user._id to identify the user

    console.log("Received userId:", userId); // Log the userId

    const user = await UserModel.findById(userId);

    if (!user) {
      console.log("User not found in the database");
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("Found user in the database:", user); // Log the user

    const newDonation = {
      phoneNumber,
      ewasteType,
      donationAmount,
      fullName: user.firstName + " " + user.lastName,
    };

    user.donations.push(newDonation);
    await user.save();

    const donationData = user.donations[user.donations.length - 1];

    res.status(201).json(donationData);
  } catch (error) {
    console.error("Create Donation Error:", error);
    res
      .status(500)
      .json({ error: error.message, msg: "Something went wrong!" });
  }
};

exports.listDonations = async (req, res) => {
  console.log("User Data:", req.user);

  try {
    const { _id } = req.user; // Use req.user._id to get the user's ObjectId

    if (!_id) {
      console.log("User not authenticated"); // Log when the user is not authenticated
      return res.status(401).json({ msg: "User not authenticated" });
    }

    const user = await UserModel.findById(_id);

    if (!user) {
      console.error("User not found in the database");
      return res.status(404).json({ msg: "User not found" });
    }

    const donations = user.donations;

    // Add a console log to indicate successful retrieval
    console.log("Donations retrieved successfully");

    res.status(200).json(donations);
  } catch (err) {
    console.error("List Donations Error:", err);
    res.status(500).json({ error: err, msg: "Something went wrong!" });
  }
};

// Get a single donation by ID
exports.getDonation = async (req, res) => {
  try {
    const { _id } = req.user; // Use req.user to get the user ID

    if (!_id) {
      console.log("User not authenticated"); // Log when the user is not authenticated
      return res.status(401).json({ msg: "User not authenticated" });
    }

    const user = await UserModel.findById(_id);

    if (!user) {
      console.error("User not found in the database");
      return res.status(404).json({ msg: "User not found" });
    }

    const donationId = req.params.id;

    console.log("Found user in the database:", user);
    console.log("Retrieving donation with ID:", donationId);

    const donation = user.donations.find(
      (d) => d._id.toString() === donationId
    );

    if (!donation) {
      console.error("Donation not found");
      return res.status(404).json({ msg: "Donation not found" });
    }

    // Add a console log to indicate successful retrieval
    console.log("Donation retrieved successfully");

    res.status(200).json(donation);
  } catch (err) {
    console.error("Get Donation Error:", err);
    res.status(500).json({ error: err, msg: "Something went wrong!" });
  }
};

// Update a donation by ID
exports.updateDonation = async (req, res) => {
  try {
    // Get the user ID from the token
    const userId = req.user._id;

    // Find the user
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const donationIndex = user.donations.findIndex(
      (d) => d._id.toString() === req.params.id
    );

    if (donationIndex === -1) {
      return res.status(404).json({ msg: "Donation not found" });
    }

    // Update donation properties based on req.body data
    const updatedDonation = user.donations[donationIndex];
    updatedDonation.phoneNumber = req.body.phoneNumber;
    updatedDonation.ewasteType = req.body.ewasteType;
    updatedDonation.donationAmount = req.body.donationAmount;
    updatedDonation.fullName = `${user.firstName} ${user.lastName}`; // Update fullName

    user.donations[donationIndex] = updatedDonation;

    await user.save();

    res.status(200).json(updatedDonation);
  } catch (err) {
    console.error("Update Donation Error:", err);
    res.status(500).json({ error: err, msg: "Something went wrong!" });
  }
};

// Delete a donation by ID
exports.deleteDonation = async (req, res) => {
  try {
    // You can directly access the user information from req.user
    const user = req.user;

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const donationIndex = user.donations.findIndex(
      (d) => d._id.toString() === req.params.id
    );

    if (donationIndex === -1) {
      return res.status(404).json({ msg: "Donation not found" });
    }

    user.donations.splice(donationIndex, 1);

    await user.save();

    res.status(204).end();
  } catch (err) {
    console.error("Delete Donation Error:", err); // Log the error
    res.status(500).json({ error: err, msg: "Something went wrong!" });
  }
};

// Controller function for retrieving all donations (protected for admins only)
exports.getAllDonationsForAdmin = async (req, res) => {
  try {
    // Add logic to check if the user is an admin
    if (req.user && req.user.role === "admin") {
      const donations = await DonationModel.find({});
      res.status(200).json(donations);
    } else {
      res.status(403).json({ message: "Access denied: Admin role required" });
    }
  } catch (error) {
    console.error("Error retrieving donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await UserModel.find({}, "donations"); // Retrieve donations from all users

    const allDonations = donations.map((user) => user.donations).flat(); // Combine all donations into a single array

    console.log("Donations retrieved successfully");
    res.status(200).json(allDonations);
  } catch (err) {
    console.error("List Donations Error:", err);
    res.status(500).json({ error: err, msg: "Something went wrong!" });
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    const donationId = req.params.id;
    const newStatus = req.body.status; // Assuming you're sending the new status in the request body

    const user = await UserModel.findOne({ "donations._id": donationId });

    if (!user) {
      console.error("User not found in the database");
      return res.status(404).json({ msg: "User not found" });
    }

    const donation = user.donations.find(
      (d) => d._id.toString() === donationId
    );

    if (!donation) {
      console.error("Donation not found");
      return res.status(404).json({ msg: "Donation not found" });
    }

    // Update the donation status
    donation.status = newStatus;

    await user.save();

    console.log("Donation status updated successfully");
    res.status(200).json(donation);
  } catch (err) {
    console.error("Update Donation Status Error:", err);
    res.status(500).json({ error: err, msg: "Something went wrong!" });
  }
};
