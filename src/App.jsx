import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [time, setTime] = useState(new Date())
  const [solPrice, setSolPrice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch SOL Price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        setSolPrice(response.data.solana.usd)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching price:", error)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [])

  // Fetch Ammo Prices
  const [ammoPrices, setAmmoPrices] = useState({ '9mm': '...', '5.56': '...', '.223': '...' })
  
  useEffect(() => {
    const fetchAmmo = async () => {
      try {
        const response = await axios.get('/api/ammo')
        setAmmoPrices(response.data)
      } catch (error) {
        console.error("Error fetching ammo:", error)
      }
    }
    fetchAmmo() // Initial fetch
    // Check every hour (ammo prices don't move fast)
    const interval = setInterval(fetchAmmo, 3600000) 
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-maximus-bg text-maximus-text p-8 font-mono">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">MAXIMUS <span className="text-maximus-shield">COMMAND</span></h1>
          <p className="text-sm text-gray-500">SYSTEM: ONLINE | v1.2.0 (Live Supply)</p>
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
            <div className="flex justify-between items-center">
              <span className="text-gray-400">SOL Price</span>
              <span className={`font-bold ${loading ? 'animate-pulse' : ''}`}>
                {loading ? '...' : `$${solPrice}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Position</span>
              <span className="text-red-400">SHORT SOL (5x) @ $121.21</span>
            </div>
            
            {/* Live PnL Calculation */}
            {!loading && (
              <div className="mt-2 p-2 bg-black/50 rounded border border-gray-800">
                <div className="flex justify-between text-sm">
                  <span>PnL (Est):</span>
                  <span className={solPrice < 121.21 ? 'text-green-500' : 'text-red-500'}>
                    {((121.21 - solPrice) * 5 * (200 / 121.21)).toFixed(2)} USD
                  </span>
                </div>
              </div>
            )}

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
                <div className="text-green-400">{ammoPrices['9mm']}</div>
                <div className="text-xs text-gray-500">Lowest Case</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-black/30 rounded">
              <span className="font-bold">5.56</span>
              <div className="text-right">
                <div className="text-red-400">{ammoPrices['5.56']}</div>
                <div className="text-xs text-gray-500">Lowest Case</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-black/30 rounded">
              <span className="font-bold">.223</span>
              <div className="text-right">
                <div className="text-yellow-400">{ammoPrices['.223']}</div>
                <div className="text-xs text-gray-500">Lowest Case</div>
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
