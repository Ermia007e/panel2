// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginStep } from "../services/api/auth/login.api";
import toast, { Toaster } from "react-hot-toast";
import useStore from "../constant/store/login";
import { loginValidation } from "../@core/validations/login";

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub } from "react-feather";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
import { Formik, Form, Field } from "formik"
// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Label,
  Input,
  Button,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";

const Login = () => {
  const setLoginInfo = useStore((state) => state.setLoginInfo);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (value) => {
    try {
      const {data} = await loginStep(value);

      if (data?.success) {
        toast.success(data?.message || "ورود موفقیت‌آمیز بود!");
        if (data?.token) {
          localStorage.setItem("token", data?.token);
          navigate("/Dashboard");
        }
      } else {
        toast.error(data?.message || "خطایی رخ داده است!");
      }
    } catch (error) {
      toast.error("مشکلی در ارتباط با سرور پیش آمده!");
    }
  };
  const { skin } = useSkin();

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
        <img src="../../src/assets/images/logo/bahrAcademy.svg"/>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              به پنل ادمین خوش آمدید! 👋
            </CardTitle>
            <CardText className="mb-2">
              لطفا برای دسترسی به پنل ادمین ورود کنید            </CardText>
            <Formik
              initialValues={{
                password: "",
                phoneOrGmail: "",
              }}
              validationSchema={loginValidation}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="auth-login-form mt-2">
                  <div className="mb-1">
                    <Label className="form-label" htmlFor="phoneOrGmail">ایمیل یا شماره تماس</Label>
                    <Field type="email" name="phoneOrGmail" id="phoneOrGmail" placeholder="ایمیل یا شماره تماس را وارد کنید" className="form-control" />
                  </div>
                  <div className="mb-1">
                    <div className="d-flex justify-content-between">
                      <Label className="form-label" htmlFor="password">رمز عبور</Label>
                      <Link to="/forgot-password"><small>رمزت رو فراموش کردی؟
                      </small></Link>
                    </div>
                    <Field
                      className="input-group-merge"
                      name="password"
                      as={InputPasswordToggle}
                    />
                  </div>
                  <div className="form-check mb-1">
                    <Field type="checkbox" name="rememberMe" className="form-check-input" id="remember-me" />
                    <Label className="form-check-label" htmlFor="remember-me">                    منو به یاد بیار
                    </Label>
                  </div>
                  <Button type="submit" color="primary" block disabled={isSubmitting}>
                    ورود به پنل

                  </Button>
                </Form>
              )}
            </Formik>
            <p className="text-center mt-2">
              <span className="me-25">تا حالا به پلتفرم ما نیومدی؟</span>
              <Link to="/register">
                <span>یه اکانت درست کن</span>
              </Link>
            </p>
            <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <Button color="facebook">
                <Facebook size={14} />
              </Button>
              <Button color="twitter">
                <Twitter size={14} />
              </Button>
              <Button color="google">
                <Mail size={14} />
              </Button>
              <Button className="me-0" color="github">
                <GitHub size={14} />
              </Button>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
