import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.css";
import iphone14 from "./assets/img/iphone14.jpg";
import iphone15promax from "./assets/img/iphone15promax.jpg";
import galaxys24ultra from "./assets/img/galaxys24ultra.jpg";
import galaxyzflip5 from "./assets/img/galaxyzflip5.jpg";
import galaxyzfold5 from "./assets/img/galaxyzfold5.jpg";
import vertu from "./assets/img/vertu.jpg";
// ********************************************************************
const WEI_TO_ETH = "000000000000000000";
const CONTRACT_ADDRESS = "0x3336598bd909d11D3b86DA059465613Ce4D42e17";
const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "LogNewAlert",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "transactionList",
    outputs: [
      {
        internalType: "string",
        name: "smartphone_id",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "smartphone_price",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "string",
        name: "trans_type",
        type: "string",
      },
      {
        internalType: "string",
        name: "trans_time",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_id",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_transType",
        type: "string",
      },
      {
        internalType: "string",
        name: "_transTime",
        type: "string",
      },
    ],
    name: "executeTransaction",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [],
    name: "getTransactionLen",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];
const smartphoneList = [
  {
    id: "iphone14",
    name: "iPhone 14",
    img: iphone14,
    price: "1",
  },
  {
    id: "iphone15promax",
    name: "iPhone 15 Pro Max",
    img: iphone15promax,
    price: "2",
  },
  {
    id: "galaxys24ultra",
    name: "Galaxy S24 Ultra",
    img: galaxys24ultra,
    price: "1",
  },
  {
    id: "galaxyzflip5",
    name: "Galaxy Z-Flip 5",
    img: galaxyzflip5,
    price: "3",
  },
  {
    id: "galaxyzfold5",
    name: "Galaxy Z-Fold 5",
    img: galaxyzfold5,
    price: "4",
  },
  {
    id: "vertu",
    name: "Vertu",
    img: vertu,
    price: "10",
  },
];
// ********************************************************************
const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
const accountEl = document.getElementById("account");
const smartphoneListEl = document.getElementById("smartphoneList");
const boughtListEl = document.getElementById("boughtList");
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
let account;
// ********************************************************************
const createElementFromString = (string) => {
  const el = document.createElement("div");
  el.innerHTML = string;
  return el.firstChild;
};

const buySmartphone = async (smartphone) => {
  let time = new Date().toLocaleDateString("vi-VN");
  let priceStr = smartphone.price + WEI_TO_ETH;
  await contract.methods
    .executeTransaction(smartphone.id, smartphone.price, "buy", time)
    .send({ from: account, value: priceStr });
  displayBoughtList();
};

const displaySmartphoneList = async () => {
  smartphoneListEl.innerHTML = "";
  let index = 0;
  for (let sp of smartphoneList) {
    let btnId = "buyBtn" + index;
    const spEl = createElementFromString(
      `<div class="p-2">
        <div class="ticket card p-2 border border-primary border-2" style="width: 18rem;">
          <img src="${sp.img}" class="card-img-top p-2 border border-1 border-info rounded" alt="...">
          <div class="card-body">
            <h5 class="card-title">${sp.name}</h5>
            <p class="card-text">${sp.price} ETH</p>
            <button id="${btnId}" class="btn btn-primary">Buy Smartphone</button>
          </div>
        </div>
      </div>`
    );
    // spEl.onclick = buySmartphone.bind(null, sp);
    // document.getElementById(btnId).onclick = buySmartphone.bind(null, sp);
    smartphoneListEl.appendChild(spEl);
    document
      .getElementById(btnId)
      .addEventListener("click", buySmartphone.bind(null, sp));
    index++;
  }
};

const displayBoughtList = async () => {
  const boughtListLen = await contract.methods.getTransactionLen().call();
  const boughtList = [];
  for (let i = 0; i < boughtListLen; i++) {
    const bought = await contract.methods.transactionList(i).call();
    boughtList.push(bought);
  }

  boughtListEl.innerHTML = "";
  for (let trans of boughtList) {
    const transEl = createElementFromString(
      `<div class="p-2">
          <div class="bg-light rounded p-2">
            <h3 class="text-info">${trans.smartphone_id}</h5>
            <h5 class="text-secondary">${trans.smartphone_price} ETH</h5>
            <h5 class="text-secondary">${trans.trans_time}</h5>
          </div>
      </div>`
    );
    boughtListEl.appendChild(transEl);
  }
};

const main = async () => {
  const accounts = await web3.eth.requestAccounts();
  account = accounts[0];
  accountEl.innerText = account;
  await displaySmartphoneList();
  await displayBoughtList();
};

main();
