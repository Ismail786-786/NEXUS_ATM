import React, { useState, useEffect } from 'react';

// Change this:
// const API_BASE = 'http://localhost:5000/api/atm';

// To this:
const API_BASE = 'https://your-backend-name.onrender.com/api/atm';;

// Web Audio API Sound Generator
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.setValueAtTime(140, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'print') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === 'eject') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    console.log('Audio autoplay prevented');
  }
};

const translations = {
  EN: {
    title: "NEXUS FINANCIAL SYSTEMS",
    auth: "Authenticate Card",
    accNum: "Account Number",
    pin: "Secure PIN",
    deposit: "Deposit Cash",
    withdraw: "Withdraw Cash",
    transfer: "Inter-Account Transfer",
    history: "Transaction History (LIFO)",
    diagnostics: "Hardware & Vault Diagnostics",
    helpDesk: "🤖 ATM Help Desk & Support",
    eject: "Eject Card",
    balance: "Available Balance",
  },
  TA: {
    title: "நிக்சஸ் நிதி அமைப்புகள்",
    auth: "அட்டை அங்கீகாரம்",
    accNum: "கணக்கு எண்",
    pin: "பாதுகாப்பான பின் எண்",
    deposit: "பணம் டெபாசிட்",
    withdraw: "பணம் பெறுதல்",
    transfer: "கணக்கு இடமாற்றம்",
    history: "பரிவர்த்தனை வரலாறு",
    diagnostics: "இயந்திர கண்டறிதல்",
    helpDesk: "🤖 உதவி மையம் & ஆதரவு",
    eject: "அட்டையை வெளியேற்று",
    balance: "கிடைக்கும் இருப்பு",
  },
  HI: {
    title: "नेक्सस वित्तीय प्रणालियाँ",
    auth: "कार्ड प्रमाणित करें",
    accNum: "खाता संख्या",
    pin: "सुरक्षित पिन",
    deposit: "नकद जमा करें",
    withdraw: "नकद निकासी",
    transfer: "फंड ट्रांसफर",
    history: "लेनदेन इतिहास",
    diagnostics: "एटीएम हार्डवेयर स्थिति",
    helpDesk: "🤖 सहायता केंद्र",
    eject: "कार्ड निकालें",
    balance: "उपलब्ध शेष राशि",
  }
};

