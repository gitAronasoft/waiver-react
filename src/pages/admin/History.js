import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Header from './components/header';
import { convertToEST } from "../../utils/time";

function HistoryPage() {
  const [waivers, setWaivers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
      })
      .finally(() => setLoading(false));
  }, [BACKEND_URL]);

  // Filter based on tab selection (All, Confirmed, Unconfirmed)
  useEffect(() => {
    let data = waivers;
    if (filter !== 'All') {
      data = waivers.filter(w => filter === 'Confirmed' ? w.status === 1 : w.status === 0);
    }

    // Apply search filter as well
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

  return (
    <>
      <Header />

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-10 mx-auto">
            {/* Search Bar */}
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

            {/* Tabs */}
            <div className="d-flex gap-5 align-items-center my-4">
              <div
                className={`all-waiver ${filter === 'All' ? 'active-tab' : ''}`}
                onClick={() => setFilter('All')}
              >
                All Waiver
              </div>
              <div
                className={`all-waiver ${filter === 'Confirmed' ? 'active-tab' : ''}`}
                onClick={() => setFilter('Confirmed')}
              >
                Confirmed
              </div>
              <div
                className={`all-waiver ${filter === 'Unconfirmed' ? 'active-tab' : ''}`}
                onClick={() => setFilter('Unconfirmed')}
              >
                Unconfirmed
              </div>
            </div>

            {/* Table */}
            <div className="history-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Minors</th>
                    <th>Signed Date & Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    // Skeleton Rows
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td><Skeleton width={50} /></td>
                        <td><Skeleton width={120} /></td>
                        <td><Skeleton width={100} /></td>
                        <td><Skeleton width={140} /></td>
                        <td><Skeleton width={100} /></td>
                        <td><Skeleton width={50} /></td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.id}</td>
                        <td>{entry.first_name} {entry.last_name}</td>
                        <td>
                          {entry.minors?.map((minor, i) => (
                            <div key={i}>{minor.first_name} {minor.last_name}</div>
                          ))}
                        </td>
                        <td>
                          {entry.signed_at
                            ? convertToEST(entry.signed_at, "YYYY-MM-DD hh:mm A")
                            : "N/A"}
                        </td>
                        <td>
                          <span className={`status-badge ${entry.status === 1 ? 'confirmed' : 'unconfirmed'}`}>
                            {entry.status === 1 ? 'Confirmed' : 'Unconfirmed'}
                          </span>
                        </td>
                        <td className="text-center">
                          <Link to={`/admin/client-profile/${entry.id}`}>
                            <img src="/assets/img/Group 2474.png" alt="Action" />
                          </Link>
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
    </>
  );
}

export default HistoryPage;
