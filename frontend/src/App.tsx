import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Blogs } from "./pages/Blogs";
import { Read } from "./pages/Read";
import { CreateBlog } from "./pages/CreateBlog";
import { User } from "./pages/User";
import { EditBlog } from "./pages/EditBlog";
import { Xyz } from "./pages/Xyz";

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<Read />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/user" element={<User />} />
          <Route path="user/edit/:id" element={<EditBlog />} />
          <Route path="xyz" element={<Xyz />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
