import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import axios from 'axios';

function StarRatingPage() {
  const { id } = useParams(); // waiver id
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const GOOGLE_REVIEW_LINK = process.env.REACT_APP_GOOGLE_REVIEW_LINK;


useEffect(() => {
  axios.get(`${BACKEND_URL}/api/waivers/rate/${id}`)
    .then(res => {
      const { first_name, last_name } = res.data;
      setCustomerName(`${first_name} ${last_name}`);
    })
    .catch(err => console.error('Failed to fetch customer:', err));
}, [id]);


  const handleRating = async (rate) => {
    setRating(rate);
    setSubmitted(true);

    // try {
    //   // await axios.post(`/api/waivers/rate/${id}`, { rating: rate });
    //   await axios.post(`${BACKEND_URL}/api/waivers/rate/${id}`, { rating: rate });
      
    //   // Redirect after a short delay
    //   setTimeout(() => {
    //     if (rate === 5) {
    //       window.location.href = 'https://g.page/YOUR_GOOGLE_REVIEW_LINK';
    //     } else {
    //       navigate(`/feedback/${id}`);
    //     }
    //   }, 1500);
    // } catch (error) {
    //   console.error('Rating submission error:', error);
    // }
    try {
  const response = await axios.post(`${BACKEND_URL}/api/waivers/rate/${id}`, { rating: rate });
  const feedbackId = response.data.feedbackId;

  setTimeout(() => {
    if (rate === 5) {
         window.location.href = GOOGLE_REVIEW_LINK; 
    } else {
      // Navigate with user id and feedback id
      navigate(`/feedback?userId=${id}&feedbackId=${feedbackId}`);

    }
  }, 1000);
} catch (error) {
  console.error('Rating error:', error);
}

  };

  return (
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
              <h5 className="fw-bold mb-2">We’d love to know how your experience was.</h5>
              <p className="fw-bold mb-3">Please take a few seconds to rate your visit:</p>

              {/* ⭐ Star Rating */}
              <div className="d-flex justify-content-center mb-4">
                <Rating
                    onClick={handleRating}
                    size={50}
                    initialValue={0}
                    allowFraction={false}
                    transition
                  />
              </div>

              

              <h6 className="mb-2">It only takes a moment and really helps us improve.</h6>
              <h6>Thanks for being part of the fun — we hope to see you again soon!</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StarRatingPage;
