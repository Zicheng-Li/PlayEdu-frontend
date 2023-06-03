import { Spin, Input, Button, message } from "antd";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import banner from "../../assets/images/login/banner.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAction, logoutAction } from "../../store/user/loginUserSlice";
import { login, system, user } from "../../api/index";
import { setToken } from "../../utils/index";
import { NoFooter } from "../../compenents";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captchaVal, setCaptchaVal] = useState<string>("");
  const [captchaKey, setCaptchaKey] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState(true);

  useEffect(() => {
    fetchImageCaptcha();
  }, []);

  const fetchImageCaptcha = () => {
    setCaptchaLoading(true);
    system.imageCaptcha().then((res: any) => {
      setImage(res.data.image);
      setCaptchaKey(res.data.key);
      setCaptchaLoading(false);
    });
  };

  const loginSubmit = (e: any) => {
    if (!email) {
      message.error("Please enter your student email account");
      return;
    }
    if (!password) {
      message.error("Please enter your password");
      return;
    }
    if (!captchaVal) {
      message.error("Please enter the graphic verification code");
      return;
    }
    if (captchaVal.length < 4) {
      message.error("Graphic verification code error");
      return;
    }
    if (loading) {
      return;
    }
    handleSubmit();
  };

  const keyUp = (e: any) => {
    if (e.keyCode === 13) {
      loginSubmit(e);
    }
  };

  const handleSubmit = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    login
      .login(email, password, captchaKey, captchaVal)
      .then((res: any) => {
        const token = res.data.token;
        setToken(token);
        getUser();
      })
      .catch((e) => {
        setLoading(false);
        setCaptchaVal("");
        fetchImageCaptcha();
      });
  };

  const getUser = () => {
    user.detail().then((res: any) => {
      const data = res.data;
      dispatch(loginAction(data));
      setLoading(false);
      navigate("/", { replace: true });
    });
  };

  return (
    <div className={styles["login-content"]}>
      <div className={styles["top-content"]}>
        <div className={styles["title"]}>Student Login</div>
        <div className={styles["login-box"]}>
          <div className={styles["left-box"]}>
            <img className={styles["icon"]} src={banner} alt="" />
          </div>
          <div className={styles["right-box"]}>
            <div className="login-box d-flex">
              <Input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                style={{ width: 400, height: 54 }}
                placeholder="Please enter your student email account"
                onKeyUp={(e) => keyUp(e)}
              />
            </div>
            <div className="login-box d-flex mt-50">
              <Input.Password
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                style={{ width: 400, height: 54 }}
                placeholder="Please enter your password"
              />
            </div>
            <div className="login-box d-flex mt-50">
              <Input
                value={captchaVal}
                style={{ width: 260, height: 54 }}
                placeholder="Please enter the graphic verification code"
                onChange={(e) => {
                  setCaptchaVal(e.target.value);
                }}
                onKeyUp={(e) => keyUp(e)}
              />
              <div className={styles["captcha-box"]}>
                {captchaLoading && (
                  <div className={styles["catpcha-loading-box"]}>
                    <Spin size="small" />
                  </div>
                )}

                {!captchaLoading && (
                  <img
                    className={styles["captcha"]}
                    onClick={fetchImageCaptcha}
                    src={image}
                  />
                )}
              </div>
            </div>
            <div className="login-box d-flex mt-50">
              <Button
                style={{ width: 400, height: 54 }}
                type="primary"
                onClick={loginSubmit}
                loading={loading}
              >
                Login Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["footer"]}>
        <NoFooter></NoFooter>
      </div>
    </div>
  );
};

export default LoginPage;
