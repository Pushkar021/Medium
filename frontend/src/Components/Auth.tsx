import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import type { ValidatrUser } from "pushkar-blog-common";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
export const Auth = ({ type }: { type: "Signup" | "Signin" }) => {
  const navigate = useNavigate();
const backendUrl = import.meta.env.VITE_DATABASE_URL;
  async function fn(e: any) {
    toast.loading("Processing your request...", {
      id: "auth",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
   const res = await axios.post( `${backendUrl}/api/v1/user/auth/google`, {
     token: e.credential,
   });
  if(res.status==200){
    localStorage.setItem("token",res.data.jwt)
    localStorage.setItem("picture",res.data.picture)
    localStorage.setItem("Name",res.data.Name)
    navigate("/blogs")
  }

  }
  const [getinput, setinput] = useState<ValidatrUser>({
    name: "",
    email: "",
    password: "",
  });

  const sendReq = async () => {
    try {
      toast.loading("Processing your request...", {
        id: "auth",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      // simple email validation before request
      if (type === "Signup" || type === "Signin") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(getinput.email)) {
          toast.error("Please enter a valid email address", { id: "auth" });
          return;
        }
      }

      const payload =
        type === "Signup"
          ? getinput
          : { email: getinput.email, password: getinput.password };

      const url =
        type === "Signup"
          ?  `${backendUrl}/api/v1/user/signup`
          :  `${backendUrl}/api/v1/user/signin`;

      const response = await axios.post(url, payload);

      if (response.status === 200 && response.data.message) {
        localStorage.setItem("token", response.data.message);
        localStorage.setItem("Name", response.data.name);
        toast.success("Success! Redirecting...", { id: "auth" });
        navigate("/blogs");
      } else {
        toast.error("Unexpected response from server", { id: "auth" });
      }
    } catch (error: any) {

      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Request failed";
        toast.error(msg, { id: "auth" });
      } else {
        toast.error("Something went wrong!", { id: "auth" });
      }
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Toaster />
      <div className="flex flex-col justify-center text-2xl max-w-md w-full">
        <div className="font-extrabold text-4xl">
          {type === "Signup" ? "Create an account" : "Welcome back"}
        </div>
        <p className="text-sm mt-5">
          {type === "Signup" ? (
            <>
              Already have an account?{" "}
              <Link className="font-light underline" to="/signin">
                Signin
              </Link>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <Link className="font-light underline" to="/signup">
                Signup
              </Link>
            </>
          )}
        </p>

        <div className="space-y-4 mt-6">
          {type === "Signup" ? (
            <LabelsComp
              label="Name"
              placeholder="Enter your name"
              onChange={(e) =>
                setinput({
                  ...getinput,
                  name: e.target.value,
                })
              }
            />
          ) : null}

          <LabelsComp
            label="Email"
            type="email"
            placeholder="Enter your email"
            onChange={(e) =>
              setinput({
                ...getinput,
                email: e.target.value,
              })
            }
          />

          <LabelsComp
            label="Password"
            type="password"
            placeholder="Enter your password"
            onChange={(e) =>
              setinput({
                ...getinput,
                password: e.target.value,
              })
            }
          />
        </div>
        <div>
          <div className="mt-2">
            <GoogleLogin onSuccess={fn} theme="filled_black" size="large" ></GoogleLogin>
          </div>
          <button
            onClick={sendReq}
            type="button"
            className="mt-4 w-3xl md: w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 cursor-pointer"
          >
            {type == "Signin" ? <>Signin</> : <>Signup</>}
          </button>
        </div>
      </div>
    </div>
  );
};

type LabelType = {
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const LabelsComp = ({
  label,
  placeholder,
  onChange,
  type = "text",
}: LabelType) => {
  return (
    <div>
      <label className="block mb-2 text-lg text-black font-semibold pt-4">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
};
