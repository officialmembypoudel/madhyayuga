"use client";
import client from "@/config";
import { getCookie } from "cookies-next";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const { user } = useAuth();
  const [listings, setListings] = useState({ documents: [] });
  const [categories, setCategories] = useState({ documents: [] });
  const [reports, setReports] = useState({ documents: [] });
  const [users, setUsers] = useState({ documents: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [reportMessages, setReportMessages] = useState({ documents: [] });
  const [locations, setLocations] = useState({ documents: [] });
  const [selectedLocation, setSelectedLocation] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await client.get("/listings", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      setListings(res.data);
      res.data && setLoading(false);
      console.warn(res.data);
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message);
      console.warn(error.message);
    }
  };

  const updateListings = async (id, data) => {
    try {
      setUpdateLoading(true);
      const res = await client.put(`/listings/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      res.data && setUpdateLoading(false);
      res.data && fetchListings();
    } catch (error) {
      setUpdateLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const rejectListings = async (id, message, callBack, setState) => {
    try {
      setUpdateLoading(true);
      const res = await client.post(
        `/listings/${id}/reject`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      res.data && setUpdateLoading(false);
      res.data && fetchListings();
      res.data && callBack();
      // res.data && setState(res.data?.document?.rejected);
    } catch (error) {
      setUpdateLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const unRejectListing = async (id, callback) => {
    try {
      setUpdateLoading(true);
      const res = await client.post(
        `/listings/${id}/reject`,
        { message: "" },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      res.data && setUpdateLoading(false);
      res.data && fetchListings();
      res.data && callback();
    } catch (error) {
      setUpdateLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const deleteListings = async (id, message) => {
    try {
      console.log(id, message);
      setUpdateLoading(true);
      const res = await client.delete(
        `/listings/update/${id}`,

        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
          data: { message },
        }
      );
      res.data && setUpdateLoading(false);
      res.data && fetchListings();
    } catch (error) {
      setUpdateLoading(false);
      setError(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
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

  const addcategory = async (category, callBack) => {
    try {
      setLoading(true);
      const res = await client.post("/categories/add", category, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      res.data && fetchCategories();
      res.data && setLoading(false);
      res.data && callBack();
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const getCategoryListingCount = async (id) => {
    try {
      const res = await client.get(`/listings/${id}/count`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      return res.data?.total;
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const updateCategories = async (data, callBack) => {
    try {
      setUpdateLoading(true);
      const res = await client.put(`/categories/update/${data._id}`, data, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      res.data && setUpdateLoading(false);
      res.data && fetchCategories();
      res.data && callBack();
      return res.data?.document;
    } catch (error) {
      setUpdateLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const deleteCategories = async (id) => {
    try {
      setUpdateLoading(true);
      const res = await client.delete(`/categories/update/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      res.data && setUpdateLoading(false);
      res.data && fetchCategories();
    } catch (error) {
      setUpdateLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await client.get("/locations");
      setLocations(res.data);
      res.data && setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const getLocationListingCount = async (city) => {
    try {
      const res = await client.get(`/listings/location/${city}/count`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      return res.data?.total;
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const addLocation = async (location, callBack) => {
    try {
      setLoading(true);
      const res = await client.post("/locations/add", location, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      res.data && fetchLocations();
      res.data && setLoading(false);
      res.data && callBack();
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const updateLocation = async (data, callBack) => {
    try {
      setUpdateLoading(true);
      const res = await client.put(`/locations/update/${data._id}`, data, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      res.data && setUpdateLoading(false);
      res.data && fetchLocations();
      res.data && callBack();
      setSelectedLocation(res.data?.document);
    } catch (error) {
      setUpdateLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const deleteLocation = async (id) => {
    try {
      setUpdateLoading(true);
      const res = await client.delete(`/locations/update/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      res.data && setUpdateLoading(false);
      res.data && fetchLocations();
      res.data && setSelectedLocation(null);
    } catch (error) {
      setUpdateLoading(false);
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

  const suspendUser = async (id, message, callBack) => {
    try {
      setUpdateLoading(true);
      const res = await client.patch(
        `/users/update/${id}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      res.data && setUpdateLoading(false);
      res.data && fetchUsers();
      res.data && callBack();
      // res.data && setState(res.data?.document?.rejected);
    } catch (error) {
      setUpdateLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const unsuspendedUser = async (id, callback) => {
    try {
      setUpdateLoading(true);
      const res = await client.patch(
        `/users/update/${id}`,
        { message: "" },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      res.data && setUpdateLoading(false);
      res.data && fetchUsers();
      res.data && callback();
    } catch (error) {
      setUpdateLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const deleteUser = async (id, message) => {
    try {
      setUpdateLoading(true);
      const res = await client.delete(`/users/update/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
        data: { message },
      });
      res.data && setUpdateLoading(false);
      res.data && fetchUsers();
    } catch (error) {
      setUpdateLoading(false);
      setError(error?.response?.data?.message);
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

  const fetchReportMessages = async (id) => {
    try {
      const res = await client.get(`/listings/reports/${id}/messages`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      setReportMessages(res.data);
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const updateReports = async (id, data) => {
    try {
      setUpdateLoading(true);
      const res = await client.put(`/listings/reports/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      res.data && setUpdateLoading(false);
      res.data && fetchReports();
      res.data && fetchReportMessages(id);
    } catch (error) {
      setUpdateLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  const deleteReports = async (id) => {
    try {
      setUpdateLoading(true);
      const res = await client.delete(`/listings/reports/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      res.data && setUpdateLoading(false);
      res.data && fetchReports();
    } catch (error) {
      setUpdateLoading(false);
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
        updateLoading,
        setUpdateLoading,
        setSelectedCategory,
        setLoading,
        setListings,
        setCategories,
        setError,
        setUsers,
        setReports,
        fetchCategories,
        addcategory,
        getCategoryListingCount,
        selectCategory,
        fetchListings,
        rejectListings,
        unRejectListing,
        fetchUsers,
        suspendUser,
        unsuspendedUser,
        deleteUser,
        fetchReports,
        updateListings,
        updateCategories,
        updateReports,
        deleteListings,
        deleteCategories,
        deleteReports,
        fetchReportMessages,
        reportMessages,
        setReportMessages,
        fetchLocations,
        addLocation,
        updateLocation,
        deleteLocation,
        setSelectedLocation,
        selectedLocation,
        locations,
        getLocationListingCount,
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

    updateLoading,
    setUpdateLoading,
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
    suspendUser,
    unsuspendedUser,
    deleteUser,
    fetchReports,
    updateListings,
    rejectListings,
    unRejectListing,
    updateCategories,
    updateReports,
    deleteListings,
    deleteCategories,
    deleteReports,
    fetchReportMessages,
    reportMessages,
    setReportMessages,
    addcategory,
    getCategoryListingCount,
    fetchLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    setSelectedLocation,
    selectedLocation,
    locations,
    getLocationListingCount,
  } = useContext(StoreContext);

  return {
    loading,
    listings,
    reports,
    categories,
    selectedCategory,
    setSelectedCategory,

    updateLoading,
    setUpdateLoading,
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
    suspendUser,
    unsuspendedUser,
    deleteUser,
    fetchReports,
    updateListings,
    rejectListings,
    unRejectListing,
    updateCategories,
    updateReports,
    deleteListings,
    deleteCategories,
    deleteReports,
    fetchReportMessages,
    reportMessages,
    setReportMessages,
    addcategory,
    getCategoryListingCount,
    fetchLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    setSelectedLocation,
    locations,
    selectedLocation,
    getLocationListingCount,
  };
};
