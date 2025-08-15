import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";

// DataTables core & CSS
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/dataTables.dataTables.css";

import "datatables.net-responsive-dt/js/responsive.dataTables";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";

import Header from "./components/header";
import { toast } from "react-toastify";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedStaffName, setSelectedStaffName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/staff/getstaff`);
      const sortedData = response.data.sort((a, b) => b.id - a.id);
      setStaff(sortedData);
    } catch (err) {
      console.error("Failed to fetch staff", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await axios.put(`${BACKEND_URL}/api/staff/update-status/${id}`, {
        status: newStatus,
      });
      toast.success("Status updated successfully");
      fetchStaff();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteClick = (id, name) => {
    setSelectedStaffId(id);
    setSelectedStaffName(name);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${BACKEND_URL}/api/staff/delete-staff/${selectedStaffId}`
      );
      toast.success("Staff deleted successfully");
      fetchStaff();
    } catch (error) {
      toast.error("Failed to delete staff");
    } finally {
      setShowModal(false);
      setSelectedStaffId(null);
      setSelectedStaffName("");
    }
  };

  // Initialize DataTable
  useEffect(() => {
    if (!loading && staff.length > 0) {
      if ($.fn.DataTable.isDataTable("#staffTable")) {
        $("#staffTable").DataTable().destroy();
      }
      $("#staffTable").DataTable({
        responsive: true,
        paging: true,
        searching: true,
        ordering: true,
      });
    }
  }, [loading, staff]);

  return (
    <>
      <Header />
      <div className="container mt-5">
        {/* Top Bar with Title + Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Staff List</h2>
          <button
            onClick={() => navigate("/admin/add-staff")}
            className="btn btn-primary"
          >
            + Add Staff
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table
            id="staffTable"
            className="display responsive nowrap"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.role === 1 ? "Admin" : "Staff"}</td>
                  <td>
                    <Switch
                      onChange={() => toggleStatus(row.id, row.status)}
                      checked={row.status === 1}
                      onColor="#4CAF50"
                      offColor="#ccc"
                      handleDiameter={20}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      height={20}
                      width={40}
                    />
                  </td>
                  <td>
                    <i
                      className="fas fa-edit me-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/admin/update-staff/${row.id}`)}
                    />
                    <i
                      className="fas fa-trash"
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleDeleteClick(row.id, row.name)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Staff Member</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{selectedStaffName}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffList;
