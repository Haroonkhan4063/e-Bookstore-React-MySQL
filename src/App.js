import React, { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const [user, setUser] = useState(null); 
  const [isSignup, setIsSignup] = useState(false); 
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  const [books, setBooks] = useState([]); 
  const [cartItems, setCartItems] = useState([]); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [selectedBook, setSelectedBook] = useState(null); 

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: '', email: '', address: '', phone: '' }); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [addedBookId, setAddedBookId] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.log(err));
  }, []);

  const handleAuthChange = (e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value });

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    
    if (isSignup) {
        const pass = authForm.password;
        if (pass.length < 8) {
            return alert("Password must be at least 8 characters long!");
        }
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(pass)) {
            return alert("Password must contain at least one special character (e.g., !, @, #, $)");
        }
    }

    const endpoint = isSignup ? '/signup' : '/login';
    const bodyData = isSignup ? authForm : {email: authForm.email, password: authForm.password};

    fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "Success") {
            if(isSignup) {
                alert("Account Created! Please Login.");
                setIsSignup(false);
            } else {
                setUser(data.user);
                alert(`Welcome back, ${data.user.name}!`);
            }
        } else {
            alert("Server Response: " + JSON.stringify(data));
        }
    })
    .catch(err => alert("Network Error: " + err));
  };

  const addToCart = (book) => {
    const exist = cartItems.find((x) => x.id === book.id);
    if (exist) {
        setCartItems(cartItems.map((x) => x.id === book.id ? { ...exist, quantity: exist.quantity + 1 } : x));
    } else {
        setCartItems([...cartItems, { ...book, quantity: 1 }]);
    }
    setShowToast(true); setTimeout(() => setShowToast(false), 3000);
    setAddedBookId(book.id); setTimeout(() => setAddedBookId(null), 1000);
  };

  const increaseQty = (book) => {
      setCartItems(cartItems.map((x) => x.id === book.id ? { ...x, quantity: x.quantity + 1 } : x));
  };

  const decreaseQty = (book) => {
      if(book.quantity === 1) {
          removeFromCart(book.id);
      } else {
          setCartItems(cartItems.map((x) => x.id === book.id ? { ...x, quantity: x.quantity - 1 } : x));
      }
  };

  const removeFromCart = (id) => {
      setCartItems(cartItems.filter((x) => x.id !== id));
  };

  const toggleCart = () => {
      setIsCartOpen(!isCartOpen);
      setShowCheckoutForm(false); 
  };
  
  const calculateTotal = () => cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
  
  const handlePlaceOrder = (e) => {
      e.preventDefault();
      const orderData = {
          name: orderForm.name,
          email: orderForm.email,
          address: orderForm.address,
          phone: orderForm.phone,
          total: calculateTotal(),
          items: cartItems.map(item => `${item.title} (x${item.quantity})`) 
      };

      fetch('/api/place-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
      })
      .then(res => res.json())
      .then(data => {
          if(data.status === "Success") {
              alert(`Order Placed Successfully! Order ID: ${data.orderId}`);
              setCartItems([]); 
              setShowCheckoutForm(false);
              setIsCartOpen(false); 
              setOrderForm({ name: '', email: '', address: '', phone: '' }); 
          } else {
              alert("Order Failed: " + JSON.stringify(data));
          }
      })
      .catch(err => alert("Server Error"));
  };

  const handleCancelOrder = () => {
      setOrderForm({ name: '', email: '', address: '', phone: '' });
      setShowCheckoutForm(false);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = contactForm;
    if(!name || !email || !message) return alert("Please fill all fields!");
    alert(`Thank you, ${name}! Message sent.`);
    setContactForm({ name: '', email: '', message: '' });
  };

  const filteredBooks = Array.isArray(books) ? books.filter(book => {
    const cat = book.category || ''; 
    return (filter === 'All' || cat.toLowerCase() === filter.toLowerCase()) && 
           book.title.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  if (!user) {
    return (
      <div className="App login-container">
        <div className="bg-3d"><span></span><span></span><span></span><span></span></div>
        <div className="login-box fade-in-up">
            <div className="login-header"><i className="fas fa-book-open"></i> Books<span>World</span></div>
            <h2>{isSignup ? "Create Account" : "Login"}</h2>
            <form onSubmit={handleAuthSubmit}>
                {isSignup && <input type="text" name="name" placeholder="Full Name" onChange={handleAuthChange} required />}
                <input type="email" name="email" placeholder="Email Address" onChange={handleAuthChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleAuthChange} required />
                <button type="submit" className="hero-btn" style={{width:'100%', marginTop:'10px', borderRadius:'10px'}}>
                    {isSignup ? "Sign Up" : "Login"}
                </button>
            </form>
            <p style={{marginTop:'20px', color:'white', cursor:'pointer'}} onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="bg-3d"><span></span><span></span><span></span><span></span></div>
      <div id="toast" className={showToast ? "show" : ""}>Item Added to Cart! 🛒</div>

      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content fade-in-up" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setSelectedBook(null)}>&times;</span>
            <div className="modal-body">
              <div className="modal-img">
                <img src={selectedBook.image} alt={selectedBook.title} onError={(e)=>{e.target.src="https://via.placeholder.com/150"}} />
              </div>
              <div className="modal-details">
                <span className="category-tag">{selectedBook.category}</span>
                <h2>{selectedBook.title}</h2>
                <h4 className="author-name">By {selectedBook.author || "Unknown Author"}</h4>
                <div className="rating"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                <p className="modal-desc">{selectedBook.description || "No description available for this book."}</p>
                <h3 className="modal-price">${selectedBook.price}</h3>
                <button className="buy-btn" onClick={() => { addToCart(selectedBook); setSelectedBook(null); }}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
            {showCheckoutForm ? (
                <h3 onClick={() => setShowCheckoutForm(false)} style={{cursor:'pointer'}}>
                    <i className="fas fa-arrow-left"></i> Back
                </h3>
            ) : (
                <h3>Your Cart ({cartItems.length})</h3>
            )}
            <span className="close-cart" onClick={toggleCart}>&times;</span>
        </div>

        {showCheckoutForm ? (
            <div className="checkout-form-container fade-in-up">
                <h4>Billing Details</h4>
                <form onSubmit={handlePlaceOrder}>
                    <input type="text" placeholder="Full Name" required value={orderForm.name} onChange={(e)=>setOrderForm({...orderForm, name: e.target.value})} />
                    <input type="email" placeholder="Email Address" required value={orderForm.email} onChange={(e)=>setOrderForm({...orderForm, email: e.target.value})} />
                    <input type="text" placeholder="Complete Address" required value={orderForm.address} onChange={(e)=>setOrderForm({...orderForm, address: e.target.value})} />
                    <input type="text" placeholder="Phone Number" required value={orderForm.phone} onChange={(e)=>setOrderForm({...orderForm, phone: e.target.value})} />
                    <div className="order-summary">
                        <p><strong>Total Price:</strong> ${calculateTotal()}</p>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <button type="button" className="cancel-btn" onClick={handleCancelOrder}>Cancel</button>
                        <button type="submit" className="checkout-btn">Confirm Order</button>
                    </div>
                </form>
            </div>
        ) : (
            <>
                <div className="cart-items">
                {cartItems.length === 0 ? <p className="empty-msg">Your cart is empty.</p> : cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <img src={item.image} alt="thumb" onError={(e)=>{e.target.src="https://via.placeholder.com/50"}} />
                        <div className="item-details" style={{flex: 1}}>
                            <h4>{item.title}</h4>
                            <p>${item.price}</p>
                            <div className="qty-controls">
                                <button onClick={() => decreaseQty(item)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => increaseQty(item)}>+</button>
                            </div>
                        </div>
                        <i className="fas fa-trash-alt remove-btn" onClick={() => removeFromCart(item.id)}></i>
                    </div>
                ))}
                </div>
                <div className="cart-footer">
                <div className="total">Total: ${calculateTotal()}</div>
                <button className="checkout-btn" onClick={() => { if(cartItems.length === 0) alert("Cart is empty!"); else setShowCheckoutForm(true); }}>
                    Proceed to Checkout
                </button>
                </div>
            </>
        )}
      </div>

      <header>
        <div className="navbar">
          <a href="#home" className="logo"><i className="fas fa-book-open"></i> Books<span>World</span></a>
          <nav className="nav-links">
            <a href="#home">Home</a><a href="#shop">Collection</a><a href="#about">About</a><a href="#contact">Contact</a>
            <a href="#!" onClick={() => setUser(null)} style={{color:'#e74c3c', cursor:'pointer', fontWeight:'bold'}}>Logout <i className="fas fa-sign-out-alt"></i></a> 
          </nav>
          <div className="cart-icon" onClick={toggleCart}><i className="fas fa-shopping-cart"></i><span id="cart-count">{cartItems.length}</span></div>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-content fade-in-up">
          <h2>Welcome, {user.name}!</h2><p>Premium books collection.</p><a href="#shop" className="hero-btn">Browse Books</a>
        </div>
      </section>

      <section className="container" id="shop">
        <h2 className="section-title">Exclusive Collection</h2>
        <div className="controls fade-in-scroll">
          <div className="search-container"><i className="fas fa-search search-icon"></i><input type="text" className="search-input" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)}/></div>
          <div className="category-nav">{['All', 'Programming', 'Islamic', 'Sci-Fi'].map(cat => (<button key={cat} className={`pill-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>{cat}</button>))}</div>
        </div>
        {filteredBooks.length === 0 ? (<div className="no-results fade-in-scroll"><i className="fas fa-box-open"></i><h3>No Books Found!</h3></div>) : (
            <div className="book-grid">{filteredBooks.map((book) => (
                <div className="book-card fade-in-scroll" key={book.id}>
                {book.badge && <span className={`sale-badge ${book.badge === 'New' ? 'new' : ''}`}>{book.badge}</span>}
                <div className="image-box"><img src={book.image} alt={book.title} onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}/></div>
                <div className="details">
                    <span className="category-tag">{book.category}</span>
                    <h3>{book.title}</h3>
                    
                    <button className="view-btn" onClick={() => setSelectedBook(book)}><i className="fas fa-eye"></i> Quick View</button>

                    <p className="price">${book.price}</p>
                    <button className="buy-btn" onClick={() => addToCart(book)} style={{backgroundColor: addedBookId === book.id ? '#27ae60' : 'var(--primary)'}}>{addedBookId === book.id ? "Added ✔" : "Add to Cart"}</button>
                </div></div>))}
            </div>
        )}
      </section>

      <section className="info-section fade-in-scroll" id="about">
        <div className="container">
          <h2 className="section-title">Who We Are</h2>
          <div className="info-content">
            <div className="info-text">
              <h3>More Than Just a Bookstore</h3>
              <p>At <strong>Books World</strong>, we believe that every book holds a new adventure. We are dedicated to providing book lovers with a carefully curated selection of literature.</p>
              <br/>
              <p>Our mission is to make knowledge accessible with premium quality original prints and lightning-fast delivery across Pakistan.</p>
              <div style={{marginTop: '30px', display: 'flex', gap: '30px'}}>
                <span><i className="fas fa-check-circle fa-2x" style={{color:'var(--accent)'}}></i><br/>Original Prints</span>
                <span><i className="fas fa-shipping-fast fa-2x" style={{color:'var(--accent)'}}></i><br/>Fast Delivery</span>
                <span><i className="fas fa-headset fa-2x" style={{color:'var(--accent)'}}></i><br/>24/7 Support</span>
              </div>
            </div>
            <div className="image-box" style={{height: '400px', borderRadius:'20px', overflow:'hidden', boxShadow: 'var(--shadow)'}}>
                <img src="/images/Store.jpg" alt="Store" style={{width:'100%', height:'100%', objectFit:'cover'}} />
            </div>
          </div>
        </div>
      </section>

      <section className="container fade-in-scroll" id="contact" style={{marginBottom: '80px'}}>
        <h2 className="section-title">Let's Connect</h2>
        <div className="info-content">
          <div className="info-form">
            <form onSubmit={handleContactSubmit}>
              <input type="text" name="name" placeholder="Your Full Name" onChange={(e) => setContactForm({...contactForm, name: e.target.value})} required />
              <input type="email" name="email" placeholder="Email Address" onChange={(e) => setContactForm({...contactForm, email: e.target.value})} required />
              <textarea rows="5" name="message" placeholder="How can we help you today?" onChange={(e) => setContactForm({...contactForm, message: e.target.value})} required></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
          <div className="info-text">
            <h3>We're Here to Help!</h3>
            <p>Have a question about an order or need a book recommendation? We'd love to hear from you!</p>
            <br/>
            <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="contact-item" style={{textDecoration:'none', color:'inherit'}}>
                <i className="fab fa-whatsapp" style={{color: '#25D366', fontSize: '1.8rem'}}></i>
                <div><strong>WhatsApp Us:</strong><p>+92 300 1234567</p></div>
            </a>
            <a href="mailto:Sawansi@gmail.com" className="contact-item" style={{textDecoration:'none', color:'inherit'}}>
                <i className="fas fa-envelope" style={{color: 'var(--accent)', fontSize: '1.8rem'}}></i>
                <div><strong>Email Support:</strong><p>Sawansi@gmail.com</p></div>
            </a>
            <div className="contact-item">
                <i className="fas fa-map-marker-alt" style={{color: 'var(--primary)', fontSize: '1.8rem'}}></i>
                <div><strong>Visit Us:</strong><p>Main Market, Mianwali, Pakistan</p></div>
            </div>
          </div>
        </div>
      </section>

      <footer><p>&copy; 2025 Books World. All Rights Reserved.</p></footer>
    </div>
  );
}

export default App;
