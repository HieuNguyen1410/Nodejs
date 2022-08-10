const Register = require("../models/Register");
const Staff = require("../models/Staff");
const Salary = require("../models/Salary");
const Covid = require("../models/Covid");
const Department = require("../models/Department");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { validationResult } = require("express-validator/check");

class CovidController {
  // [GET] /covid
  getCovid(req, res, next) {
    const role = req.staff.role;
    if (!role) {
      return next(new Error("Error !"));
    }
    res.render("staffs/covid", {
      role,
      errorMessage: "",
      temperature: "",
      injection1: "",
      injection2: "",
      date1: "",
      date2: "",
    });
  }
  //[POST] /covid/addAddCovid
  postAddCovid(req, res, next) {
    const staff = req.staff;
    const d = new Date();
    const role = req.staff.role;
    const temperature = req.body.temperature;
    const injection1 = req.body.injection1;
    const date1 = req.body.date1;
    const injection2 = req.body.injection2;
    const date2 = req.body.date2;
    const infected = req.body.infected;
    const errors = validationResult(req);
    console.log(injection2);
    if (!errors.isEmpty()) {
      return res.status(422).render("staffs/covid", {
        role,
        errorMessage: errors.array()[0].msg,
        temperature,
        injection1,
        injection2,
        date1,
        date2,
      });
    }

    const covid = new Covid({
      temperature: temperature,
      date: d,
      vaccine: [
        { injection1: injection1, date1: date1 },
        { injection2: injection2, date2: date2 },
      ],
      infected: infected,
      staffId: staff._id,
    });
    covid
      .save()
      .then((result) => {
        res.redirect("/");
      })
      .catch((err) => {
        return next(err);
      });
  }
  //[GET] /covid/covidDeatails
  getCovidDeatails(req, res, next) {
    const role = req.staff.role;
    const staffId = req.query.id;
    const name = req.query.name;
    if (!role || !staffId) {
      return next(new Error("Error !"));
    }

    Covid.findOne({ staffId: staffId })
      .then((covid) => {
        const injection1 = covid.vaccine[0];
        const injection2 = covid.vaccine[1];
        console.log(name);
        res.render("covid/covidDetails", {
          covid,
          name,
          injection1,
          injection2,
          staffId,
          role,
        });
      })
      .catch((err) => {
        return next(err);
      });
  }
  //[GET] /covid/covidDetails/invoice
  getInvoice(req, res, next) {
    const covidId = req.query.id;
    const dataPath = path.dirname(require.main.filename);
    const orderId = req.params.orderId;
    Covid.findById(covidId)
      .then((covid) => {
        const injection1 = covid.vaccine[0];
        const injection2 = covid.vaccine[1];
        const d = new Date().getTime().toString();
        if (!covid) {
          return next(new Error("No Order Found"));
        }
        console.log();
        // if (order.user.userId.toString() !== req.user._id.toString()) {
        //   return next(new Error("Unauthorized"));
        // }
        const invoiceName = "invoice-" + covidId + d + ".pdf";
        const invoicePath = path.join(dataPath, "data", "invoice", invoiceName);
        // const invoicePath = path.join(
        //   "D:\\JAva\\Workspace\\Nodejs\\NodeExpressLab\\data",
        //   "invoices",
        //   invoiceName
        // );
        const pdfDoc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'inline; filename="' + invoiceName + '"'
        );
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);

        pdfDoc.fontSize(26).text("Invoice", {
          underline: true,
        });
        pdfDoc.text("-----------------------");
        pdfDoc.fontSize(14).text("Id : " + covid.staffId);
        pdfDoc
          .fontSize(14)
          .text(
            "Injection 1 : " +
              injection1.injection1 +
              " --- Date : " +
              injection1.date1
          );
        pdfDoc
          .fontSize(14)
          .text(
            "Injection 2 : " +
              injection2.injection2 +
              " --- Date : " +
              injection2.date2
          );
        pdfDoc.fontSize(14).text("Date : " + covid.date);
        pdfDoc.fontSize(14).text("InfecTed : " + covid.infected);
        // pdfDoc.fontSize(14).text();
        // let totalPrice = 0;
        // order.products.forEach((prod) => {
        //   totalPrice += prod.quantity * prod.product.price;
        //   pdfDoc
        //     .fontSize(14)
        //     .text(
        //       prod.product.title +
        //         " - " +
        //         prod.quantity +
        //         " x " +
        //         "$" +
        //         prod.product.price
        //     );
        // });
        pdfDoc.text("---");
        pdfDoc.end();

        // const file = fs.createReadStream(invoicePath);
        // res.setHeader("Content-Type", "application/pdf");
        // res.setHeader(
        //   "Content-Disposition",
        //   'inline; filename="' + invoiceName + '"'
        // );
        // file.pipe(res);
      })
      .catch((err) => {
        next(err);
      });

    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) return next(err);

    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader(
    //   "Content-Disposition",
    //   'inline; filename="' + invoiceName + '"'
    // );
    //   res.send(data);
    // });
  }
}
// Covid.findOne().then((result) => {
//   const d = new Date();
//   if (result) {
//     const covid = new Covid({
//       temperature: 37,
//       date:d,
//       vaccine: [
//         { injection1: "fizer", date1: d },
//         { injection2: "fizer", date2: d },
//       ],
//       infected: 'Yes',
//       staffId: '62f11660f3509c29b41f580f',
//     })
//     covid.save();
//   }
// });

module.exports = new CovidController();
