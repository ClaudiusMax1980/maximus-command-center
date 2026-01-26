import axios from 'axios';

export default async function handler(req, res) {
  try {
    // DexScreener API: Get latest boosted/new tokens on Solana
    // We fetch the latest pairs. Note: DexScreener doesn't have a perfect "newest" endpoint public, 
    // but we can query specific profiles or search. 
    // A better approach for "Alpha" is monitoring 'latest' via their boost or specialized lists if available.
    // For now, we will query a broad search on Solana and sort client-side or check specific trending lists.
    
    // Using the 'latest' endpoint is often restricted, so we'll grab the specific Solana chain data.
    // We'll target "Trending" on Solana as a proxy for "Hot/New".
    const response = await axios.get('https://api.dexscreener.com/latest/dex/tokens/solana'); 
    
    // Actually, DexScreener's API is token-specific. 
    // Let's use the 'search' endpoint or 'pairs' endpoint.
    // Better source for "New" is often BirdEye, but requires API Key.
    // Let's try DexScreener's trending endpoint for Solana if available, or fetch a known list.
    
    // FALLBACK STRATEGY: 
    // Since we don't have a paid "New Pair" stream key yet, we will hit 
    // https://api.dexscreener.com/token-profiles/latest/v1 (if public) or use a known "hot" list.
    
    // Let's use the standard "Get Pairs by Chain" endpoint -> 'https://api.dexscreener.com/latest/dex/search?q=solana'
    // This returns a mix. We'll filter for young pairs.
    
    const { data } = await axios.get('https://api.dexscreener.com/latest/dex/search?q=solana');
    
    const pairs = data.pairs || [];
    
    // Filter for "Alpha" Logic
    const alpha = pairs
      .filter(p => p.chainId === 'solana')
      .filter(p => p.liquidity && p.liquidity.usd > 5000) // Not total dust
      .filter(p => p.volume && p.volume.h24 > 10000) // Has movement
      .sort((a, b) => (b.pairCreatedAt || 0) - (a.pairCreatedAt || 0)) // Newest first
      .slice(0, 5) // Top 5
      .map(p => ({
        name: p.baseToken.name,
        symbol: p.baseToken.symbol,
        price: p.priceUsd,
        liquidity: p.liquidity.usd,
        volume: p.volume.h24,
        age: p.pairCreatedAt ? (Date.now() - p.pairCreatedAt) : null,
        url: p.url
      }));

    res.status(200).json(alpha);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to scan for alpha' });
  }
}
