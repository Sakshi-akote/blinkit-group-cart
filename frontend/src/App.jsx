import React, { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState(null);
  const [usersList, setUsersList] = useState(['You', 'Amit', 'Priya']);
  const [currentUser, setCurrentUser] = useState('You');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [friendNameInput, setFriendNameInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // URL se ?user= read karke automatic active user set karne ke liye
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    if (userParam) {
      setUsersList(prev => prev.includes(userParam) ? prev : [...prev, userParam]);
      setCurrentUser(userParam);
    }
  }, []);

  const fetchData = () => {
    fetch('http://127.0.0.1:5000/api/cart')
      .then(res => res.json())
      .then(resData => {
        if (resData.cart) {
          setData(resData);
          const cartUsers = resData.cart.items.map(i => i.addedBy);
          setUsersList(prev => Array.from(new Set([...prev, ...cartUsers])));
        }
      })
      .catch(err => console.error("Error fetching cart:", err));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateQty = (itemId, change) => {
    fetch('http://127.0.0.1:5000/api/cart/update-qty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, change })
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) setData(prev => ({ ...prev, cart: resData.cart }));
      });
  };

  const handleAddFromCatalog = (productId, userAddingItem) => {
    fetch('http://127.0.0.1:5000/api/cart/add-from-catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, addedBy: userAddingItem })
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) setData(prev => ({ ...prev, cart: resData.cart }));
      });
  };

  const generateInviteLink = (name) => {
    const cleanName = name.trim() || 'Friend';
    const inviteUrl = `${window.location.origin}${window.location.pathname}?user=${encodeURIComponent(cleanName)}`;
    navigator.clipboard.writeText(inviteUrl);
    
    if (!usersList.includes(cleanName)) {
      setUsersList(prev => [...prev, cleanName]);
    }
    
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowInviteModal(false);
      setFriendNameInput('');
    }, 1500);
  };

  if (!data || !data.cart) {
    return <div className="p-10 text-center font-bold text-gray-700">Loading Blinkit Store...</div>;
  }

  const { cart, catalog = [] } = data;
  const items = cart.items || [];

  const itemsTotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const handlingCharge = items.length > 0 ? (cart.handlingCharge ?? 5) : 0;
  const deliveryCharge = items.length > 0 ? (cart.deliveryCharge ?? 0) : 0;
  const extraCharges = handlingCharge + deliveryCharge;
  const grandTotal = itemsTotal + extraCharges;

  const rawUserShares = items.reduce((acc, item) => {
    acc[item.addedBy] = (acc[item.addedBy] || 0) + (item.price * item.qty);
    return acc;
  }, {});

  const activeOrderingUsers = Object.keys(rawUserShares);
  const perUserExtraCharge = activeOrderingUsers.length > 0 
    ? extraCharges / activeOrderingUsers.length 
    : 0;

  const userShares = Object.entries(rawUserShares).reduce((acc, [user, itemAmount]) => {
    acc[user] = Number((itemAmount + perUserExtraCharge).toFixed(2));
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <span className="text-yellow-400 font-extrabold text-2xl tracking-tight">blinkit</span>
          <div>
            <h1 className="font-bold text-gray-800">Roommates Weekend Party 🥳</h1>
            <p className="text-xs text-gray-500">Delivery to: Flat 402, Sunshine Apartments</p>
          </div>
        </div>

        {/* User Switcher */}
        <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-lg border border-gray-200">
          <span className="text-xs font-semibold text-gray-600 pl-2">Active User:</span>
          {usersList.map(user => (
            <button
              key={user}
              onClick={() => setCurrentUser(user)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                currentUser === user ? 'bg-green-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {user}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setShowInviteModal(true)} 
          className="bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-4 py-2 rounded-lg transition whitespace-nowrap"
        >
          + Invite Friend
        </button>
      </header>

      {/* Invite Friend Dynamic Modal Popup */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
            <h3 className="font-bold text-gray-800 text-base mb-1">Invite a Friend to Cart</h3>
            <p className="text-xs text-gray-500 mb-4">Enter your friend's name to generate a personalized join link.</p>
            
            <input 
              type="text" 
              placeholder="Enter Friend's Name (e.g. Rahul, Sneha)" 
              value={friendNameInput}
              onChange={(e) => setFriendNameInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm mb-4 focus:outline-none focus:border-green-600"
            />

            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-xs text-gray-600 font-semibold px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => generateInviteLink(friendNameInput)}
                disabled={!friendNameInput.trim()}
                className="bg-green-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-800 transition"
              >
                {copied ? "Link Copied!" : "Copy Invite Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Placed Confirmation Popup */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-center">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
              🎉
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg">Order Placed Successfully!</h3>
            <p className="text-xs text-gray-500 mt-1">
              Delivering to <b className="text-gray-700">Flat 402, Sunshine Apartments</b> in ~10 mins.
            </p>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 my-4 text-left">
              <div className="flex justify-between text-xs font-bold text-gray-800 pb-2 mb-2 border-b border-gray-200">
                <span>Total Paid</span>
                <span className="text-green-700 text-sm">₹{grandTotal}</span>
              </div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Split Breakdown
              </p>
              {Object.entries(userShares).map(([user, amount]) => (
                <div key={user} className="flex justify-between text-xs py-0.5">
                  <span className="text-gray-700 font-medium">{user}</span>
                  <span className="font-bold text-gray-900">₹{amount}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowOrderModal(false)}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold text-sm py-2.5 rounded-xl transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          
          {/* Store Catalog */}
          {catalog && catalog.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 mb-8 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 mb-3">
                Store Catalog <span className="text-xs font-normal text-gray-500">(Ordering as: <b className="text-green-700">{currentUser}</b>)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catalog.map(prod => (
                  <div key={prod.id} className="flex items-center justify-between gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3 min-w-0">
                      {prod.image && (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-white shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{prod.name}</p>
                        <p className="text-xs font-semibold text-gray-500">₹{prod.price}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddFromCatalog(prod.id, currentUser)}
                      className="bg-white border border-green-600 text-green-700 hover:bg-green-50 text-xs font-bold px-3 py-1.5 rounded-lg transition shrink-0 whitespace-nowrap"
                    >
                      + ADD
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shared Cart Items */}
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Shared Cart Items ({items.length})
          </h2>

          {items.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center my-4">
              <p className="font-bold text-gray-700">Cart is empty!</p>
              <p className="text-xs text-gray-500 mt-1">Select items from store catalog above to build your shared cart.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 mb-3 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-white shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                      Added by {item.addedBy}
                    </span>
                    <p className="font-bold text-gray-800 text-sm mt-1 truncate">{item.name}</p>
                    <p className="text-xs font-semibold text-gray-600">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 shrink-0">
                  <button onClick={() => handleUpdateQty(item.id, -1)} className="text-gray-600 font-bold px-1.5">-</button>
                  <span className="text-xs font-bold text-gray-800">{item.qty}</span>
                  <button onClick={() => handleUpdateQty(item.id, 1)} className="text-gray-600 font-bold px-1.5">+</button>
                </div>
              </div>
            ))
          )}

        </div>

        {/* Bill Split Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">Bill Split Summary</h2>
            
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between"><span>Items Total</span><span className="font-bold">₹{itemsTotal}</span></div>
              <div className="flex justify-between"><span>Delivery Charge</span><span className="text-green-600 font-bold">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
              <div className="flex justify-between"><span>Handling Charge</span><span className="font-bold">₹{handlingCharge}</span></div>
            </div>

            <div className="border-t my-4 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-800">Grand Total</span>
              <span className="font-extrabold text-lg text-gray-900">₹{grandTotal}</span>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 my-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Individual Shares</p>
                {activeOrderingUsers.length > 0 && extraCharges > 0 && (
                  <span className="text-[10px] text-green-700 font-medium">
                    (incl. ₹{Number(perUserExtraCharge.toFixed(2))}/person charge)
                  </span>
                )}
              </div>

              {Object.keys(userShares).length === 0 ? (
                <p className="text-xs text-gray-400">No items in cart</p>
              ) : (
                Object.entries(userShares).map(([user, amount]) => (
                  <div key={user} className="flex justify-between text-xs py-1">
                    <div>
                      <span className="font-semibold text-gray-700">{user}</span>
                      <span className="text-[10px] text-gray-400 ml-1.5">
                        (₹{rawUserShares[user]} + ₹{Number(perUserExtraCharge.toFixed(2))})
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">₹{amount}</span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => items.length > 0 && setShowOrderModal(true)}
              disabled={items.length === 0}
              className="w-full bg-green-700 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-xl hover:bg-green-800 transition"
            >
              Proceed to Pay (₹{grandTotal})
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}