import { useForm } from "react-hook-form";
import Input from "../components/common/Input";
import Password from "../components/common/Password";
import logo from "../assets/rapid-logo.svg";
import {Link, useNavigate} from "react-router-dom";
import Button from "../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../services/operations/authAPI";

const Login = () => {
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;
  const navigate= useNavigate()
  const dispatch= useDispatch();
  const {loading}= useSelector(state=> state.auth);

  const submit = async (data) => {
    await dispatch(login(data,navigate,reset));
  };
  
  
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center flex-col py-10 px-2">
      <div className="flex items-center justify-center gap-2 mb-10">
        <img src={logo} alt="Rapid" loading="lazy" className="w-12 h-12" />
        <h1 className="text-[2rem] leading-[3rem] font-semibold">
          Rapid Page Generator
        </h1>
      </div>
      <div className="w-full h-full max-w-[720px] flex items-center flex-col p-8 border">
        <h1 className="heading mb-10 w-full">
          Login
        </h1>
        <form onSubmit={handleSubmit(submit)} className="w-full flex flex-col gap-4">
          <Input
            star="true"
            label="Email"
            placeholder="email@address.com"
            type="text"
            name="email"
            errors={errors?.email}
            {...register("email", {
              required: "Email is requrired",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            })}
          />

          <Password
            star="true"
            label="Password"
            placeholder="Enter your password"
            type="password"
            name="password"
            errors={errors?.password}
            {...register("password", {
              required: "Enter a Password",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                message:
                  "Password must contain a numeric value, a special symbol, and a capital alphabet",
              },
            })}
          />
          <Button type="submit" className="max-w-max mb-2" loading={loading} > Login</Button>
          <p className="paragraph mb-3">Don’t have account? <Link to={"/signup"} className="text-[#4F46E5] hover:underline">Create account</Link>.</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
