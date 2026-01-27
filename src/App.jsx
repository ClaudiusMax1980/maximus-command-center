import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { motion } from 'framer-motion'
import { Shield, Target, Activity, Terminal, Wifi, AlertTriangle, Radar, Crosshair } from 'lucide-react'

// Mock History Generator (Until we have a DB)
const generateMockHistory = (base, volatility) => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: `D-${6 - i}`,
    price: base + (Math.random() - 0.5) * volatility
  }))
}

function App() {
  const [time, setTime] = useState(new Date())
  const [solPrice, setSolPrice] = useState(null)
  const [ammoPrices, setAmmoPrices] = useState({ '9mm': '...', '5.56': '...', '.223': '...' })
  const [loading, setLoading] = useState(true)

  // Chart Data State
  const [solHistory, setSolHistory] = useState([])

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch SOL
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        const price = response.data.solana.usd
        setSolPrice(price)
        
        // Simulating history update based on live price for visual
        if (solHistory.length === 0) {
           const history = generateMockHistory(price, 5)
           history.push({ day: 'NOW', price: price })
           setSolHistory(history)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching price:", error)
      }
    }
    fetchPrice()
    const interval = setInterval(fetchPrice, 30000)
    return () => clearInterval(interval)
  }, [])

  // Fetch Ammo
  useEffect(() => {
    const fetchAmmo = async () => {
      try {
        // Fetch static JSON file instead of API
        const response = await axios.get('/ammo_data.json')
        const data = response.data;
        
        // Transform array to object for display
        // [{ caliber: '9mm', cost1000: '$65.00...' }] -> { '9mm': '$65.00' }
        const prices = { '9mm': '...', '5.56': '...', '.223': '...' };
        
        if (Array.isArray(data)) {
            // Find cheapest for each caliber
            ['9mm', '5.56', '.223'].forEach(cal => {
                const deal = data.find(d => d.caliber === cal);
                if (deal) {
                    // Extract just the price part "$65.00" from "$65.00 (+ Shipping)"
                    prices[cal] = deal.cost1000.split(' ')[0];
                }
            });
        }
        setAmmoPrices(prices)
      } catch (error) {
        console.error("Error fetching ammo:", error)
      }
    }
    fetchAmmo()
    const interval = setInterval(fetchAmmo, 60000) // Check every minute (it's just a static file now)
    return () => clearInterval(interval)
  }, [])

  // Fetch Alpha
  const [alphaTokens, setAlphaTokens] = useState([])
  useEffect(() => {
    const fetchAlpha = async () => {
      try {
        const response = await axios.get('/api/alpha')
        if (Array.isArray(response.data)) {
            setAlphaTokens(response.data)
        } else {
             console.warn("Alpha data is not array", response.data)
             setAlphaTokens([])
        }
      } catch (error) {
        console.error("Error fetching alpha:", error)
        setAlphaTokens([])
      }
    }
    fetchAlpha()
    const interval = setInterval(fetchAlpha, 60000) // Every minute
    return () => clearInterval(interval)
  }, [])

  // Fetch Gear
  const [gearList, setGearList] = useState([])
  useEffect(() => {
    const fetchGear = async () => {
      try {
        const response = await axios.get('/api/gear')
        if (Array.isArray(response.data)) {
            setGearList(response.data)
        } else {
             console.warn("Gear data is not array", response.data)
             setGearList([])
        }
      } catch (error) {
        console.error("Error fetching gear:", error)
        setGearList([])
      }
    }
    fetchGear()
    const interval = setInterval(fetchGear, 300000) // Every 5 minutes
    return () => clearInterval(interval)
  }, [])

  // Fetch X Data
  const [xFeed, setXFeed] = useState([])
  useEffect(() => {
    const fetchX = async () => {
      try {
        const response = await axios.get('/x_data.json')
        if (Array.isArray(response.data)) {
            setXFeed(response.data)
        } else {
            console.warn("x_data.json is not an array:", response.data)
            setXFeed([])
        }
      } catch (error) {
        console.error("Error fetching x feed:", error)
        setXFeed([])
      }
    }
    fetchX()
    const interval = setInterval(fetchX, 60000)
    return () => clearInterval(interval)
  }, [])

  // Framer Motion Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen bg-black bg-grid text-green-500 font-mono scanlines p-4 md:p-8">
      
      {/* HUD Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-green-900/50 pb-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-900/20 border border-green-500/50 rounded-full">
            <Shield className="w-8 h-8 text-green-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white text-glow">
              MAXIMUS<span className="text-green-600">.CMD</span>
            </h1>
            <div className="flex items-center gap-2 text-xs md:text-sm text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              SYSTEM ONLINE // SECURE CONNECTION
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 text-right font-mono">
          <div className="text-2xl text-white">{time.toLocaleTimeString([], {hour12: false})} <span className="text-xs text-green-600">UTC</span></div>
          <div className="text-xs text-green-800">{time.toLocaleDateString().toUpperCase()}</div>
        </div>
      </motion.header>

      {/* Main Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        
        {/* Module: Crypto / Shadow Portfolio */}
        <motion.div variants={item} className="col-span-1 lg:col-span-2 bg-black/60 border border-green-900/50 backdrop-blur-sm rounded-xl overflow-hidden relative group hover:border-green-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-50"><Activity className="w-16 h-16 text-green-900/20" /></div>
          
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-green-500">///</span> SHADOW PORTFOLIO
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Stats */}
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-green-700 mb-1">ACTIVE STRATEGY</div>
                  <div className="text-lg text-white">SHIELD (80%) + SWORD (20%)</div>
                </div>
                <div>
                  <div className="text-xs text-green-700 mb-1">LIVE POSITION</div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-900/30 text-red-500 px-2 py-1 text-xs border border-red-900/50 rounded">SHORT SOL (5x)</span>
                    <span className="text-white font-bold">@ $121.21</span>
                  </div>
                </div>
                <div>
                   <div className="text-xs text-green-700 mb-1">LIVE PnL</div>
                   <div className={`text-3xl font-bold ${!solPrice ? 'opacity-50' : (solPrice < 121.21 ? 'text-green-400 text-glow' : 'text-red-500')}`}>
                      {solPrice ? (
                        <>
                         {((121.21 - solPrice) * 5 * (200 / 121.21) > 0 ? '+' : '')}
                         ${((121.21 - solPrice) * 5 * (200 / 121.21)).toFixed(2)}
                        </>
                      ) : 'CALCULATING...'}
                   </div>
                </div>
              </div>

              {/* Chart */}
              <div className="h-48 w-full bg-green-900/5 rounded border border-green-900/30 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={solHistory}>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #064e3b', color: '#fff' }}
                      itemStyle={{ color: '#4ade80' }}
                    />
                    <XAxis dataKey="day" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <ReferenceLine y={121.21} stroke="#ef4444" strokeDasharray="3 3" label="ENTRY" />
                    <Line type="monotone" dataKey="price" stroke="#4ade80" strokeWidth={2} dot={{ r: 2, fill: '#4ade80' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Module: Gear Sniper */}
        <motion.div variants={item} className="bg-black/60 border border-green-900/50 backdrop-blur-sm rounded-xl p-6 hover:border-orange-500/50 transition-colors">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-orange-500">///</span> GEAR SNIPER
          </h2>
          <div className="space-y-3">
             {gearList.length === 0 ? (
               <div className="text-orange-500/50 text-sm animate-pulse">SCANNING MARKET...</div>
             ) : (
               gearList.map((item, i) => (
                 <a key={i} href={item.url} target="_blank" rel="noreferrer" className="block group">
                   <div className="flex justify-between items-center p-2 bg-orange-900/10 rounded border border-orange-900/30 hover:bg-orange-900/30 transition-all">
                     <div className="flex items-center gap-3">
                       <Crosshair className="w-4 h-4 text-orange-500 group-hover:rotate-45 transition-transform" />
                       <div>
                         <div className="text-white font-bold text-sm truncate w-48">{item.title}</div>
                         <div className="text-[10px] text-orange-300">AR15.COM MARKET</div>
                       </div>
                     </div>
                   </div>
                 </a>
               ))
             )}
          </div>
        </motion.div>

        {/* Module: Alpha Radar */}
        <motion.div variants={item} className="bg-black/60 border border-green-900/50 backdrop-blur-sm rounded-xl p-6 hover:border-purple-500/50 transition-colors">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-purple-500">///</span> ALPHA RADAR
          </h2>
          <div className="space-y-3">
             {alphaTokens.length === 0 ? (
               <div className="text-purple-500/50 text-sm animate-pulse">SCANNING CHAIN...</div>
             ) : (
               alphaTokens.map((token, i) => (
                 <a key={i} href={token.url} target="_blank" rel="noreferrer" className="block group">
                   <div className="flex justify-between items-center p-2 bg-purple-900/10 rounded border border-purple-900/30 hover:bg-purple-900/30 transition-all">
                     <div className="flex items-center gap-3">
                       <Radar className="w-4 h-4 text-purple-500 group-hover:animate-spin" />
                       <div>
                         <div className="text-white font-bold text-sm">{token.symbol}</div>
                         <div className="text-[10px] text-purple-300 truncate w-24">{token.name}</div>
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="text-white font-mono text-sm">${parseFloat(token.price).toFixed(6)}</div>
                       <div className="text-[10px] text-gray-500">LIQ: ${(token.liquidity / 1000).toFixed(1)}K</div>
                     </div>
                   </div>
                 </a>
               ))
             )}
          </div>
        </motion.div>

        {/* Module: Supply Watch (Ammo) */}
        <motion.div variants={item} className="bg-black/60 border border-green-900/50 backdrop-blur-sm rounded-xl p-6 hover:border-yellow-500/50 transition-colors">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-yellow-500">///</span> SUPPLY WATCH
          </h2>
          
          <div className="space-y-4">
            {/* 9mm */}
            <div className="flex items-center justify-between p-3 bg-green-900/10 rounded border border-green-900/30">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-white font-bold">9mm</div>
                  <div className="text-[10px] text-green-700">BASELINE: $199</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">{ammoPrices['9mm'] !== '...' ? ammoPrices['9mm'] : <span className="animate-pulse">...</span>}</div>
                <div className="text-[10px] text-gray-500">PER 1000 RD CASE</div>
              </div>
            </div>

            {/* 5.56 */}
            <div className="flex items-center justify-between p-3 bg-red-900/10 rounded border border-red-900/30">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <div className="text-white font-bold">5.56</div>
                  <div className="text-[10px] text-red-700">ELEVATED PRICE</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-red-400">{ammoPrices['5.56']}</div>
                 <div className="text-[10px] text-gray-500">PER 1000 RD CASE</div>
              </div>
            </div>

            {/* .223 */}
             <div className="flex items-center justify-between p-3 bg-yellow-900/10 rounded border border-yellow-900/30">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-white font-bold">.223</div>
                  <div className="text-[10px] text-yellow-700">WATCHING</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-yellow-400">{ammoPrices['.223']}</div>
                 <div className="text-[10px] text-gray-500">PER 1000 RD CASE</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Module: Intel Wire */}
        <motion.div variants={item} className="col-span-1 lg:col-span-3 bg-black/60 border border-green-900/50 backdrop-blur-sm rounded-xl p-6">
           <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-500">///</span> INTEL WIRE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {xFeed.length === 0 ? (
               <div className="col-span-full text-blue-500/50 text-sm animate-pulse">LISTENING TO THE ETHER...</div>
             ) : (
               xFeed.slice(0, 6).map((tweet, i) => (
                 <a key={i} href={tweet.link} target="_blank" rel="noreferrer" className="block group h-full">
                   <div className="flex gap-4 p-4 bg-blue-900/10 border border-blue-900/30 rounded h-full hover:bg-blue-900/20 transition-all">
                     <div className="mt-1 flex-shrink-0"><Wifi className="w-5 h-5 text-blue-400" /></div>
                     <div className="flex flex-col justify-between w-full">
                       <div>
                         <div className="font-bold text-blue-300 text-sm mb-1">{tweet.handle}</div>
                         <div className="text-gray-400 text-xs line-clamp-3 leading-relaxed">"{tweet.text}"</div>
                       </div>
                       <div className="text-[10px] text-blue-800 mt-3 flex justify-between">
                         <span>LINK STATUS: ACTIVE</span>
                         <span>{new Date(tweet.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                       </div>
                     </div>
                   </div>
                 </a>
               ))
             )}
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}

export default App
