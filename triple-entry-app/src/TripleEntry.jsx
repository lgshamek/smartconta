import { useState } from "react";
import { ethers } from "ethers";

// Dirección de tu contrato desplegado
const CONTRACT_ADDRESS = "0x096e4f31368AD1a19f3A6E603EbA58FE239D0767";

// ABI REAL con el método registros()
const ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "hash", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "parteA", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "parteB", "type": "address" }
    ],
    "name": "HashRegistrado",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "hash", "type": "bytes32" },
      { "indexed": false, "internalType": "address", "name": "parteA", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "parteB", "type": "address" }
    ],
    "name": "HashVerificado",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "hash", "type": "bytes32" }],
    "name": "estaVerificado",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "fecha", "type": "string" },
      { "internalType": "string", "name": "baseImponible", "type": "string" },
      { "internalType": "string", "name": "igv", "type": "string" },
      { "internalType": "string", "name": "montoTotal", "type": "string" },
      { "internalType": "string", "name": "moneda", "type": "string" },
      { "internalType": "string", "name": "nombreComprador", "type": "string" },
      { "internalType": "string", "name": "nombreVendedor", "type": "string" },
      { "internalType": "string", "name": "comprobante", "type": "string" }
    ],
    "name": "generarHash",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "hash", "type": "bytes32" },
      { "internalType": "address", "name": "counterparty", "type": "address" }
    ],
    "name": "registrarHash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "name": "registros",
    "outputs": [
      { "internalType": "bytes32", "name": "hash", "type": "bytes32" },
      { "internalType": "address", "name": "parteA", "type": "address" },
      { "internalType": "address", "name": "parteB", "type": "address" },
      { "internalType": "bool", "name": "verificado", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function TripleEntry() {
  const [hash, setHash] = useState("");
  const [estado, setEstado] = useState(" — ");


}
