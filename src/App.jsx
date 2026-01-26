import { useState, useEffect } from 'react'

function App() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-maximus-bg text-maximus-text p-8 font-mono">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">MAXIMUS <span className="text-maximus-shield">COMMAND</span></h1>
          <p className="text-sm text-gray-500">SYSTEM: ONLINE | v1.0.0</p>
        </div>
        <div className="text-right">
          <div className="text-2xl">{time.toLocaleTimeString([], {hour12: false})} UTC</div>
          <div className="text-sm text-gray-500">{time.toLocaleDateString()}</div>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Module: Shadow Portfolio */}
        <div className="bg-maximus-card border border-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-maximus-shield">SHADOW PORTFOLIO</h2>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Strategy</span>
              <span>Shield (80%) / Sword (20%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Position</span>
              <span className="text-red-400">SHORT SOL (5x)</span>
            </div>
            <div className="flex justify-between text-2xl font-bold mt-4 pt-4 border-t border-gray-800">
              <span className="text-gray-400">Equity</span>
              <span>$1,000.00</span>
            </div>
          </div>
        </div>

        {/* Module: Ammo Watch */}
        <div className="bg-maximus-card border border-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-yellow-500">SUPPLY WATCH</h2>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between items-center p-2 bg-black/30 rounded">
              <span className="font-bold">9mm</span>
              <div className="text-right">
                <div className="text-green-400">$199</div>
                <div className="text-xs text-gray-500">Baseline</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-black/30 rounded">
              <span className="font-bold">5.56</span>
              <div className="text-right">
                <div className="text-red-400">$442</div>
                <div className="text-xs text-gray-500">High</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-black/30 rounded">
              <span className="font-bold">.223</span>
              <div className="text-right">
                <div className="text-yellow-400">$409</div>
                <div className="text-xs text-gray-500">Elevated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Module: Intel Wire */}
        <div className="bg-maximus-card border border-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-400">INTEL WIRE</h2>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-black/30 rounded border-l-2 border-green-500">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-gray-300">@ClaudiusMax1980</span>
                <span className="text-xs text-gray-600">Now</span>
              </div>
              <p className="text-gray-400">Signal strong. Systems online.</p>
            </div>
            <div className="p-3 bg-black/30 rounded border-l-2 border-gray-700 opacity-50">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-gray-300">@JupiterExchange</span>
                <span className="text-xs text-gray-600">2h ago</span>
              </div>
              <p className="text-gray-400">Monitoring JLP pool yields...</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer / Console */}
      <div className="mt-12 p-4 bg-black border border-gray-800 rounded font-mono text-xs text-green-500">
        <p>&gt; initializing maximus_core...</p>
        <p>&gt; connecting to notion gateway... <span className="text-white">OK</span></p>
        <p>&gt; checking portfolio status... <span className="text-white">OK</span></p>
        <p className="animate-pulse">&gt; waiting for user input_</p>
      </div>
    </div>
  )
}

export default App
