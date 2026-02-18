import { useQuery } from "@tanstack/react-query";
import React from "react";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { useAuthUser } from "../hooks/useAuthUser.js";
import PostCreation from "../components/PostCreation.jsx";

const Homepage = () => {
  const { data: authenticatedUser } = useAuthUser();

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authenticatedUser} />
      </div>
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authenticatedUser} />
      </div>
    </div>
  );
};

export default Homepage;
