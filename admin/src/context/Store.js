"use client";
import client from "@/config";
import { getCookie } from "cookies-next";
import React, { createContext, useContext, useState } from "react";

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [listings, setListings] = useState({ documents: [] });
  const [categories, setCategories] = useState({ documents: [] });
  const [reports, setReports] = useState({ documents: [] });
  const [users, setUsers] = useState({ documents: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await client.get("/listings");
      setListings(res.data);
      res.data && setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await client.get("/categories");
      setCategories(res.data);
      res.data && setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await client.get("/users", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      setUsers(res.data);
      res.data && setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await client.get("/listings/reports", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      setReports(res.data);
      res.data && setLoading(false);
      console.log(res.data);
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const selectCategory = (category) => setSelectedCategory(category);

  return (
    <StoreContext.Provider
      displayName="StoreContext"
      value={{
        loading,
        listings,
        reports,
        categories,
        users,
        error,
        selectedCategory,
        setSelectedCategory,
        setLoading,
        setListings,
        setCategories,
        setError,
        setUsers,
        setReports,
        fetchCategories,
        selectCategory,
        fetchListings,
        fetchUsers,
        fetchReports,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;

export const useStore = () => {
  const {
    loading,
    listings,
    reports,
    categories,
    selectedCategory,
    setSelectedCategory,
    users,
    error,
    setLoading,
    setListings,
    setCategories,
    setError,
    setUsers,
    setReports,
    fetchCategories,
    selectCategory,
    fetchListings,
    fetchUsers,
    fetchReports,
  } = useContext(StoreContext);

  return {
    loading,
    listings,
    reports,
    categories,
    selectedCategory,
    setSelectedCategory,
    users,
    error,
    setLoading,
    setListings,
    setCategories,
    setError,
    setUsers,
    setReports,
    fetchCategories,
    selectCategory,
    fetchListings,
    fetchUsers,
    fetchReports,
  };
};
