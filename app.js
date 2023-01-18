const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("./utils/db");
const Contact = require("./model/contact");

const app = express();
const port = 3000;

// setup method-override
app.use(methodOverride("_method"));

// setup ejs view engine
app.set("view engine", "ejs");
app.use(expressLayouts); //third party
app.use(express.static("public")); //built-in middleware
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// halaman home
app.get("/", (req, res) => {
  res.render("index", {
    title: "Halaman | Home",
    layout: "layouts/main",
  });
});

// halaman about
app.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman | About",
    layout: "layouts/main",
  });
});

// halaman contact
app.get("/contact", async (req, res) => {
  // Contact.find().then((contact) => {
  //   res.send(contact);
  // });
  const contacts = await Contact.find();

  res.render("contact", {
    title: "Halaman | Contact",
    layout: "layouts/main",
    contacts,
    msg: req.flash("msg"),
  });
});

// halaman form add contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Add contact",
    layout: "layouts/main",
  });
});

//  proses tambah data Contact
app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Nama contact sudah ada, silahkan gunakan nama lain");
      }
      return true;
    }),
    check("nohp", "Tolong isi no hapenya dengan benar ya !").isMobilePhone("id-ID"),
    check("email", "Email yang kamu masukan ngaco").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Halaman form contact",
        layout: "layouts/main",
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        // kirim flash message
        req.flash("msg", "Data contact berhasil ditambahkan");
        res.redirect("/contact");
      });
    }
  }
);

// delete contact
app.delete("/contact", (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash("msg", "Data contact berhasil dihapus");
    res.redirect("/contact");
  });
});

// form ubah data contact
app.get("/contact/edit/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render("edit-contact", {
    title: "Update contact",
    layout: "layouts/main",
    contact,
  });
});

// proses ubah data
app.put(
  "/contact",
  [
    body("nama").custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (value !== req.body.oldName && duplikat) {
        throw new Error("Nama contact sudah ada, silahkan gunakan nama lain");
      }
      return true;
    }),
    check("nohp", "Tolong isi no hapenya dengan benar ya !").isMobilePhone("id-ID"),
    check("email", "Email yang kamu masukan ngaco").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Halaman Update form contact",
        layout: "layouts/main",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            nama: req.body.nama,
            nohp: req.body.nohp,
            email: req.body.email,
          },
        }
      ).then((result) => {
        // kirim flash message
        req.flash("msg", "Data contact berhasil diubah");
        res.redirect("/contact");
      });
    }
  }
);

// halaman detail contact
app.get("/contact/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render("detail", {
    title: "Detail contact",
    layout: "layouts/main",
    contact,
  });
});

//port
app.listen(port, () => {
  console.log(`Mongo Contact App | listening at http://localhost:${port}`);
});
