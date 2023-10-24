const { Router } = require("express");
const { validateToken } = require("../middlewares/authMiddleware");
const {
  createDonation,
  listDonations,
  getDonation,
  updateDonation,
  deleteDonation,
  getAllDonationsForAdmin,
  getAllDonations,
  updateDonationStatus,
} = require("../controllers/donateController");

const donateRoute = Router();

donateRoute.post("/create", validateToken, createDonation);
donateRoute.get("/list", validateToken, listDonations);
donateRoute.get("/retrieve/:id", validateToken, getDonation);
donateRoute.put("/update/:id", validateToken, updateDonation);
donateRoute.delete("/delete/:id", validateToken, deleteDonation);
// Add a new route to retrieve all donations for admin
donateRoute.get("/adminall", validateToken, getAllDonationsForAdmin);
donateRoute.get("/all", getAllDonations);
donateRoute.put("/updateStatus/:id", updateDonationStatus);

module.exports = donateRoute;
