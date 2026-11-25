import React from 'react';

export default function BillSummary({ cart }) {
  const { items, deliveryCharge, handlingCharge } = cart;

  let itemsTotal = 0;
  const userTotals = {};

  items.forEach(item => {
    const total = item.price * item.qty;
    itemsTotal += total;
    userTotals[item.addedBy] = (userTotals[item.addedBy] || 0) + total;
  });

  const grandTotal = itemsTotal + deliveryCharge + handlingCharge;
  const extraCharges = deliveryCharge + handlingCharge;

  const individualShares = {};
  for (const user in userTotals) {
    if (itemsTotal > 0) {
      const feeShare = (userTotals[user] / itemsTotal) * extraCharges;
      individualShares[user] = Math.round(userTotals[user] + feeShare);
    } else {
      individualShares[user] = 0;
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Bill Split Summary</h2>
      
      <div className="space-y-2 text-sm text-gray-600 pb-4 border-b border-gray-100">
        <div className="flex justify-between">
          <span>Items Total</span>
          <span className="font-semibold text-gray-800">₹{itemsTotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Charge</span>
          <span className="text-green-600 font-semibold">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
        </div>
        <div className="flex justify-between">
          <span>Handling Charge</span>
          <span className="font-semibold text-gray-800">₹{handlingCharge}</span>
        </div>
      </div>

      <div className="flex justify-between items-center py-4 text-lg font-bold text-gray-900 border-b border-gray-100">
        <span>Grand Total</span>
        <span>₹{grandTotal}</span>
      </div>

      <div className="py-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Individual Shares</h3>
        <div className="space-y-2 text-sm">
          {Object.entries(individualShares).map(([user, share]) => (
            <div key={user} className="flex justify-between text-gray-700">
              <span>{user}</span>
              <span className="font-bold text-gray-900">₹{share}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition duration-200 mt-2">
        Proceed to Pay (₹{grandTotal})
      </button>
    </div>
  );
}