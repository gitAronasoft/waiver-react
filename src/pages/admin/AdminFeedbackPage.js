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
  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Escape HTML safely for tooltip
  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (s) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        s
      ])
    );

  // Fetch feedback from backend
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/waivers/getfeedback`
        );
        const sorted = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        console.log("Feedback data:", sorted); // Debug
        setFeedbackList(sorted);
      } catch (err) {
        console.error("Failed to fetch feedback", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [BACKEND_URL]);

  // Initialize DataTable after feedback loads
  useEffect(() => {
    if (loading || feedbackList.length === 0) return;

    if ($.fn.DataTable.isDataTable("#feedbackTable")) {
      $("#feedbackTable").DataTable().destroy();
    }

    setTimeout(() => {
      const dt = $("#feedbackTable").DataTable({
        data: feedbackList,
        responsive: true,
        paging: true,
        searching: true,
        ordering: true,
        autoWidth: false,
        columns: [
          {
            data: null,
            render: (data, type, row, meta) => meta.row + 1, // row index
          },
          {
            data: null,
            render: (row) => `${row.first_name || ""} ${row.last_name || ""}`,
          },
          { data: "rating", defaultContent: "-" },
          { data: "issue", defaultContent: "-" },
          { data: "staff_name", defaultContent: "-" },
          // {
          //   data: "message",
          //   render: (data, type) => {
          //     if (!data) return "-";
          //     if (type !== "display") return data;

          //     const max = 80;
          //     const full = escapeHtml(data);
          //     const shown =
          //       data.length > max ? escapeHtml(data.slice(0, max)) + "…" : full;

          //     return `<span title="${full}">${shown}</span>`;
          //   },
          // },
            {
                data: "message",
                render: (data, type) => {
                  if (!data) return "-";
                  if (type !== "display") return data;

                  const full = escapeHtml(data);
                  return `<span title="${full}">${full}</span>`; // ✅ show everything
                },
              },
            {
            data: "created_at",
            render: (data) => (data ? convertToEST(data) : "-"),
          },
        ],
      });

      $(".dt-search input[type='search']").attr(
        "placeholder",
        "Search feedback..."
      );
    }, 0);
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
            className="display responsive"
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
            <tbody />
          </table>
        )}
      </div>
    </>
  );
};

export default AdminFeedbackPage;
