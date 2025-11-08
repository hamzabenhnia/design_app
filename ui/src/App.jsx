import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/LogIn";
import Register from "./pages/Register";
import Description from "./pages/Description";
import DesignPage from "./pages/DesignPage";
import MyCollection from "./pages/MyCollection";
import UserList from "./pages/UsersList"
import AddModel from "./pages/AddModel";
import Profile from "./pages/Profile" ;
import NavBar from "./components/NavBar";
export default function App() {
  return (
    <div>
      <NavBar />
      <main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/description" element={<Description />} />
      <Route path="/design" element={<DesignPage />} />
      <Route path="/collection" element={<MyCollection />} />
      <Route path="/users" element={ <UserList />} />
      <Route path="/add" element={<AddModel />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
    </main>
    </div>
  );
}
