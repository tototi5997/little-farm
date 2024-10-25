import c from "classnames";
import s from "./index.module.less";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div className={c(s.login_page, "w-full h-full fbh fbjc fbac")}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
