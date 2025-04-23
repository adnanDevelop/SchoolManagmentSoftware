import { useForm } from "react-hook-form";
import HashLoader from "react-spinners/HashLoader";
import { Link, useNavigate } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { login } from "@/redux/features/authSlice";
import { useLoginUserMutation } from "@/redux/services/authApi";

import toast from "react-hot-toast";

interface loginProps {
  email: string;
  role?: string;
  password: string;
}

const Login = () => {
  document.title = "WOFFICE - Login";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginProps>();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  // Submit function
  const submitData = async (data: loginProps) => {
    await loginUser({ body: data })
      .unwrap()
      .then((response) => {
        dispatch(login(response.data));
        toast.success(response.message);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error?.data?.message);
      });
  };

  return (
    <main>
      <div className="flex items-center justify-center w-full h-screen bg-white select-none ">
        <form
          onSubmit={handleSubmit(submitData)}
          className="sm:max-w-[450px] px-3 flex flex-col items-center justify-center"
        >
          <div>
            <img src="/image/logo.png" alt="" />
            <h2 className="font-poppin sm:text-[30px] text-[25px] text-gray-700 font-bold mb-2">
              Welcome
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center mt-6">
            {/* Email */}
            <div className="mb-3">
              <input
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
                className="w-[350px] h-[45px] px-4 text-xs bg-light-white border-none outline-none rounded-full focus:outline-none focus:shadow-none font-poppin placeholder:text-xs text-content"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 ps-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-[350px] h-[45px] px-4 text-xs bg-light-white border-none outline-none rounded-full focus:outline-none focus:shadow-none font-poppin placeholder:text-xs text-content"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 ps-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* <div className="w-full mb-4">
              <select
                className={`text-xs px-3 border-transparent border h-[40px] bg-light-white text-content !rounded-full block w-full`}
                {...register("role", {
                  required: "Role is required",
                })}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="client">Client</option>
                <option value="user">User </option>
              </select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-500 ps-2">
                  {errors.role.message}
                </p>
              )}
            </div> */}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="block w-full text-sm h-[45px] bg-primary rounded-full text-white"
            >
              {isLoading ? (
                <HashLoader size={18} color="#F7F7F7" className="mx-auto" />
              ) : (
                "Login into your account"
              )}
            </button>

            {/* Don't have an account */}
            <Link
              to="/register"
              className="mt-2 text-xs font-light cursor-pointer font-poppin"
            >
              Don't have an account{" "}
              <span className="underline transitions hover:text-primary">
                Register
              </span>
              ?
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
