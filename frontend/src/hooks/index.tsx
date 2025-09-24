import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_DATABASE_URL;

interface Blog {
  autherName: string;
  title: string;
  content: string;
  createdAt: string;
}


  //extra done by me on 11/8
  export const useBlog = (id:string)=>{
    
    const [getblog,setblog] = useState([])
    useEffect(()=>{
          const fn = async()=>{
            const url =
              `${backendUrl}/api/v1/blog/test/${id}`
            const res = await axios.get(url, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            });
            setblog(res.data.message)
          }
          fn()
    },[id])
  return {getblog}
  }

//get a particular user's blog
export const useUserBlog = ()=>{
  const [blogs,setBlogs] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const url =
        `${backendUrl}/api/v1/blog/test/myblog`;
      const token = localStorage.getItem("token");

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setBlogs(res.data.data || []);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }, []);

    return { blogs, loading };
}

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url =  `${backendUrl}/api/v1/blog/bulk`;
    const token = localStorage.getItem("token");

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBlogs(res.data.blogs || [])
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  return { blogs, loading };
};


export const useDebounce = (cb: string) => {
  const [debouncedVal, setDebouncedVal] = useState(cb);

  useEffect(() => {
    if (!cb || cb.trim() === "") return; // ✅ skip empty search

    const handler = setTimeout(async () => {
      try {
        const url = `${backendUrl}/api/v1/blog/search/${cb}`; // ✅ use proxy instead of hard backendUrl
        const res = await axios.get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        setDebouncedVal(res.data);
      } catch (err) {
        console.log("ok");
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [cb]);

  return debouncedVal;
};




const getBlogItem = ({id}:{id:string})=>{
const url = ""
}


