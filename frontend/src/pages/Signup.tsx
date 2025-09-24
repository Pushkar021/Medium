import React, { useEffect } from "react";
import Quote from "../Components/Quote";
import { Auth } from "../Components/Auth";
import { createBlogSchema, updateBlogSchema } from "pushkar-blog-common";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const Signup = () => {
  const navigate = useNavigate()
   useEffect(()=>{
    if(localStorage.getItem("token")){
navigate("/blogs")
    }
   })
  return (
    <div className="flex flex-col md:flex-row h-screen sm:p-0 p-5 mr-5 sm:mr-0 ">
      <div className="w-full md:w-1/2 md:ml-0 md:mr-0 mr-2.5 ml-2.5  ">
        <Auth type="Signup" />
      </div>
      <div className="hidden md:block w-1/2 ">
        <Quote />
      </div>
    </div>  
  );
};
