import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api/atm';

export default function App() {
  const [accountNumber, setAccountNumber] = useState('123456');
  const [pin, setPin] = useState('1234');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber, pin })
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        setBalance(data.balance);
        setMessage('');
        fetchHistory(accountNumber);
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (err) {
      setMessage('Server connection error.');
    }
  };

  const fetchHistory = async (accNum) => {
    try {
      const res = await fetch(`${API_BASE}/history/${accNum}`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleTransaction = async (type) => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${type.toLowerCase()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber, amount: numAmount })
      });
      const data = await res.json();
      if (data.success) {
        setBalance(data.newBalance);
        setAmount('');
        setMessage(`${type} successful! New Balance: Rs.${data.newBalance}`);
        fetchHistory(accountNumber);
      } else {
        setMessage(data.message || 'Transaction failed.');
      }
    } catch (err) {
      setMessage('Transaction request failed.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black tracking-wider text-cyan-400">NEXUS ATM</h1>
            <p className="text-slate-400 text-sm">Secure Banking Simulation</p>
          </div>
          {message && <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">{message}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">Account Number</label>
              <input 
                type="text" 
                value={accountNumber} 
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
                required 
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">PIN Number</label>
              <input 
                type="password" 
                value={pin} 
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
                required 
              />
            </div>
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded transition">
              Authenticate Card
            </button>
          </form>
          <div className="mt-4 text-center text-xs text-slate-500">Default Test: Account #123456 | PIN: 1234</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-6">
          <div>
            <h1 className="text-xl font-bold text-cyan-400">NEXUS ATM TERMINAL</h1>
            <p className="text-slate-400 text-sm">Account: {accountNumber}</p>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="bg-red-600/20 hover:bg-red-600 border border-red-500 text-red-300 px-4 py-2 rounded text-sm transition"
          >
            Eject Card
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 md:col-span-1 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase text-slate-400">Available Balance</span>
              <div className="text-3xl font-extrabold text-cyan-300 mt-1">Rs. {balance.toLocaleString()}</div>
            </div>
            <div className="mt-6 space-y-2">
              <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-2 rounded transition ${activeTab === 'dashboard' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-slate-700'}`}>Fast Transactions</button>
              <button onClick={() => setActiveTab('history')} className={`w-full text-left px-4 py-2 rounded transition ${activeTab === 'history' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-slate-700'}`}>Transaction Stack (LIFO)</button>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 md:col-span-2">
            {message && <div className="mb-4 p-3 bg-slate-900 border border-cyan-500 rounded text-cyan-200 text-sm">{message}</div>}

            {activeTab === 'dashboard' ? (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-slate-700 pb-2">ATM Operations</h2>
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Enter Amount (Rs.)</label>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-cyan-400 text-xl font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button onClick={() => handleTransaction('deposit')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded transition">
                    Deposit Cash
                  </button>
                  <button onClick={() => handleTransaction('withdraw')} className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded transition">
                    Withdraw Cash
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold border-b border-slate-700 pb-2 mb-4">Transaction History Stack (LIFO)</h2>
                {history.length === 0 ? (
                  <p className="text-slate-400 text-sm">No transactions recorded yet.</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {history.map((txn, index) => (
                      <div key={index} className="bg-slate-900 border border-slate-700 p-3 rounded flex justify-between items-center text-sm">
                        <div>
                          <div className="font-bold text-cyan-400">{txn.type} - Rs. {txn.amount}</div>
                          <div className="text-xs text-slate-400">{txn.timestamp} | ID: {txn.transactionId}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs px-2 py-1 bg-emerald-900/50 border border-emerald-500 text-emerald-300 rounded">SUCCESS</span>
                          <div className="text-xs text-slate-400 mt-1">Bal: Rs.{txn.balanceAfter}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}