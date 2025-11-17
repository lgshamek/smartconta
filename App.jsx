import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contratoABI from "./TripleEntrySimplificado.json";
import "./App.css";

const contractAddress = "0x096e4f31368AD1a19f3A6E603EbA58FE239D0767";

export default function App() {
  const [account, setAccount] = useState("");
  const [hash, setHash] = useState("");
  const [estadoHash, setEstadoHash] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [historial, setHistorial] = useState([]);

  const [fields, setFields] = useState({
    Fecha: "",
    BaseImponible: "",
    IGV: "",
    MontoTotal: "",
    Moneda: "PEN",
    Comprador: "",
    Vendedor: "",
    Comprobante: "",
  });

  const setField = (k, v) => setFields((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {
    const data = localStorage.getItem("historialHashes");
    if (data) setHistorial(JSON.parse(data));
  }, []);

  const guardarHistorial = (nuevo) => {
    localStorage.setItem("historialHashes", JSON.stringify(nuevo));
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask no detectada");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
  };

  const generarHash = () => {
    const texto = Object.values(fields).join("|");
    const h = ethers.keccak256(ethers.toUtf8Bytes(texto));
    setHash(h);
    setEstadoHash("");

    const nuevoRegistro = {
      hash: h,
      fecha: new Date().toLocaleString(),
      estado: "GENERADO",
    };

    const nuevoHistorial = [...historial, nuevoRegistro];
    setHistorial(nuevoHistorial);
    guardarHistorial(nuevoHistorial);
  };

  const registrarHash = async () => {
    if (!hash || !counterparty) return alert("Completa hash y contraparte");
    if (!window.ethereum) return alert("MetaMask no detectada");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contrato = new ethers.Contract(contractAddress, contratoABI, signer);

      const tx = await contrato.registrarHash(hash, counterparty);
      alert("Transacción enviada: " + tx.hash);
      await tx.wait();

      alert("Hash registrado correctamente");

      const nuevoHistorial = historial.map((hObj) =>
        hObj.hash === hash ? { ...hObj, estado: "REGISTRADO ONCHAIN" } : hObj
      );

      setHistorial(nuevoHistorial);
      guardarHistorial(nuevoHistorial);
    } catch (err) {
      alert("Error registrando hash: " + err.message);
    }
  };

  const verificarHash = async () => {
    if (!hash) return alert("Pega un hash");

    try {
      const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
      const contrato = new ethers.Contract(contractAddress, contratoABI, provider);

      const r = await contrato.registros(hash);

      const parteA = r.parteA;
      const parteB = r.parteB;
      const verificado = r.verificado;

      let estado = "";

      if (parteA === ethers.ZeroAddress && parteB === ethers.ZeroAddress) {
        estado = "NO EXISTE";
      } else if (verificado) {
        estado = "VALIDADO";
      } else if (
        (parteA !== ethers.ZeroAddress && parteB === ethers.ZeroAddress) ||
        (parteA === ethers.ZeroAddress && parteB !== ethers.ZeroAddress)
      ) {
        estado = "FALTA VALIDAR";
      } else {
        estado = "DISCREPANCIA";
      }

      setEstadoHash(estado);

      const nuevoHistorial = historial.map((hObj) =>
        hObj.hash === hash ? { ...hObj, estado } : hObj
      );

      setHistorial(nuevoHistorial);
      guardarHistorial(nuevoHistorial);
    } catch (err) {
      alert("Error verificando hash");
    }
  };

  return (
    <div className="app-container">
      <div className="main-card">
        <h1 className="title">SmartConta Pro</h1>

        <button className="btn-wallet" onClick={connectWallet}>
          {account
            ? `Conectada: ${account.slice(0, 6)}…${account.slice(-4)}`
            : "Conectar Wallet"}
        </button>

        <h2 className="section-title">Generar Hash</h2>
        {Object.keys(fields).map((k) => (
          <div className="input-group" key={k}>
            <label>{k}</label>
            <input
              type="text"
              placeholder={k}
              value={fields[k]}
              onChange={(e) => setField(k, e.target.value)}
            />
          </div>
        ))}

        <button className="btn-primary" onClick={generarHash}>
          Generar Hash
        </button>

        {hash && (
          <div className="hash-box">
            <strong>Hash generado:</strong>
            <p>{hash}</p>
          </div>
        )}

        <h2 className="section-title">Registrar Hash</h2>
        <input
          className="input-full"
          placeholder="Dirección contraparte"
          value={counterparty}
          onChange={(e) => setCounterparty(e.target.value)}
        />
        <button className="btn-secondary" onClick={registrarHash}>
          Registrar
        </button>

        <h2 className="section-title">Verificar Hash</h2>
        <input
          className="input-full"
          placeholder="Pega un hash"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
        />
        <button className="btn-search" onClick={verificarHash}>
          Verificar
        </button>

        {estadoHash && (
          <p className={`estado estado-${estadoHash.replace(/ /g, "")}`}>
            Estado: {estadoHash}
          </p>
        )}
      </div>

      <div className="history-panel">
        <h2>Historial</h2>

        {historial.length === 0 && (
          <p className="no-history">Sin registros aún</p>
        )}

        {historial.map((h, i) => (
          <div key={i} className="history-item">
            <p><strong>Hash:</strong> {h.hash}</p>
            <p><strong>Fecha:</strong> {h.fecha}</p>
            <p><strong>Estado:</strong> {h.estado}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
