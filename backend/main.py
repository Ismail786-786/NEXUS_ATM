from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

# Enable CORS so your GitHub Pages frontend can communicate with Render backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin (ideal for public testing)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database simulation for ATM accounts
accounts_db = {
    "123456": {
        "pin": "1234",
        "holderName": "Mohammed Ismail",
        "accountType": "Savings",
        "balance": 25400.00,
        "history": [
            {
                "type": "DEPOSIT",
                "amount": 5000,
                "balanceAfter": 25400.00,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "transactionId": "TXN-948102",
                "status": "SUCCESS"
            }
        ]
    }
}

class LoginRequest(BaseModel):
    accountNumber: str
    pin: str

class TransactionRequest(BaseModel):
    accountNumber: str
    amount: float

class TransferRequest(BaseModel):
    senderAcc: str
    recipientAcc: str
    amount: float

class PinChangeRequest(BaseModel):
    accountNumber: str
    oldPin: str
    newPin: str

@app.post("/api/atm/login")
def login(req: LoginRequest):
    acc = accounts_db.get(req.accountNumber)
    if not acc or acc["pin"] != req.pin:
        return {"success": False, "message": "Invalid Account Number or Secure PIN."}
    return {
        "success": True,
        "balance": acc["balance"],
        "holderName": acc["holderName"],
        "accountType": acc["accountType"]
    }

@app.get("/api/atm/history/{acc_num}")
def get_history(acc_num: str):
    acc = accounts_db.get(acc_num)
    if not acc:
        return []
    return acc["history"]

@app.post("/api/atm/deposit")
def deposit(req: TransactionRequest):
    acc = accounts_db.get(req.accountNumber)
    if not acc:
        return {"success": False, "message": "Account not found."}
    if req.amount <= 0:
        return {"success": False, "message": "Invalid deposit amount."}
    
    acc["balance"] += req.amount
    txn = {
        "type": "DEPOSIT",
        "amount": req.amount,
        "balanceAfter": acc["balance"],
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "transactionId": "TXN-" + str(int(datetime.now().timestamp()))[-6:],
        "status": "SUCCESS"
    }
    acc["history"].insert(0, txn)
    return {"success": True, "newBalance": acc["balance"]}

@app.post("/api/atm/withdraw")
def withdraw(req: TransactionRequest):
    acc = accounts_db.get(req.accountNumber)
    if not acc:
        return {"success": False, "message": "Account not found."}
    if req.amount <= 0 or req.amount > acc["balance"]:
        return {"success": False, "message": "Insufficient funds or invalid amount."}
    
    acc["balance"] -= req.amount
    txn = {
        "type": "WITHDRAW",
        "amount": req.amount,
        "balanceAfter": acc["balance"],
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "transactionId": "TXN-" + str(int(datetime.now().timestamp()))[-6:],
        "status": "SUCCESS"
    }
    acc["history"].insert(0, txn)
    return {"success": True, "newBalance": acc["balance"]}

@app.post("/api/atm/transfer")
def transfer(req: TransferRequest):
    sender = accounts_db.get(req.senderAcc)
    recipient = accounts_db.get(req.recipientAcc)
    
    if not sender:
        return {"success": False, "message": "Sender account not found."}
    if not recipient:
        return {"success": False, "message": "Recipient account not found."}
    if req.amount <= 0 or req.amount > sender["balance"]:
        return {"success": False, "message": "Insufficient funds for transfer."}
    
    sender["balance"] -= req.amount
    recipient["balance"] += req.amount
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    tx_id = "TRF-" + str(int(datetime.now().timestamp()))[-6:]
    
    sender["history"].insert(0, {
        "type": f"TRANSFER TO {req.recipientAcc}",
        "amount": req.amount,
        "balanceAfter": sender["balance"],
        "timestamp": timestamp,
        "transactionId": tx_id,
        "status": "SUCCESS"
    })
    
    recipient["history"].insert(0, {
        "type": f"TRANSFER FROM {req.senderAcc}",
        "amount": req.amount,
        "balanceAfter": recipient["balance"],
        "timestamp": timestamp,
        "transactionId": tx_id,
        "status": "SUCCESS"
    })
    
    return {"success": True, "newBalance": sender["balance"]}

@app.post("/api/atm/change-pin")
def change_pin(req: PinChangeRequest):
    acc = accounts_db.get(req.accountNumber)
    if not acc or acc["pin"] != req.oldPin:
        return {"success": False, "message": "Incorrect current PIN."}
    if len(req.newPin) != 4 or not req.newPin.isdigit():
        return {"success": False, "message": "New PIN must be 4 digits."}
    
    acc["pin"] = req.newPin
    return {"success": True, "message": "PIN changed successfully."}