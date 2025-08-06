import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // ✅ make sure to import useLocation
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

export default function FeedbackPage() {
  const query = new URLSearchParams(useLocation().search);
const userId = query.get('userId');
const feedbackId = query.get('feedbackId');

  // const { userId } =  query.get('userId'); // user ID

  // const query = new URLSearchParams(location.search);
  // const feedbackId = query.get('feedbackId'); // ✅ get feedback ID from query string
  const location = useLocation(); // ✅ initialize useLocation
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [issue, setIssue] = useState('');
  const [staffName, setStaffName] = useState('');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/waivers/rate/${userId}`)
      .then((res) => {
        const { first_name, last_name } = res.data;
        setCustomerName(`${first_name} ${last_name}`);
      })
      .catch((err) => console.error('Failed to fetch customer name:', err));
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BACKEND_URL}/api/waivers/feedback`, {
        userId,
        feedbackId,
        issue,
        staffName,
        message: feedback,
      });

      await axios.post(`${BACKEND_URL}/api/waivers/send-feedback`, {
        userId,
        feedbackId,
        issue,
        staffName,
        message: feedback
       
      });

      toast.success('Feedback submitted successfully!');
      setSubmitted(true);
    } catch (err) {
      toast.error('Failed to send feedback. Try again later.');
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="p-4 bg-white rounded shadow-sm">
                <img
                  className="img-fluid mb-3"
                  src="/assets/img/SKATE_AND_PLAY_V08_Full_Transparency (2) 1.png"
                  alt="logo"
                  style={{ maxWidth: '200px' }}
                />
                <h5 className="mb-3">Hi {customerName},</h5>
                {!submitted ? (
                  <>
                    <h4>We’re sorry your experience wasn’t perfect</h4>
                    <p>Please let us know what we could do better:</p>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3 text-start">
                        <label htmlFor="issue" className="form-label">
                          What was wrong?
                        </label>
                        <select
                          id="issue"
                          className="form-select"
                          value={issue}
                          onChange={(e) => setIssue(e.target.value)}
                          required
                        >
                          <option value="">Select an issue</option>
                          <option value="Long wait time">Long wait time</option>
                          <option value="Rude staff">Rude staff</option>
                          <option value="Unclean facility">Unclean facility</option>
                          <option value="Safety concern">Safety concern</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="mb-3 text-start">
                        <label htmlFor="staffName" className="form-label">
                          Staff Name (optional)
                        </label>
                        <input
                          id="staffName"
                          className="form-control"
                          value={staffName}
                          onChange={(e) => setStaffName(e.target.value)}
                          placeholder="Enter staff name if known"
                        />
                      </div>

                      <div className="mb-3 text-start">
                        <label htmlFor="comments" className="form-label">
                          Additional Comments
                        </label>
                        <textarea
                          id="comments"
                          className="form-control"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          rows="5"
                          required
                        />
                      </div>

                      <button className="btn btn-primary" type="submit">
                        Submit Feedback
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <h4 className="text-success mb-3">Thank You!</h4>
                    <p>Your feedback helps us improve your experience.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
