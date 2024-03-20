import { useForm } from "react-hook-form";
import Input from "../components/common/Input";
import Password from "../components/common/Password";
import logo from "../assets/rapid-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../services/operations/authAPI";

const Signup = () => {
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading}= useSelector(state=> state.auth);

  const submit = async (data) => {
    await dispatch(signup(data, navigate, reset));
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
          Register
        </h1>
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <div className="grid md:grid-cols-2 items-start gap-2">
            <Input
              star="true"
              label="Name"
              placeholder="First Name"
              name="firstName"
              type="text"
              errors={errors?.firstName}
              {...register("firstName", {
                required: "First Name is required",
              })}
            />
            <Input
              label=""
              placeholder="Last Name"
              type="text"
              name="lastName"
              errors={errors?.lastName}
              {...register("lastName", {
                required: "Last Name is required",
              })}
            />
          </div>

          {/* email */}
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

          <Password
            star="true"
            label="ConfirmPassword"
            placeholder="Confirm your password"
            type="password"
            name="confirmPassword"
            errors={errors?.confirmPassword}
            {...register("confirmPassword", {
              required: "Confirm your password",
              validate: (value) =>
                value === getValues("password")
                  ? true
                  : "Passwords do not match",
            })}
          />

          <div className="w-full flex gap-2 items-center">
            <div className="">
              <Input
                $id={"subscribedDailyDigest"}
                type="checkbox"
                divClassName="!m-0"
                labelClassName="!p-0"
                {...register("subscribedDailyDigest", {
                  required: "Subscribe Daily Digest",
                })}
              />
            </div>

            <label className="w-fit" htmlFor={"subscribedDailyDigest"}>
              Subscribe daily digest
            </label>

            {errors?.subscribedDailyDigest && (
              <span className="text-xs text-[#DA0128]">
                {errors?.subscribedDailyDigest.message}
              </span>
            )}
          </div>

          <p className="paragraph mb-3">
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our{" "}
            <Link
              to={"/privacy-policy"}
              className="text-[#4F46E5] hover:underline"
            >
              privacy policy
            </Link>
            .
          </p>

          <Button type="submit" className="max-w-max mb-2" loading={loading}>
            {" "}
            Register
          </Button>
          <p className="paragraph mb-3">
            Already have account?{" "}
            <Link to={"/login"} className="text-[#4F46E5] hover:underline">
              Login
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
