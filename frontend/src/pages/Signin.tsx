import React, { useEffect } from "react";
import { Auth } from "../Components/Auth";
import Quote from "../Components/Quote";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/blogs");
    }
  });
  return (
    <div className="flex flex-col md:flex-row h-screen  ">
      <div className="w-full md:w-1/2 md:ml-0 md:mr-0  ml-2.5 sm:p-0 p-5 mr-5 sm:mr-0   ">
        <Auth type="Signin" />
      </div>
      <div className="hidden md:block w-1/2 ">
        <Quote />
      </div>
    </div>
  );
};
