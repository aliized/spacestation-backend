//? POST contact-us
//? POST / PUT about-us


// exports.handleContactPage = async (req, res, next) => {
//     const { fullname, email, message } = req.body;

//     const schema = Yup.object().shape({
//         fullname: Yup.string().required("نام و نام خانوادگی الزامی می باشد"),
//         email: Yup.string()
//             .email("آدرس ایمیل صحیح نیست")
//             .required("آدرس ایمیل الزامی می باشد"),
//         message: Yup.string().required("پیام اصلی الزامی می باشد"),
//     });

//     try {
//         await schema.validate(req.body, { abortEarly: false });

//         sendEmail(
//             email,
//             fullname,
//             "پیام از طرف وبلاگ",
//             `${message} <br/> ایمیل کاربر : ${email}`
//         );

//         res.status(200).json({ message: "پیام شما با موفقیت ارسال شد" });
//     } catch (err) {
//         next(err);
//     }
// };

// exports.getCaptcha = (req, res) => {
//     CAPTCHA_NUM = parseInt(Math.random() * 9000 + 1000);
//     const p = new captchapng(80, 30, CAPTCHA_NUM);
//     p.color(0, 0, 0, 0);
//     p.color(80, 80, 80, 255);

//     const img = p.getBase64();
//     const imgBase64 = Buffer.from(img, "base64");

//     res.send(imgBase64);
// };
