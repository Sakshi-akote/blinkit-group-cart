import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

export default function AddItemForm({ onAddItem }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [addedBy, setAddedBy] = useState('You');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;
    onAddItem({ name, price, addedBy });
    setName('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-gray-100 mb-6 shadow-sm">
      <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
        <PlusCircle size={16} className="text-green-600" /> Add New Item to Shared Cart
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input 
          type="text" 
          placeholder="Item Name (e.g. Kurkure)" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-green-600"
        />
        <input 
          type="number" 
          placeholder="Price (₹)" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)}
          className="border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-green-600"
        />
        <select 
          value={addedBy} 
          onChange={(e) => setAddedBy(e.target.value)}
          className="border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-green-600 bg-white"
        >
          <option value="You">You</option>
          <option value="Amit">Amit</option>
          <option value="Priya">Priya</option>
        </select>
      </div>
      <button 
        type="submit" 
        className="mt-3 w-full bg-green-700 hover:bg-green-800 text-white font-semibold text-xs py-2.5 rounded-lg transition"
      >
        Add Item
      </button>
    </form>
  );
}