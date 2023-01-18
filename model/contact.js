const mongoose = require("mongoose");
// membuat schema contact
const Contact = mongoose.model("Contact", {
  nama: {
    type: String,
    requred: true,
  },
  nohp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = Contact;
