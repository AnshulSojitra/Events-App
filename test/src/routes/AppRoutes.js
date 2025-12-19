import { Routes, Route } from "react-router-dom";
import { Add } from "../Components/Add";
import Form from "../pages/Form";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Post } from "../pages/Post";
import { EventForm } from "../pages/EventForm";
import { Events } from "../pages/Events";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Add />} />
      <Route path="/form" element={<Form />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/post" element={<Post />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/new" element={<EventForm />} />
      <Route path="/events/:id/edit" element={<EventForm />} />
    </Routes>
  );
};
