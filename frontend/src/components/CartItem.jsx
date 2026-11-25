import React from 'react';
import { Plus, Minus } from 'lucide-react';

export default function CartItem({ item, onUpdateQty }) {
  const getBadgeColor = (user) => {
    switch (user) {
      case 'You': return 'bg-blue-100 text-blue-700';
      case 'Amit': return 'bg-green-100 text-green-700';
      case 'Priya': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-3">
      <div className="flex items-center gap-4">
        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
        <div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBadgeColor(item.addedBy)}`}>
            Added by {item.addedBy}
          </span>
          <h3 className="font-semibold text-gray-800 text-sm mt-1">{item.name}</h3>
          <p className="font-bold text-gray-900 mt-1">₹{item.price}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-green-50 border border-green-600 rounded-lg px-2 py-1">
        <button 
          onClick={() => onUpdateQty(item.id, -1)}
          className="text-green-700 hover:bg-green-100 p-1 rounded transition"
        >
          <Minus size={14} />
        </button>
        <span className="font-bold text-green-800 text-sm">{item.qty}</span>
        <button 
          onClick={() => onUpdateQty(item.id, 1)}
          className="text-green-700 hover:bg-green-100 p-1 rounded transition"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}