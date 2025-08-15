import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";

// DataTables core & CSS
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/dataTables.dataTables.css";

import "datatables.net-responsive-dt/js/responsive.dataTables";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";



import Header from "./components/header";
import { convertToEST } from "../../utils/time";

const AdminFeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
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
    } catch (err) {
      console.error("Failed to fetch feedback", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize DataTable after data loads
  useEffect(() => {
    if (!loading && feedbackList.length > 0) {
      if ($.fn.DataTable.isDataTable("#feedbackTable")) {
        $("#feedbackTable").DataTable().destroy();
      }
      $("#feedbackTable").DataTable({
        responsive: true,
        paging: true,
        searching: true,
        ordering: true,
      });
    }
    $('.dt-search input[type="search"]').attr('placeholder', 'Search feedback...');
  }, [loading, feedbackList]);

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h5 className="h5-heading my-3 pb-3">Customer Feedback</h5>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table
            id="feedbackTable"
            className="display responsive nowrap"
            style={{ width: "100%" }}
          >
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
            <tbody>
              {feedbackList.map((row, index) => (
                <tr key={row.id || index}>
                  <td>{index + 1}</td>
                  <td>{`${row.first_name || ""} ${row.last_name || ""}`}</td>
                  <td>{row.rating || "-"}</td>
                  <td>{row.issue || "-"}</td>
                  <td>{row.staff_name || "-"}</td>
                  <td>{row.message || "-"}</td>
                  <td>{row.created_at ? convertToEST(row.created_at) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminFeedbackPage;