export default function App() {
  const [lang, setLang] = useState('EN');
  const t = translations[lang];

  // Theme State: false = Light Theme (Default), true = Dark Theme
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [accountNumber, setAccountNumber] = useState('123456');
  const [pin, setPin] = useState('1234');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [holderName, setHolderName] = useState('');
  const [accountType, setAccountType] = useState('Savings');
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [receiptData, setReceiptData] = useState(null);
  const [dispenserNotes, setDispenserNotes] = useState(null);

  // Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Welcome to Nexus ATM Help Desk. How can I assist you with your banking transaction today?' }
  ]);

  // Dynamic Theme Classes
  const theme = {
    appBg: isDarkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900",
    cabinetBg: isDarkMode ? "bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-slate-700" : "bg-gradient-to-b from-slate-200 via-slate-100 to-white border-slate-300 shadow-2xl",
    headerBg: isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm",
    panelBg: isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm",
    inputBg: isDarkMode ? "bg-slate-900 border-slate-700 text-white focus:border-cyan-400" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600",
    textMuted: isDarkMode ? "text-slate-400" : "text-slate-600",
    textAccent: isDarkMode ? "text-cyan-400" : "text-cyan-600",
    buttonActive: isDarkMode ? "bg-cyan-500 text-slate-950 font-bold" : "bg-cyan-600 text-white font-bold shadow-md",
    buttonInactive: isDarkMode ? "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200",
    subBox: isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    playSound('click');
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber, pin })
      });
      const data = await res.json();
      if (data.success) {
        playSound('success');
        setIsLoggedIn(true);
        setBalance(data.balance);
        setHolderName(data.holderName);
        setAccountType(data.accountType);
        setMessage('');
        fetchHistory(accountNumber);
      } else {
        playSound('error');
        setMessage(data.message || 'Login failed.');
      }
    } catch (err) {
      playSound('error');
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

  const calculateDenominations = (val) => {
    let remaining = val;
    const n500 = Math.floor(remaining / 500); remaining %= 500;
    const n200 = Math.floor(remaining / 200); remaining %= 200;
    const n100 = Math.floor(remaining / 100); remaining %= 100;
    const n50 = Math.floor(remaining / 50);
    return { n500, n200, n100, n50 };
  };

  const handleTransaction = async (type) => {
    playSound('click');
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      playSound('error');
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
        playSound('success');
        setBalance(data.newBalance);
        
        if (type.toLowerCase() === 'withdraw') {
          setDispenserNotes(calculateDenominations(numAmount));
        }

        setReceiptData({
          type: type.toUpperCase(),
          amount: numAmount,
          balance: data.newBalance,
          date: new Date().toLocaleString(),
          txnId: 'TXN-' + Math.floor(100000 + Math.random() * 900000)
        });

        setAmount('');
        setMessage(`${type} successful! New Balance: ₹${data.newBalance}`);
        fetchHistory(accountNumber);
      } else {
        playSound('error');
        setMessage(data.message || 'Transaction failed.');
      }
    } catch (err) {
      playSound('error');
      setMessage('Transaction request failed.');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    playSound('click');
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !recipient) {
      playSound('error');
      setMessage('Please enter valid transfer details.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderAcc: accountNumber, recipientAcc: recipient, amount: numAmount })
      });
      const data = await res.json();
      if (data.success) {
        playSound('success');
        setBalance(data.newBalance);
        setReceiptData({
          type: 'FUND TRANSFER',
          amount: numAmount,
          recipient: recipient,
          balance: data.newBalance,
          date: new Date().toLocaleString(),
          txnId: 'TRF-' + Math.floor(100000 + Math.random() * 900000)
        });
        setAmount('');
        setRecipient('');
        setMessage(`Fund transfer of ₹${numAmount} successful!`);
        fetchHistory(accountNumber);
      } else {
        playSound('error');
        setMessage(data.message || 'Transfer failed.');
      }
    } catch (err) {
      playSound('error');
      setMessage('Transfer request failed.');
    }
  };

  const handleChangePin = async (e) => {
    e.preventDefault();
    playSound('click');
    try {
      const res = await fetch(`${API_BASE}/change-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber, oldPin, newPin })
      });
      const data = await res.json();
      if (data.success) {
        playSound('success');
        setMessage('PIN changed successfully.');
        setPin(newPin);
        setOldPin('');
        setNewPin('');
      } else {
        playSound('error');
        setMessage(data.message || 'PIN change failed.');
      }
    } catch (err) {
      playSound('error');
      setMessage('Server error during PIN change.');
    }
  };

  const handleSendChat = (queryText) => {
    const textToSend = queryText || chatInput;
    if (!textToSend.trim()) return;

    playSound('click');
    const newMessages = [...chatMessages, { sender: 'user', text: textToSend }];
    setChatMessages(newMessages);
    if (!queryText) setChatInput('');

    setTimeout(() => {
      let botReply = "I am your Nexus ATM Assistant. For specific account disputes, please contact branch support at 1800-NEXUS-BANK.";
      const query = textToSend.toLowerCase();

      if (query.includes('card stuck') || query.includes('stuck') || query.includes('swallowed')) {
        botReply = "⚠️ EMERGENCY: If your card is retained or stuck, press the Red 'Eject Card' button immediately and notify the security guard or call our 24/7 hotline.";
      } else if (query.includes('withdraw') || query.includes('cash')) {
        botReply = "To withdraw cash, go to the 'Cash Vault Operations' tab, enter your desired amount or select a quick preset, and click 'Withdraw Cash'.";
      } else if (query.includes('pin') || query.includes('password')) {
        botReply = "You can change your 4-digit Secure PIN anytime using the 'Change PIN Code' tab on the left navigation menu.";
      } else if (query.includes('balance') || query.includes('check')) {
        botReply = `Your current available balance is displayed at the top left of the terminal: ₹${balance.toFixed(2)}`;
      } else if (query.includes('deposit')) {
        botReply = "To deposit funds, insert cash into the intelligent deposit slot, enter the amount in the 'Cash Vault Operations' tab, and click 'Deposit Cash'.";
      } else if (query.includes('transfer')) {
        botReply = "Use the 'Inter-Account Transfer' tab to send funds instantly by providing the recipient account number and amount.";
      }

      playSound('success');
      setChatMessages([...newMessages, { sender: 'bot', text: botReply }]);
    }, 500);
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen ${theme.appBg} flex items-center justify-center p-4 font-sans transition-colors duration-300`}>
        {/* Physical Kiosk Machine Frame */}
        <div className={`border-8 ${theme.cabinetBg} p-8 rounded-3xl w-full max-w-md relative transition-colors duration-300`}>
          
          {/* Machine Header Branding Plate */}
          <div className={`${theme.headerBg} border px-4 py-2 rounded-lg mb-6 flex justify-between items-center`}>
            <div>
              <div className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">NCR / DIEBOLD KIOSK</div>
              <h1 className="text-sm font-black tracking-wider">NEXUS ATM TERMINAL</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Theme Toggle Button */}
              <button 
                onClick={() => { playSound('click'); setIsDarkMode(!isDarkMode); }}
                className="p-1.5 rounded-full border border-slate-400 text-xs hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                title="Toggle Theme"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Online"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" title="Vault Secure"></span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className={`text-xs uppercase ${theme.textMuted}`}>Card Insertion Required</span>
            <div className="flex gap-1">
              {['EN', 'TA', 'HI'].map((l) => (
                <button 
                  key={l} 
                  onClick={() => { playSound('click'); setLang(l); }}
                  className={`px-2 py-1 text-xs rounded border ${lang === l ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold' : 'border-slate-400 text-slate-500'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {message && <div className="mb-4 p-3 bg-red-950/50 border border-red-500 rounded text-red-200 text-sm">{message}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-xs uppercase ${theme.textMuted} mb-1`}>{t.accNum}</label>
              <input 
                type="text" 
                value={accountNumber} 
                onChange={(e) => setAccountNumber(e.target.value)}
                className={`w-full ${theme.inputBg} border rounded p-3 focus:outline-none font-mono`}
                required 
              />
            </div>
            <div>
              <label className={`block text-xs uppercase ${theme.textMuted} mb-1`}>{t.pin}</label>
              <input 
                type="password" 
                value={pin} 
                onChange={(e) => setPin(e.target.value)}
                className={`w-full ${theme.inputBg} border rounded p-3 focus:outline-none font-mono`}
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold py-3 rounded transition shadow-lg shadow-cyan-600/20"
            >
              {t.auth}
            </button>
          </form>

          <div className={`mt-8 pt-4 border-t border-slate-300 dark:border-slate-700 flex justify-between items-center text-[10px] ${theme.textMuted}`}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Card Reader Active</span>
            </div>
            <span className="font-mono">ID: #ATM-VLR-04</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.appBg} p-4 md:p-6 font-sans flex items-center justify-center transition-colors duration-300`}>
      {/* Heavy Industrial Kiosk Cabinet Outer Frame */}
      <div className={`w-full max-w-5xl border-8 ${theme.cabinetBg} rounded-3xl p-6 relative transition-colors duration-300`}>
        
        {/* Machine Top Bezel & Status Lights */}
        <div className={`${theme.headerBg} border px-6 py-3 rounded-xl mb-6 shadow-sm flex justify-between items-center`}>
          <div>
            <div className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">ENTERPRISE KIOSK CONSOLE</div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              {t.title} <span className={`text-xs ${theme.textMuted} font-normal font-mono`}>| ID: #ATM-VLR-04</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded border text-xs ${theme.subBox}`}>
              <span>Holder:</span><span className="text-cyan-500 font-medium">{holderName}</span>
            </div>
            
            {/* Theme Toggle Button */}
            <button 
              onClick={() => { playSound('click'); setIsDarkMode(!isDarkMode); }}
              className="p-2 rounded-full border border-slate-400 text-xs hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              title="Toggle Theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            <div className="flex gap-1">
              {['EN', 'TA', 'HI'].map((l) => (
                <button 
                  key={l} 
                  onClick={() => { playSound('click'); setLang(l); }}
                  className={`px-2.5 py-1 text-xs rounded border ${lang === l ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold' : 'border-slate-400 text-slate-500'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button 
              onClick={() => { playSound('eject'); setIsLoggedIn(false); }}
              className="bg-red-600/20 hover:bg-red-600 active:scale-95 border border-red-500 text-red-600 dark:text-red-300 px-4 py-2 rounded text-xs transition"
            >
              {t.eject}
            </button>
          </div>
        </div>

        {/* Recessed Machine Screen & Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Left Navigation Console */}
          <div className={`${theme.panelBg} p-6 rounded-2xl border-4 md:col-span-1 flex flex-col justify-between`}>
            <div>
              <span className={`text-[10px] uppercase ${theme.textMuted} tracking-wider font-mono`}>{t.balance}</span>
              <div className="text-2xl lg:text-3xl font-extrabold text-cyan-600 dark:text-cyan-300 mt-1 font-mono">
                ₹{balance.toFixed(2)}
              </div>
              <div className="mt-4 p-3 bg-cyan-950/20 border border-cyan-800/40 rounded text-xs text-cyan-700 dark:text-cyan-200">
                🔒 EMV Secure Chip Enabled
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {[
                { id: 'dashboard', label: 'Cash Vault Operations' },
                { id: 'transfer', label: t.transfer },
                { id: 'history', label: t.history },
                { id: 'diagnostics', label: t.diagnostics },
                { id: 'help', label: t.helpDesk },
                { id: 'security', label: 'Change PIN Code' }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => { playSound('click'); setActiveTab(tab.id); }} 
                  className={`w-full text-left px-4 py-2.5 rounded text-xs md:text-sm transition-all transform active:scale-98 ${activeTab === tab.id ? theme.buttonActive : theme.buttonInactive}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Central Monitor Screen */}
          <div className={`${theme.panelBg} p-6 rounded-2xl border-4 md:col-span-2 flex flex-col justify-between`}>
            {message && <div className="mb-4 p-3 bg-cyan-950/20 border border-cyan-500 rounded text-cyan-700 dark:text-cyan-200 text-sm">{message}</div>}

            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-slate-300 dark:border-slate-800 pb-2">Fast Cash Dispenser & Vault</h2>
                <div>
                  <label className={`block text-xs uppercase ${theme.textMuted} mb-1`}>Transaction Amount (₹)</label>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full ${theme.inputBg} border rounded p-3 focus:outline-none text-xl font-mono`}
                  />
                </div>
                <div>
                  <span className={`text-xs uppercase ${theme.textMuted} mb-2 block`}>Quick Withdrawal Presets</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 5000, 10000].map((val) => (
                      <button 
                        key={val} 
                        onClick={() => { playSound('click'); setAmount(val); }} 
                        className={`${theme.subBox} hover:opacity-80 active:scale-95 border py-2.5 rounded text-sm font-mono text-cyan-600 dark:text-cyan-300 shadow-sm`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                {dispenserNotes && (
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/50 rounded">
                    <span className="text-xs uppercase text-emerald-600 dark:text-emerald-400 font-bold block mb-2">💵 Mechanical Cash Dispenser Output</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className={`p-2 rounded border ${theme.subBox} font-mono`}>₹500 x {dispenserNotes.n500}</div>
                      <div className={`p-2 rounded border ${theme.subBox} font-mono`}>₹200 x {dispenserNotes.n200}</div>
                      <div className={`p-2 rounded border ${theme.subBox} font-mono`}>₹100 x {dispenserNotes.n100}</div>
                      <div className={`p-2 rounded border ${theme.subBox} font-mono`}>₹50 x {dispenserNotes.n50}</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button onClick={() => handleTransaction('deposit')} className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-3 rounded transition shadow-lg shadow-emerald-600/20">
                    {t.deposit}
                  </button>
                  <button onClick={() => handleTransaction('withdraw')} className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold py-3 rounded transition shadow-lg shadow-amber-600/20">
                    {t.withdraw}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'transfer' && (
              <form onSubmit={handleTransfer} className="space-y-4">
                <h2 className="text-lg font-bold border-b border-slate-300 dark:border-slate-800 pb-2">{t.transfer}</h2>
                <div>
                  <label className={`block text-xs uppercase ${theme.textMuted} mb-1`}>Recipient Account Number</label>
                  <input 
                    type="text" 
                    value={recipient} 
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="e.g. 987654"
                    className={`w-full ${theme.inputBg} border rounded p-3 focus:outline-none font-mono`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase ${theme.textMuted} mb-1`}>Transfer Amount (₹)</label>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full ${theme.inputBg} border rounded p-3 focus:outline-none text-xl font-mono`}
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold py-3 rounded transition shadow-lg shadow-cyan-600/20">
                  Execute Transfer
                </button>
              </form>
            )}

            {activeTab === 'history' && (
              <div>
                <h2 className="text-lg font-bold border-b border-slate-300 dark:border-slate-800 pb-2 mb-4">{t.history}</h2>
                {history.length === 0 ? (
                  <p className={`text-sm ${theme.textMuted}`}>No transactions recorded yet.</p>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                    {history.map((txn, index) => (
                      <div key={index} className={`${theme.subBox} border p-3 rounded flex justify-between items-center text-sm`}>
                        <div>
                          <div className="font-bold text-cyan-600 dark:text-cyan-400">{txn.type} - ₹{txn.amount}</div>
                          <div className={`text-xs ${theme.textMuted} font-mono`}>{txn.timestamp} | ID: {txn.transactionId}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs px-2 py-1 bg-emerald-950/20 border border-emerald-500 text-emerald-600 dark:text-emerald-300 rounded font-mono">{txn.status}</span>
                          <div className={`text-xs ${theme.textMuted} mt-1 font-mono`}>Bal: ₹{txn.balanceAfter}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'diagnostics' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-slate-300 dark:border-slate-800 pb-2">{t.diagnostics}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className={`${theme.subBox} p-4 rounded border`}>
                    <span className={`text-xs ${theme.textMuted} block`}>Cash Cassette A (₹500)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Optimal (84% Full)</span>
                  </div>
                  <div className={`${theme.subBox} p-4 rounded border`}>
                    <span className={`text-xs ${theme.textMuted} block`}>Cash Cassette B (₹100)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Optimal (62% Full)</span>
                  </div>
                  <div className={`${theme.subBox} p-4 rounded border`}>
                    <span className={`text-xs ${theme.textMuted} block`}>Thermal Receipt Printer</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Paper Roll Ready</span>
                  </div>
                  <div className={`${theme.subBox} p-4 rounded border`}>
                    <span className={`text-xs ${theme.textMuted} block`}>Encrypted PIN Pad (EPP)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tamper Secure</span>
                  </div>
                </div>
              </div>
            )}

            {/* ATM Virtual Help Desk Chatbot Tab */}
            {activeTab === 'help' && (
              <div className="flex flex-col h-80 justify-between space-y-3">
                <div className="flex justify-between items-center border-b border-slate-300 dark:border-slate-800 pb-2">
                  <h2 className="text-lg font-bold text-cyan-600 dark:text-cyan-400">🤖 Nexus Virtual ATM Kiosk Assistant</h2>
                  <span className="text-xs text-emerald-500 animate-pulse">● Online</span>
                </div>
                
                {/* Chat Message Scroll Window */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-cyan-600 text-white font-medium' : `${theme.subBox} border text-slate-800 dark:text-slate-200`}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Touch Suggestions */}
                <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
                  {['My card is stuck', 'How to withdraw?', 'Forgot my PIN?', 'Check balance'].map((chip) => (
                    <button 
                      key={chip} 
                      onClick={() => handleSendChat(chip)}
                      className={`whitespace-nowrap ${theme.subBox} border hover:border-cyan-500 text-cyan-600 dark:text-cyan-300 px-2.5 py-1 rounded transition`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="flex gap-2 pt-1">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="Ask about card issues, withdrawals, PIN..."
                    className={`flex-1 ${theme.inputBg} border rounded p-2 text-xs focus:outline-none`}
                  />
                  <button 
                    onClick={() => handleSendChat()}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded text-xs transition active:scale-95"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleChangePin} className="space-y-4">
                <h2 className="text-lg font-bold border-b border-slate-300 dark:border-slate-800 pb-2">Change Secure PIN</h2>
                <div>
                  <label className={`block text-xs uppercase ${theme.textMuted} mb-1`}>Current PIN</label>
                  <input 
                    type="password" 
                    value={oldPin} 
                    onChange={(e) => setOldPin(e.target.value)}
                    className={`w-full ${theme.inputBg} border rounded p-3 focus:outline-none font-mono`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase ${theme.textMuted} mb-1`}>New PIN (4 Digits)</label>
                  <input 
                    type="password" 
                    value={newPin} 
                    onChange={(e) => setNewPin(e.target.value)}
                    className={`w-full ${theme.inputBg} border rounded p-3 focus:outline-none font-mono`}
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold py-3 rounded transition shadow-lg shadow-cyan-600/20">
                  Update PIN Credentials
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Physical Machine Hardware Strip (Slots & Chutters) */}
        <div className={`${theme.headerBg} border p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs shadow-sm`}>
          <div className={`flex items-center gap-3 ${theme.subBox} p-3 rounded border`}>
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
            <div>
              <div className="font-bold">Motorized Card Reader</div>
              <div className={`text-[10px] ${theme.textMuted}`}>Insert Card with Chip Forward</div>
            </div>
          </div>
          <div className={`flex items-center gap-3 ${theme.subBox} p-3 rounded border`}>
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
            <div>
              <div className="font-bold">Cash Dispenser Shutter</div>
              <div className={`text-[10px] ${theme.textMuted}`}>Multi-Denominational Vault Active</div>
            </div>
          </div>
          <div className={`flex items-center gap-3 ${theme.subBox} p-3 rounded border`}>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div>
              <div className="font-bold">Thermal Receipt Slot</div>
              <div className={`text-[10px] ${theme.textMuted}`}>Auto-Cutter Operational</div>
            </div>
          </div>
        </div>

        {/* Simulated Thermal Receipt Modal Popup */}
        {receiptData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white text-slate-900 p-6 rounded shadow-2xl w-full max-w-sm font-mono relative border-t-8 border-slate-800">
              <div className="text-center pb-3 border-b border-dashed border-slate-400">
                <h3 className="font-black text-lg tracking-wider">NEXUS BANK ATM</h3>
                <p className="text-xs text-slate-600">Terminal #ATM-VLR-04</p>
                <p className="text-xs text-slate-600">{receiptData.date}</p>
              </div>
              <div className="py-4 space-y-2 text-xs">
                <div className="flex justify-between"><span>Txn ID:</span><span className="font-bold">{receiptData.txnId}</span></div>
                <div className="flex justify-between"><span>Acc No:</span><span>******{accountNumber.slice(-4)}</span></div>
                <div className="flex justify-between"><span>Type:</span><span className="font-bold">{receiptData.type}</span></div>
                <div className="flex justify-between"><span>Amount:</span><span className="font-bold">₹{receiptData.amount}</span></div>
                {receiptData.recipient && <div className="flex justify-between"><span>To Acc:</span><span>{receiptData.recipient}</span></div>}
                <div className="flex justify-between pt-2 border-t border-dashed border-slate-300 font-bold text-sm">
                  <span>Available Bal:</span><span>₹{receiptData.balance}</span>
                </div>
              </div>
              <div className="text-center pt-3 border-t border-dashed border-slate-400 text-[10px] text-slate-500">
                *** THANK YOU FOR BANKING WITH US ***
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => { playSound('print'); setReceiptData(null); }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded text-xs transition"
                >
                  Print & Collect Receipt
                </button>
                <button 
                  onClick={() => setReceiptData(null)}
                  className="px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 rounded text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}