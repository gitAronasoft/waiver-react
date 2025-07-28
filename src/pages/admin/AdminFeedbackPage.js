import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Header from "./components/header";
import Skeleton from "react-loading-skeleton";
import { convertToEST } from "../../utils/time"; // adjust path if needed


const AdminFeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/waivers/getfeedback`);
      const sorted = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFeedbackList(sorted);
      setFilteredFeedback(sorted);
    } catch (err) {
      console.error("Failed to fetch feedback", err);
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  useEffect(() => {
    const result = feedbackList.filter((item) =>
      `${item.first_name} ${item.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      (item.message || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredFeedback(result);
  }, [search, feedbackList]);

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Customer",
      selector: (row) => `${row.first_name || ""} ${row.last_name || ""}`,
      sortable: true,
    },
    {
      name: "Rating",
      selector: (row) => row.rating || "-",
      sortable: true,
      width: "100px",
    },
    {
      name: "Issue",
      selector: (row) => row.issue || "-",
      sortable: true,
      width: "120px",
    },
    {
      name: "Staff Name",
      selector: (row) => row.staff_name || "-",
      sortable: true,
      width: "100px",
    },
    {
      name: "Message",
      selector: (row) => row.message || "-",
      wrap: true,
      grow: 2,
    },
    {
        name: "Date",
        selector: (row) =>
            row.created_at ? convertToEST(row.created_at) : "-",
        sortable: true,
        wrap: true,
    },
  ];

  const renderSkeletonRows = () => {
    return Array(6)
      .fill()
      .map((_, i) => (
        <tr key={i}>
          <td><Skeleton width={30} /></td>
          <td><Skeleton width={100} /></td>
          <td><Skeleton width={60} /></td>
          <td><Skeleton width={80} /></td>
          <td><Skeleton width={100} /></td>
          <td><Skeleton width={200} /></td>
          <td><Skeleton width={150} /></td>
        </tr>
      ));
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-10 mx-auto">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="custom-search-box">
                <span className="search-icon">
                  <img src="/assets/img/solar_magnifer-outline.png" alt="search" />
                </span>
                <input
                  type="text"
                  placeholder="Search Feedback"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Data Table */}
            {loading ? (
              <div className="history-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Rating</th>
                      <th>Issue</th>
                      <th>Staff Name</th>
                      <th>Message</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>{renderSkeletonRows()}</tbody>
                </table>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredFeedback}
                pagination
                highlightOnHover
                striped
                responsive
                persistTableHead
                noDataComponent="No feedback found"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminFeedbackPage;
