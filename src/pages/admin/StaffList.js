import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Header from "./components/header";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";


function StaffList() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const navigate = useNavigate();

  // Fetch Staff List
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/staff/getstaff`);
      const sortedData = response.data.sort((a, b) => b.id - a.id);
      setStaff(sortedData);
      setFilteredStaff(sortedData);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [BACKEND_URL]);

  // Search Filter
  useEffect(() => {
    const result = staff.filter(
      (member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStaff(result);
  }, [search, staff]);

  // Toggle Status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await axios.put(`${BACKEND_URL}/api/staff/update-status/${id}`, { status: newStatus });
      toast.success("Status updated successfully");
      fetchStaff();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Delete Staff
  const deleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/staff/delete-staff/${id}`);
      toast.success("Staff deleted successfully");
      fetchStaff();
    } catch (error) {
      toast.error("Failed to delete staff");
    }
  };

  // Columns for DataTable
  const columns = [
    { name: "SrNo", selector: (row, index) => index + 1, width: "70px" },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Role", selector: (row) => (row.role === 1 ? "Admin" : "Staff") },
    {
      name: "Status",
      cell: (row) => (
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
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <i
            className="fas fa-edit me-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/admin/update-staff/${row.id}`)}
          />
          <i
            className="fas fa-trash"
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => deleteStaff(row.id)}
          />
        </div>
      ),
    },
  ];

  // Skeleton Rows
  const renderSkeletonRows = () => {
    return Array(6)
      .fill()
      .map((_, i) => (
        <tr key={i}>
          <td><Skeleton height={20} width={30} /></td>
          <td><Skeleton height={20} width={100} /></td>
          <td><Skeleton height={20} width={150} /></td>
          <td><Skeleton height={20} width={70} /></td>
          <td><Skeleton height={20} width={60} /></td>
          <td><Skeleton height={20} width={80} /></td>
        </tr>
      ));
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-10 mx-auto">
            {/* Top Bar */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="custom-search-box">
                <span className="search-icon">
                  <img src="/assets/img/solar_magnifer-outline.png" alt="search" />
                </span>
                <input
                  type="text"
                  placeholder="Search Staff"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => navigate("/admin/add-staff")}
                className="btn btn-primary"
              >
                + Add Staff
              </button>
            </div>

            {/* Skeleton or DataTable */}
            {loading ? (
              <div className="history-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>SrNo</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{renderSkeletonRows()}</tbody>
                </table>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredStaff}
                pagination
                highlightOnHover
                striped
                responsive
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StaffList;
