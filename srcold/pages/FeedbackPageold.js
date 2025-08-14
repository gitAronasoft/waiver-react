import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FeedbackPage() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Fetch customer name
    axios
      .get(`${BACKEND_URL}/api/waivers/rate/${id}`)
      .then((res) => {
        setCustomerName(res.data.first_name);
      })
      .catch((err) => console.error('Failed to fetch customer name:', err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

        await axios.post(`${BACKEND_URL}/api/waivers/feedback`, {
      id,
      message: feedback,
    });  

    
      await axios.post(`${BACKEND_URL}/api/waivers/send-feedback`, {
        id,
        message: feedback,
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
                      <textarea
                        className="form-control mb-3"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows="5"
                        required
                      />
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
