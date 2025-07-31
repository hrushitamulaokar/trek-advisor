import React, { useState, useEffect } from 'react';
import './App.css';
import myPhoto from './assets/myPhoto.jpg';
import ValleyOfFlowers from './assets/ValleyOfFlowers.png';
import Kedarkantha from './assets/Kedarkantha.jpg';
import KGL from './assets/KGL.jpg';
import hampta from './assets/hampta.jpg';
import kuari from './assets/kuari.jpg';
import EBC from './assets/EBC.jpg';
import bhrigu from './assets/bhrigu.jpg';
import gaumukh from './assets/gaumukh.jpg';
import har from './assets/har.jpg';
import markha from './assets/markha.jpg';
import moon from './assets/moon.jpg';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { authAPI, trekAPI } from './api';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [selectedTrek, setSelectedTrek] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);

  // --- State for posting a review ---
  const [reviewText, setReviewText] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [showReviewEmoji, setShowReviewEmoji] = useState(false);

  // --- State for comments ---
  const [showCommentIdx, setShowCommentIdx] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showCommentEmoji, setShowCommentEmoji] = useState(false);

  // --- Reviews state (local copy for editing) ---
  const [reviews, setReviews] = useState([]);

  // Treks array
  const treks = [
    {
      id: 1,
      name: "Valley of Flowers",
      image: ValleyOfFlowers,
      experiences: [
        {
          user: "Amit",
          text: "The Valley of Flowers was breathtaking! The meadows were in full bloom.",
          photos: [
            "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
          ],
          likes: 3,
          liked: false,
          comments: [
            { user: "Priya", text: "Wow, looks amazing!" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Kedarkantha",
      image: Kedarkantha,
      experiences: [
        {
          user: "Rahul",
          text: "Snow trek to Kedarkantha was challenging but rewarding.",
          photos: [
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80"
          ],
          likes: 5,
          liked: false,
          comments: [
            { user: "Sneha", text: "I want to go there too!" }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Kashmir Great Lakes",
      image: KGL,
      experiences: [
        {
          user: "Neha",
          text: "The Kashmir Great Lakes trek is a dream come true for every trekker. The lakes are surreal!",
          photos: [
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80"
          ],
          likes: 8,
          liked: false,
          comments: [
            { user: "Rohit", text: "On my bucket list now!" }
          ]
        }
      ]
    },
    {
      id: 4,
      name: "Hampta Pass",
      image: hampta,
      experiences: [
        {
          user: "Sonia",
          text: "Hampta Pass offers the best of both worlds: lush green valleys and stark deserts.",
          photos: [
            "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80"
          ],
          likes: 6,
          liked: false,
          comments: [
            { user: "Aman", text: "Beautiful contrast!" }
          ]
        }
      ]
    },
    {
      id: 5,
      name: "Kuari Pass",
      image: kuari,
      experiences: [
        {
          user: "Vikas",
          text: "The views of Nanda Devi from Kuari Pass are unforgettable.",
          photos: [
            "https://images.unsplash.com/photo-1465378552210-88481e0b7c33?auto=format&fit=crop&w=400&q=80"
          ],
          likes: 4,
          liked: false,
          comments: [
            { user: "Meera", text: "Stunning!" }
          ]
        }
      ]
    },
    {
      id: 6,
      name: "Everest Base Camp",
      image: EBC,
      experiences: [
        {
          user: "Arjun",
          text: "Standing at the base of Everest is a feeling like no other. The journey is tough but worth every step.",
          photos: [
            "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80"
          ],
          likes: 10,
          liked: false,
          comments: [
            { user: "Riya", text: "Incredible achievement!" }
          ]
        }
      ]
    },
    {
      id: 7,
      name: "Bhrigu Lake",
      image: bhrigu,
      experiences: [
        {
          user: "Kiran",
          text: "Bhrigu Lake was still partially frozen when we visited. The reflection of the mountains was magical.",
          photos: [
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
          ],
          likes: 2,
          liked: false,
          comments: [
            { user: "Sahil", text: "Looks so peaceful!" }
          ]
        }
      ]
    },
    {
      id: 8,
      name: "Gaumukh Tapovan",
      image: gaumukh,
      experiences: [
        {
          user: "Deepa",
          text: "The trek to Gaumukh Tapovan is spiritual and scenic. The sight of the Bhagirathi peaks is awe-inspiring.",
          photos: [
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80"
          ],
          likes: 3,
          liked: false,
          comments: [
            { user: "Manoj", text: "Must do for every trekker!" }
          ]
        }
      ]
    },
    {
      id: 9,
      name: "Har ki Dun",
      image: har,
      experiences: [
        {
          user: "Priya",
          text: "Har ki Dun is a valley of gods. The meadows and streams are picture perfect.",
          photos: [
            "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
          ],
          likes: 5,
          liked: false,
          comments: [
            { user: "Amit", text: "Adding to my list!" }
          ]
        }
      ]
    },
    {
      id: 10,
      name: "Markha Valley",
      image: markha,
      experiences: [
        {
          user: "Rachit",
          text: "Markha Valley trek is a journey through Ladakh's heart. The landscapes are out of this world.",
          photos: [
            "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80"
          ],
          likes: 7,
          liked: false,
          comments: [
            { user: "Sonia", text: "Ladakh is calling!" }
          ]
        }
      ]
    },
    {
      id: 11,
      name: "Chandratal",
      image: moon,
      experiences: [
        {
          user: "Simran",
          text: "Chandratal Lake is the most beautiful high-altitude lake I've ever seen. The blue water is mesmerizing.",
          photos: [
            "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80"
          ],
          likes: 6,
          liked: false,
          comments: [
            { user: "Arjun", text: "Wow, what a view!" }
          ]
        }
      ]
    }
  ];

  // --- Add Trek Feature State ---
  const [treksList, setTreksList] = useState([]); // Start with empty array
  const [showAddTrek, setShowAddTrek] = useState(false);
  const [newTrek, setNewTrek] = useState({
    name: '',
    description: '',
    image: null,
    imagePreview: null,
  });

  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState('');

  // Load treks from backend on component mount
  useEffect(() => {
    loadTreks();
  }, []);

  // Helper function to get the correct image source
  const getImageSource = (imagePath) => {
    if (!imagePath) return '';
    
    // If it's a local asset path, import the image
    if (imagePath.startsWith('/src/assets/')) {
      const imageName = imagePath.split('/').pop();
      switch (imageName) {
        case 'ValleyOfFlowers.png': return ValleyOfFlowers;
        case 'Kedarkantha.jpg': return Kedarkantha;
        case 'KGL.jpg': return KGL;
        case 'hampta.jpg': return hampta;
        case 'kuari.jpg': return kuari;
        case 'EBC.jpg': return EBC;
        case 'bhrigu.jpg': return bhrigu;
        case 'gaumukh.jpg': return gaumukh;
        case 'har.jpg': return har;
        case 'markha.jpg': return markha;
        case 'moon.jpg': return moon;
        default: return imagePath;
      }
    }
    
    // If it's a URL (Cloudinary or other), return as is
    return imagePath;
  };

  // Helper function to handle image uploads
  const handleImageUpload = (files) => {
    const imageFiles = Array.from(files);
    return imageFiles;
  };

  // Update reviews when selectedTrek changes
  useEffect(() => {
    setReviews(selectedTrek ? selectedTrek.experiences : []);
    setReviewText('');
    setReviewImages([]);
    setShowReviewEmoji(false);
    setShowCommentIdx(null);
    setCommentText('');
    setShowCommentEmoji(false);
  }, [selectedTrek]);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const googleUser = localStorage.getItem('googleUser');
    
    if (token && googleUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(googleUser));
    } else if (token) {
      // Regular JWT token from backend
      setIsAuthenticated(true);
      // You could also verify the token with backend here
    }
  }, []);

  // --- API Functions ---
  const loadTreks = async () => {
    try {
      const treks = await trekAPI.getAllTreks();
      setTreksList(treks);
    } catch (error) {
      console.error('Error loading treks:', error);
    }
  };

  const handleSignup = async (userData) => {
    try {
      setAuthError('');
      const response = await authAPI.signup(userData);
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setIsAuthenticated(true);
        setCurrentUser(response.user);
        setShowAuth(false);
        setAuthError('');
      } else {
        setAuthError(response.message || 'Signup failed');
      }
    } catch (error) {
      setAuthError('Signup failed. Please try again.');
    }
  };

  const handleLogin = async (userData) => {
    try {
      setAuthError('');
      const response = await authAPI.login(userData);
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setIsAuthenticated(true);
        setCurrentUser(response.user);
        setShowAuth(false);
        setAuthError('');
      } else {
        setAuthError(response.message || 'Login failed');
      }
    } catch (error) {
      setAuthError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google Sign-In successful:', decoded);
      
      // Create a user object from Google data
      const googleUser = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      };
      
      // Store in localStorage (you could also send to your backend)
      localStorage.setItem('authToken', credentialResponse.credential);
      localStorage.setItem('googleUser', JSON.stringify(googleUser));
      
      setIsAuthenticated(true);
      setCurrentUser(googleUser);
      setShowAuth(false);
      setAuthError('');
      
    } catch (error) {
      console.error('Google Sign-In error:', error);
      setAuthError('Google Sign-In failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setAuthError('Google Sign-In failed. Please try again.');
  };

  // --- Handlers ---
  function handleReviewImageChange(e) {
    setReviewImages([...e.target.files]);
  }

  async function handlePostReview() {
    if (!reviewText.trim() && reviewImages.length === 0) return;
    if (!isAuthenticated) {
      alert('Please login to post a review');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('text', reviewText);
      
      // Add photos to form data
      if (reviewImages.length > 0) {
        reviewImages.forEach((image, index) => {
          formData.append('photos', image);
        });
      }
      
      const updatedTrek = await trekAPI.addReview(selectedTrek._id, formData);
      setSelectedTrek(updatedTrek);
      setReviews(updatedTrek.experiences);
      setReviewText('');
      setReviewImages([]);
      setShowReviewEmoji(false);
    } catch (error) {
      console.error('Error posting review:', error);
      alert('Failed to post review. Please try again.');
    }
  }

  async function handleLike(idx) {
    if (!isAuthenticated) {
      alert('Please login to like reviews');
      return;
    }

    try {
      const review = reviews[idx];
      const updatedReview = await trekAPI.likeReview(selectedTrek._id, review._id);
      
      // Update the review in the local state
      setReviews(reviews =>
        reviews.map((r, i) =>
          i === idx ? updatedReview : r
        )
      );
    } catch (error) {
      console.error('Error liking review:', error);
      alert('Failed to like review. Please try again.');
    }
  }

  function toggleComment(idx) {
    setShowCommentIdx(showCommentIdx === idx ? null : idx);
    setCommentText('');
    setShowCommentEmoji(false);
  }

  async function handlePostComment(idx) {
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }

    try {
      const review = reviews[idx];
      await trekAPI.addComment(selectedTrek._id, review._id, commentText);
      
      // Reload the trek to get updated comments
      const updatedTrek = await trekAPI.getTrekById(selectedTrek._id);
      setSelectedTrek(updatedTrek);
      setReviews(updatedTrek.experiences);
      setCommentText('');
      setShowCommentEmoji(false);
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  }

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-title">Trek Advisor</div>
        <div className="navbar-links">
          <span className="nav-link" onClick={() => {
            setShowGallery(true);
            setShowAbout(false);
            setShowAboutUs(false);
            setShowAuth(false);
          }}>
            Explore Treks
          </span>
          <span className="nav-link" onClick={() => {
            setShowAboutUs(true);
            setShowAbout(false);
            setShowAuth(false);
            setShowGallery(false);
          }}>
            About Us
          </span>
          <span className="nav-link" onClick={() => {
            setShowAbout(true);
            setShowAboutUs(false);
            setShowAuth(false);
            setShowGallery(false);
          }}>
            About the Developer
          </span>
          {isAuthenticated ? (
            <span className="nav-link" onClick={handleLogout}>
              Logout ({currentUser?.name})
            </span>
          ) : (
            <span className="nav-link" onClick={() => {
              setShowAuth(true);
              setIsLogin(true);
              setShowAbout(false);
              setShowAboutUs(false);
              setShowGallery(false);
            }}>
              Login
            </span>
          )}
        </div>
      </nav>

      <header className="App-header">
        <h1>Welcome to Trek Advisor!</h1>
        <p>Share and discover real trekking experiences from fellow adventurers.</p>
      </header>

      {/* Trek Gallery Section (only show if showGallery is true) */}
      {showGallery && (
        <div className="trek-gallery">
          <button className="back-btn" onClick={() => setShowGallery(false)}>
            ← Back
          </button>
          <h2>Explore Treks</h2>
          <div className="trek-cards">
            {/* Add Trek Card */}
            <div
              className="trek-card add-trek-card"
              onClick={() => setShowAddTrek(true)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#2e8b57', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>＋</span>
              Add Trek
            </div>
            {/* Existing Treks */}
            {treksList.map(trek => (
              <div
                key={trek._id || trek.id}
                className="trek-card"
                onClick={() => setSelectedTrek(trek)}
              >
                <img src={getImageSource(trek.image)} alt={trek.name} />
                <h3>{trek.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Trek Modal */}
      {showAddTrek && (
        <div className="modal-overlay" onClick={() => setShowAddTrek(false)}>
          <div className="add-trek-modal" onClick={e => e.stopPropagation()}>
            <h2>Add a New Trek</h2>
            <form
              onSubmit={async e => {
                e.preventDefault();
                if (!newTrek.name.trim() || !newTrek.image) return;
                if (!isAuthenticated) {
                  alert('Please login to add a trek');
                  return;
                }

                try {
                  const formData = new FormData();
                  formData.append('name', newTrek.name);
                  formData.append('description', newTrek.description);
                  if (newTrek.image) {
                    formData.append('image', newTrek.image);
                  }
                  
                  await trekAPI.addTrek(formData);
                  await loadTreks(); // Reload treks from backend
                  setShowAddTrek(false);
                  setNewTrek({ name: '', description: '', image: null, imagePreview: null });
                } catch (error) {
                  console.error('Error adding trek:', error);
                  alert('Failed to add trek. Please try again.');
                }
              }}
            >
              <input
                type="text"
                placeholder="Trek Name"
                value={newTrek.name}
                onChange={e => setNewTrek({ ...newTrek, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Short Description (optional)"
                value={newTrek.description}
                onChange={e => setNewTrek({ ...newTrek, description: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    setNewTrek({
                      ...newTrek,
                      image: file,
                      imagePreview: URL.createObjectURL(file),
                    });
                  }
                }}
                required
              />
              {newTrek.imagePreview && (
                <img
                  src={newTrek.imagePreview}
                  alt="Preview"
                  style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, margin: '1rem 0' }}
                />
              )}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="close-btn" onClick={() => setShowAddTrek(false)}>
                  Cancel
                </button>
                <button type="submit" className="post-btn">
                  Add Trek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trek Details Modal */}
      {selectedTrek && (
        <div className="modal-overlay" onClick={() => setSelectedTrek(null)}>
          <div className="trek-modal" onClick={e => e.stopPropagation()}>
            <h2>{selectedTrek.name}</h2>

            {/* --- Post a Review Panel --- */}
            <div className="post-review-panel">
              <textarea
                placeholder="Share your experience... 😊🏔️"
                rows={3}
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
              />
              <div className="review-panel-actions">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleReviewImageChange}
                  id="review-image-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="review-image-upload" className="upload-label">
                  📷 Add Photos
                </label>
                <button
                  type="button"
                  className="emoji-btn"
                  onClick={() => setShowReviewEmoji(!showReviewEmoji)}
                >
                  😀
                </button>
                {showReviewEmoji && (
                  <div className="emoji-picker" style={{ position: 'absolute', zIndex: 2000 }}>
                    <Picker
                      onSelect={emoji => setReviewText(reviewText + emoji.native)}
                      title="Pick an emoji"
                      emoji="point_up"
                    />
                  </div>
                )}
                <button className="post-btn" onClick={handlePostReview}>
                  Post
                </button>
              </div>
              {/* Image Previews */}
              <div className="image-preview-row">
                {reviewImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="preview-img"
                  />
                ))}
              </div>
            </div>

            {/* --- List of Reviews --- */}
            {reviews.map((exp, idx) => (
              <div key={idx} className="trek-experience">
                <strong>{exp.user}</strong>
                <p>{exp.text}</p>
                <div className="trek-photos">
                  {exp.photos.map((photo, i) => (
                    <img key={i} src={getImageSource(photo)} alt="Trek" />
                  ))}
                </div>
                <div className="trek-actions">
                  <button
                    className="like-btn"
                    onClick={() => handleLike(idx)}
                    style={{ color: exp.liked ? '#e74c3c' : '#2e8b57' }}
                  >
                    ❤️ {exp.likes}
                  </button>
                  <button
                    className="comment-btn"
                    onClick={() => toggleComment(idx)}
                  >
                    💬 {exp.comments.length}
                  </button>
                </div>
                {/* Comments */}
                <div className="trek-comments">
                  {exp.comments.map((c, i) => (
                    <div key={i}><b>{c.user}:</b> {c.text}</div>
                  ))}
                </div>
                {/* Add Comment Panel */}
                {showCommentIdx === idx && (
                  <div className="add-comment-panel">
                    <input
                      type="text"
                      placeholder="Add a comment... 😊"
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                    />
                    <button
                      type="button"
                      className="emoji-btn"
                      onClick={() => setShowCommentEmoji(!showCommentEmoji)}
                    >
                      😀
                    </button>
                    {showCommentEmoji && (
                      <div className="emoji-picker" style={{ position: 'absolute', zIndex: 2000 }}>
                        <Picker
                          onSelect={emoji => setCommentText(commentText + emoji.native)}
                          title="Pick an emoji"
                          emoji="point_up"
                        />
                      </div>
                    )}
                    <button
                      className="post-btn"
                      onClick={() => handlePostComment(idx)}
                    >
                      Post
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button className="close-btn" onClick={() => setSelectedTrek(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="about-modal" onClick={e => e.stopPropagation()}>
            <img src={myPhoto} alt="Developer" className="about-modal-photo" />
            <div className="about-modal-content">
              <h2>About the Developer</h2>
              <p>
                Hi! I'm Hrushita Mulaokar, a third-year Electronics and Telecommunications Engineering student with a deep passion for nature, mountains, and meaningful adventures. When I'm not working on circuits or projects, you'll probably find me exploring trails, soaking in scenic views, or planning my next trek.
              </p>
              <p>
                Trek Advisor is a project close to my heart — born from a love for trekking and a desire to create a space where trekkers can share authentic, personal experiences. I believe that real stories from real people are the best guides for fellow adventurers.
              </p>
              <p>
                This is my first step into web development, and I'm excited to build something that connects the trekking community in a genuine and inspiring way.
              </p>
              <p>
                Connect with me on{' '}
                <a
                  href="https://www.linkedin.com/in/hrushita-mulaokar-813b122a1/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>.
              </p>
              <button className="close-btn" onClick={() => setShowAbout(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal (Login/Sign Up) */}
      {showAuth && (
        <div className="modal-overlay" onClick={() => setShowAuth(false)}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            {authError && <p style={{ color: 'red', marginBottom: '1rem' }}>{authError}</p>}
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const userData = {
                email: formData.get('email'),
                password: formData.get('password')
              };
              
              if (!isLogin) {
                userData.name = formData.get('name');
              }
              
              if (isLogin) {
                await handleLogin(userData);
              } else {
                await handleSignup(userData);
              }
            }}>
              {!isLogin && (
                <input type="text" name="name" placeholder="Name" required />
              )}
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit" className="auth-submit-btn">
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>
            <div style={{ marginBottom: '1rem' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text={isLogin ? 'continue_with' : 'signup_with'}
                shape="rectangular"
              />
            </div>
            {isLogin ? (
              <p className="switch-auth">
                Haven't signed up yet?{' '}
                <span onClick={() => setIsLogin(false)}>Sign up here.</span>
              </p>
            ) : (
              <p className="switch-auth">
                Already have an account?{' '}
                <span onClick={() => setIsLogin(true)}>Login here.</span>
              </p>
            )}
            <button className="close-btn" onClick={() => setShowAuth(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showAboutUs && (
        <div className="modal-overlay" onClick={() => setShowAboutUs(false)}>
          <div className="aboutus-modal" onClick={e => e.stopPropagation()}>
            <h2>About Trek Advisor</h2>
            <p>
              Trek Advisor is a platform for trekkers to share their real and candid experiences, upload photos, and help fellow adventurers discover the best trekking destinations. Our mission is to create a genuine community where stories, tips, and inspiration are shared by real people who love the mountains and the outdoors.
            </p>
            <button className="close-btn" onClick={() => setShowAboutUs(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;