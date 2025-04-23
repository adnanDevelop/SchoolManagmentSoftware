import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

// Redux
import toast from "react-hot-toast";
import HashLoader from "react-spinners/HashLoader";
import { useRegisterUserMutation } from "@/redux/services/authApi";

interface registerProps {
  name: string;
  email: string;
  password: string;
  role: string;
}
const Register = () => {
  document.title = "WOFFICE - Register";
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerProps>();

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  // Submit function
  const submitData = async (data: registerProps) => {
    await registerUser({
      body: data,
    })
      .unwrap()
      .then((response) => {
        navigate("/login");
        toast.success(response.message);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message);
      });
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-white select-none ">
      <form
        onSubmit={handleSubmit(submitData)}
        className="sm:max-w-[450px] px-3 flex flex-col items-center justify-center"
      >
        <div>
          <img src="/image/logo.png" className="mx-auto" alt="" />
          <h2 className="font-poppin text-[30px] text-gray-700 font-bold text-center mb-2">
            Welcome to Circlehub!
          </h2>
          {/* <p className="text-center text-content">
            Sign up to engage with friends, post updates, and be part of a
            growing network that shares exciting content.
          </p> */}
        </div>

        <div className="flex flex-col items-center justify-center mt-6">
          {/*  Name */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Full Name"
              className="w-[350px] h-[45px] px-4 text-xs bg-light-white border-none outline-none rounded-full focus:outline-none focus:shadow-none font-poppin placeholder:text-xs text-content"
              {...register("name", {
                required: "Full name is required",
              })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 ps-2">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="w-[350px] h-[45px] px-4 text-xs bg-light-white border-none outline-none rounded-full focus:outline-none focus:shadow-none font-poppin placeholder:text-xs text-content"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 ps-2">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="w-[350px] h-[45px] px-4 text-xs bg-light-white border-none outline-none rounded-full focus:outline-none focus:shadow-none font-poppin placeholder:text-xs text-content"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 ps-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role options */}
          <div className="mb-6">
            <select
              className="w-[350px] h-[45px] px-4 text-xs bg-light-white border-none outline-none rounded-full focus:outline-none focus:shadow-none font-poppin placeholder:text-xs text-content appearance-none "
              {...register("role", {
                required: "Role is required",
              })}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="admin">Admin</option>
              <option value="projectManager">Project Manager</option>
              <option value="member">Member</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-red-500 ps-2">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="block w-full text-sm h-[45px] bg-primary rounded-full text-white"
          >
            {isLoading ? (
              <HashLoader size={18} color="#F7F7F7" className="mx-auto" />
            ) : (
              "Register"
            )}
          </button>
          <Link
            to="/login"
            className="mt-2 text-xs font-light cursor-pointer font-poppin"
          >
            Already have an account{" "}
            <span className="underline transitions hover:text-primary">
              Login
            </span>
            ?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
