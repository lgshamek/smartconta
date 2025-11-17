import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x096e4f31368AD1a19f3A6E603EbA58FE239D0767";

const ABI = [
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

export default function HashChecker() {
  const [hash, setHash] = useState("");
  const [estado, setEstado] = useState("");

  const verificarHash = async () => {
    if (!hash) {
      alert("Pega un hash válido");
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");

      const contrato = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        provider
      );

      const reg = await contrato.registros(hash);

      const parteA = reg.parteA;
      const parteB = reg.parteB;
      const verificado = reg.verificado;

      // 🟥 NO EXISTE
      if (parteA === ethers.ZeroAddress && parteB === ethers.ZeroAddress) {
        setEstado("🔴 NO EXISTE");
        return;
      }

      // 🟢 VALIDADO
      if (verificado === true) {
        setEstado("🟢 VALIDADO");
        return;
      }

      // 🟡 FALTA VALIDAR
      if (
        (parteA !== ethers.ZeroAddress && parteB === ethers.ZeroAddress) ||
        (parteA === ethers.ZeroAddress && parteB !== ethers.ZeroAddress)
      ) {
        setEstado("🟡 FALTA VALIDAR (solo una parte registró)");
        return;
      }

      // 🟠 DISCREPANCIA
      if (parteA !== ethers.ZeroAddress && parteB !== ethers.ZeroAddress) {
        setEstado("🟠 DISCREPANCIA (registraron distinto)");
        return;
      }

    } catch (error) {
      console.error(error);
      alert("Error consultando hash");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h2>🔍 Verificar Hash</h2>

      <input
        type="text"
        placeholder="Pega el hash aquí"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
        style={{
          width: "100%",
