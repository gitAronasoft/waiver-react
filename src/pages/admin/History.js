import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from "react-toastify";
import Header from './components/header';
import Switch from "react-switch";

function HistoryPage() {
  const [waivers, setWaivers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'delete' or 'status'
  const [selectedEntry, setSelectedEntry] = useState(null);

  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    setLoading(true);
    axios.get(`${BACKEND_URL}/api/waivers/getallwaivers`)
      .then(res => {
        setWaivers(res.data);
        setFiltered(res.data);
      })
      .catch(err => {
        console.error("Error fetching waivers:", err);
        toast.error("Failed to load waivers.");
      })
      .finally(() => setLoading(false));
  }, [BACKEND_URL]);

  useEffect(() => {
    let data = waivers;
    if (filter !== 'All') {
      data = waivers.filter(w => {
        if (filter === 'Confirmed') return w.status === 1;
        if (filter === 'Unconfirmed') return w.status === 0;
        if (filter === 'Inaccurate') return w.status === 2;
        return true;
      });
    }

    if (search.trim() !== "") {
      data = data.filter((w) => {
        const fullName = `${w.first_name} ${w.last_name}`.toLowerCase();
        const minorNames = (w.minors || []).map(m => `${m.first_name} ${m.last_name}`.toLowerCase());
        return (
          fullName.includes(search.toLowerCase()) ||
          minorNames.some(name => name.includes(search.toLowerCase()))
        );
      });
    }

    setFiltered(data);
  }, [filter, search, waivers]);

  const openModal = (entry, type) => {
    setSelectedEntry(entry);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEntry(null);
    setModalType("");
  };

  const handleConfirmModalAction = async () => {
    if (!selectedEntry) return;

    try {
      if (modalType === "delete") {
        await axios.delete(`${BACKEND_URL}/api/waivers/${selectedEntry.waiver_id}`);
        toast.success("Waiver deleted successfully.");
        setWaivers(prev => prev.filter(w => w.waiver_id !== selectedEntry.waiver_id));
      } else if (modalType === "status") {
        const newStatus = selectedEntry.status === 1 ? 0 : 1;
        await axios.put(`${BACKEND_URL}/api/waivers/${selectedEntry.waiver_id}/status`, { status: newStatus });
        toast.success(`Waiver marked as ${newStatus === 1 ? 'Confirmed' : 'Unconfirmed'}.`);
        setWaivers(prev =>
          prev.map(w => w.waiver_id === selectedEntry.waiver_id ? { ...w, status: newStatus } : w)
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Action failed.");
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-10 mx-auto">

            {/* Search */}
            <div className="custom-search-box mb-4">
              <span className="search-icon">
                <img src="/assets/img/solar_magnifer-outline.png" alt="Search" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or minors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="d-flex gap-5 align-items-center my-4">
              {['All', 'Confirmed', 'Unconfirmed', 'Inaccurate'].map((type) => (
                <div
                  key={type}
                  className={`all-waiver ${filter === type ? 'active-tab' : ''}`}
                  onClick={() => setFilter(type)}
                >
                  {type}
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="history-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Minors</th>
                    <th>Signed Date & Time</th>
                    <th>Status</th>
                    <th>Verified</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td><Skeleton width={50} /></td>
                        <td><Skeleton width={120} /></td>
                        <td><Skeleton width={100} /></td>
                        <td><Skeleton width={140} /></td>
                        <td><Skeleton width={100} /></td>
                        <td><Skeleton width={100} /></td>
                        <td><Skeleton width={100} /></td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">No records found</td>
                    </tr>
                  ) : (
                    filtered.map((entry, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{entry.first_name} {entry.last_name}</td>
                        <td>
                          {entry.minors?.map((minor, i) => (
                            <div key={i}>{minor.first_name} {minor.last_name}</div>
                          ))}
                        </td>
                        <td>{entry.signed_at}</td>
                        <td>
                          <span
                            className={`status-badge ${entry.status === 1 ? 'confirmed' : entry.status === 0 ? 'unconfirmed' : 'inaccurate'}`}
                          >
                            {entry.status === 1 ? 'Confirmed' : entry.status === 0 ? 'Unconfirmed' : 'Inaccurate'}
                          </span>
                        </td>
                        <td>
                          <Switch
                            onChange={() => {
                              if (entry.status === 2) {
                                toast.info("Inaccurate waivers cannot be updated.");
                                return;
                              }
                              openModal(entry, "status");
                            }}
                            checked={entry.status === 1}
                            onColor="#4CAF50"
                            offColor="#ccc"
                            handleDiameter={20}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            height={20}
                            width={40}
                            disabled={entry.status === 2}
                          />
                        </td>
                        <td className="text-center d-flex gap-3 align-items-center">
                          <i
                            className="fas fa-eye me-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/admin/client-profile/${entry.id}`)}
                          />
                          <i
                            className="fas fa-trash"
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={() => openModal(entry, "delete")}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedEntry && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "delete" ? "Delete Waiver" : "Change Status"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {modalType === "delete" ? (
                  <p>Are you sure you want to delete this waiver for <strong>{selectedEntry.first_name} {selectedEntry.last_name}</strong>?</p>
                ) : (
                  <p>
                    Are you sure you want to{" "}
                    <strong>{selectedEntry.status === 1 ? "Unconfirm" : "Confirm"}</strong> this waiver for{" "}
                    <strong>{selectedEntry.first_name} {selectedEntry.last_name}</strong>?
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button className="btn btn-danger" onClick={handleConfirmModalAction}>
                  Yes, {modalType === "delete" ? "Delete" : selectedEntry.status === 1 ? "Unconfirm" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HistoryPage;
