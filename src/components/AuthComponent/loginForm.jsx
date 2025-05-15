import Input from "../Input";
import { useForm } from "react-hook-form";
import ComponentLoading from "../ComponentLoading";
import { MESSAGE, REGEX } from "@/constant/validate";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "@/store/Reducer/authReducer";
import useDebounce from "@/hooks/useDebounce";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {


    if (data && !loading.login) {
      try {
        const result = await dispatch(handleLogin(data)).unwrap();

        if (result) {
          setTimeout(() => {
            document.body.style.overflow = "auto";
          }, 300);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const renderLoading = useDebounce(loading.login, 1000);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ position: "relative" }}>
        {renderLoading && <ComponentLoading />}
        <Input
          label="Username or email address"
          required
          {...register("email", {
            required: MESSAGE.required,
            pattern: {
              value: REGEX.email,
              message: MESSAGE.email,
            },
          })}
          error={errors?.email?.message || ""}
        />
        <Input
          label="Password"
          type="password"
          required
          {...register("password", {
            required: MESSAGE.required,
          })}
          error={errors?.password?.message || ""}
        />
        <div className="form-footer">
          <button type="submit" className="btn btn-outline-primary-2">
            <span>LOG IN</span>
            <i className="icon-long-arrow-right" />
          </button>
         
        
        </div>
        <div className="form-choice">
          <p className="text-center">or sign in with</p>
          <div className="row">
            <div className="col-sm-6">
              <a href="#" className="btn btn-login btn-g">
                <i className="icon-google" />
                Login With Google
              </a>
            </div>
            <div className="col-sm-6">
              <a href="#" className="btn btn-login btn-f">
                <i className="icon-facebook-f" />
                Login With Facebook
              </a>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
