// MuxSim: TDM + FDM + WDM + CDM Simulation (Frontend Only)
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function App() {
  const [mode, setMode] = useState("TDM");
  const [inputA, setInputA] = useState("1010");
  const [inputB, setInputB] = useState("1100");
  const [output, setOutput] = useState([]);

  const simulateTDM = () => {
    const bitsA = inputA.split("");
    const bitsB = inputB.split("");
    const maxLength = Math.max(bitsA.length, bitsB.length);
    let result = [];

    for (let i = 0; i < maxLength; i++) {
      if (i < bitsA.length) result.push({ time: i * 2, value: bitsA[i] });
      if (i < bitsB.length) result.push({ time: i * 2 + 1, value: bitsB[i] });
    }
    setOutput(result);
  };

  const simulateFDM = () => {
    const bitsA = inputA.split("").map(Number);
    const bitsB = inputB.split("").map(Number);
    const duration = 1;
    const sampleRate = 100;
    const samplesPerBit = duration * sampleRate;
    const totalSamples = samplesPerBit * Math.max(bitsA.length, bitsB.length);
    let result = [];

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const bitIndex = Math.floor(i / samplesPerBit);
      const aBit = bitsA[bitIndex] ?? 0;
      const bBit = bitsB[bitIndex] ?? 0;
      const freqA = 2;
      const freqB = 5;

      const signalA = aBit * Math.sin(2 * Math.PI * freqA * t);
      const signalB = bBit * Math.sin(2 * Math.PI * freqB * t);

      result.push({ time: t.toFixed(2), value: signalA + signalB });
    }

    setOutput(result);
  };

  const simulateWDM = () => {
    const bitsA = inputA.split("").map(Number);
    const bitsB = inputB.split("").map(Number);
    const wavelengthA = 1;
    const wavelengthB = 2;
    let result = [];

    const length = Math.max(bitsA.length, bitsB.length);
    for (let i = 0; i < length; i++) {
      const a = bitsA[i] ?? 0;
      const b = bitsB[i] ?? 0;
      result.push({
        time: i,
        value: a * wavelengthA + b * wavelengthB
      });
    }

    setOutput(result);
  };

  const handleSimulate = () => {
    if (mode === "TDM") simulateTDM();
    else if (mode === "FDM") simulateFDM();
    else if (mode === "WDM") simulateWDM();
  };

  const chartData = {
    labels: output.map((pt) => pt.time),
    datasets: [
      {
        label: mode + " Signal",
        data: output.map((pt) => parseFloat(pt.value)),
        fill: false,
        backgroundColor: "#10b981",
        borderColor: "#10b981",
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">MuxSim - Multiplexing Simulation</h1>

      <div className="flex justify-center gap-4 mb-4">
        {['TDM', 'FDM', 'WDM'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded ${mode === m ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 max-w-xl mx-auto">
        <input
          className="border p-2 rounded"
          value={inputA}
          onChange={(e) => setInputA(e.target.value)}
          placeholder="Input Stream A (e.g., 1010)"
        />
        <input
          className="border p-2 rounded"
          value={inputB}
          onChange={(e) => setInputB(e.target.value)}
          placeholder="Input Stream B (e.g., 1100)"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleSimulate}
        >
          Simulate {mode}
        </button>

        <div className="bg-white p-4 rounded shadow">
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Explanation:</h2>
          {mode === "TDM" && (
            <p>
              Time Division Multiplexing (TDM) takes turns sending bits from multiple input
              streams. For every cycle, one bit from A, then one from B is transmitted.
            </p>
          )}
          {mode === "FDM" && (
            <p>
              Frequency Division Multiplexing (FDM) assigns each signal to a different
              frequency. Each bit modulates a sine wave, and the combined signal is the
              sum of these waveforms.
            </p>
          )}
          {mode === "WDM" && (
            <p>
              Wavelength Division Multiplexing (WDM) uses different light wavelengths to
              transmit signals simultaneously over fiber optics. This simulation uses different
              numerical wavelengths for Input A and Input B to mimic the combined signal.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}