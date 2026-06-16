import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Euro, Wallet, BarChart3, Settings, LogOut, User, 
  ArrowUpRight, ArrowDownRight, Moon, Sun, LineChart 
} from 'lucide-react';
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  type: 'stock' | 'crypto';
}

interface Balance {
  usd: number;
  eur: number;
  rub: number;
}

interface PortfolioItem {
  symbol: string;
  amount: number;
  avgPrice: number;
}

interface Trade {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  date: string;
  currency: string;
}

interface PricePoint {
  time: string;
  price: number;
}

const initialAssets: Asset[] = [
  { id: '1', name: 'Apple', symbol: 'AAPL', price: 226.45, change: 1.8, type: 'stock' },
  { id: '2', name: 'Tesla', symbol: 'TSLA', price: 248.12, change: -2.3, type: 'stock' },
  { id: '3', name: 'Microsoft', symbol: 'MSFT', price: 415.78, change: 0.9, type: 'stock' },
  { id: '4', name: 'NVIDIA', symbol: 'NVDA', price: 121.35, change: 4.1, type: 'stock' },
  { id: '5', name: 'Alphabet', symbol: 'GOOGL', price: 175.6, change: 0.6, type: 'stock' },
  { id: '6', name: 'Amazon', symbol: 'AMZN', price: 198.45, change: -1.2, type: 'stock' },
  { id: '7', name: 'Meta', symbol: 'META', price: 505.3, change: 2.4, type: 'stock' },
  { id: '8', name: 'Bitcoin', symbol: 'BTC', price: 67240, change: 3.2, type: 'crypto' },
  { id: '9', name: 'Ethereum', symbol: 'ETH', price: 2650, change: -1.5, type: 'crypto' },
  { id: '10', name: 'Solana', symbol: 'SOL', price: 148.75, change: 5.6, type: 'crypto' },
  { id: '11', name: 'Cardano', symbol: 'ADA', price: 0.42, change: -0.8, type: 'crypto' },
  { id: '12', name: 'Ripple', symbol: 'XRP', price: 2.18, change: 1.9, type: 'crypto' },
  { id: '13', name: 'Avalanche', symbol: 'AVAX', price: 28.45, change: -3.1, type: 'crypto' },
];

const ADMIN_PASSWORD = 'admin2026';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [currentTab, setCurrentTab] = useState<'market' | 'portfolio' | 'admin'>('market');
  const [darkMode, setDarkMode] = useState(false);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [balances, setBalances] = useState<Balance>({ usd: 12500, eur: 8700, rub: 950000 });
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { symbol: 'AAPL', amount: 12, avgPrice: 198.5 },
    { symbol: 'BTC', amount: 0.35, avgPrice: 61200 },
    { symbol: 'ETH', amount: 2.8, avgPrice: 2410 },
  ]);
  const [trades, setTrades] = useState<Trade[]>([
    { id: 't1', type: 'buy', symbol: 'AAPL', amount: 5, price: 198.5, total: 992.5, date: '2026-06-10', currency: 'usd' },
    { id: 't2', type: 'buy', symbol: 'BTC', amount: 0.2, price: 61200, total: 12240, date: '2026-06-12', currency: 'usd' },
  ]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeCurrency, setTradeCurrency] = useState<'usd' | 'eur' | 'rub'>('usd');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [chartAsset, setChartAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedAssets = localStorage.getItem('cryptogame_assets');
    const savedBalances = localStorage.getItem('cryptogame_balances');
    const savedPortfolio = localStorage.getItem('cryptogame_portfolio');
    const savedTrades = localStorage.getItem('cryptogame_trades');
    const savedDark = localStorage.getItem('cryptogame_dark');

    if (savedAssets) setAssets(JSON.parse(savedAssets));
    if (savedBalances) setBalances(JSON.parse(savedBalances));
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
    if (savedTrades) setTrades(JSON.parse(savedTrades));
    if (savedDark) setDarkMode(JSON.parse(savedDark));
  }, []);

  useEffect(() => { localStorage.setItem('cryptogame_assets', JSON.stringify(assets)); }, [assets]);
  useEffect(() => { localStorage.setItem('cryptogame_balances', JSON.stringify(balances)); }, [balances]);
  useEffect(() => { localStorage.setItem('cryptogame_portfolio', JSON.stringify(portfolio)); }, [portfolio]);
  useEffect(() => { localStorage.setItem('cryptogame_trades', JSON.stringify(trades)); }, [trades]);
  useEffect(() => { localStorage.setItem('cryptogame_dark', JSON.stringify(darkMode)); }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        const volatility = asset.type === 'crypto' ? 0.85 : 0.28;
        const change = (Math.random() - 0.485) * volatility;
        const newPrice = Math.max(0.01, asset.price * (1 + change / 100));
        return {
          ...asset,
          price: parseFloat(newPrice.toFixed(asset.type === 'crypto' && asset.price > 100 ? 0 : 2)),
          change: parseFloat(change.toFixed(1))
        };
      }));
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stocks = filteredAssets.filter(a => a.type === 'stock');
  const cryptos = filteredAssets.filter(a => a.type === 'crypto');

  const portfolioValue = portfolio.reduce((sum, item) => {
    const asset = assets.find(a => a.symbol === item.symbol);
    return sum + (asset ? item.amount * asset.price : 0);
  }, 0);

  const totalBalance = balances.usd + balances.eur * 1.09 + balances.rub / 90;

  const generatePriceHistory = (symbol: string): PricePoint[] => {
    const asset = assets.find(a => a.symbol === symbol);
    if (!asset) return [];
    const base = asset.price;
    const points: PricePoint[] = [];
    let currentPrice = base * 0.94;
    for (let i = 0; i < 24; i++) {
      currentPrice = currentPrice * (0.985 + Math.random() * 0.03);
      points.push({
        time: `${(8 + Math.floor(i / 2)).toString().padStart(2, '0')}:${(i % 2 === 0 ? '00' : '30')}`,
        price: parseFloat(currentPrice.toFixed(asset.price > 100 ? 0 : 2))
      });
    }
    return points;
  };

  const openTrade = (asset: Asset, type: 'buy' | 'sell') => {
    setSelectedAsset(asset);
    setTradeType(type);
    setTradeAmount('');
    setTradeCurrency('usd');
    setShowTradeModal(true);
  };

  const openChart = (asset: Asset) => {
    setChartAsset(asset);
    setShowChartModal(true);
  };

  const executeTrade = () => {
    if (!selectedAsset || !tradeAmount) return;
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Введите корректное количество');
      return;
    }
    const totalCost = amount * selectedAsset.price;
    let convertedCost = totalCost;
    if (tradeCurrency === 'eur') convertedCost = totalCost * 0.92;
    if (tradeCurrency === 'rub') convertedCost = totalCost * 90;

    if (tradeType === 'buy') {
      if (convertedCost > balances[tradeCurrency]) {
        toast.error(`Недостаточно средств в ${tradeCurrency.toUpperCase()}`);
        return;
      }
      setBalances(prev => ({ ...prev, [tradeCurrency]: prev[tradeCurrency] - convertedCost }));
      const existing = portfolio.findIndex(p => p.symbol === selectedAsset.symbol);
      if (existing !== -1) {
        const item = portfolio[existing];
        const newAmount = item.amount + amount;
        const newAvg = ((item.amount * item.avgPrice) + totalCost) / newAmount;
        const newPortfolio = [...portfolio];
        newPortfolio[existing] = { ...item, amount: newAmount, avgPrice: parseFloat(newAvg.toFixed(2)) };
        setPortfolio(newPortfolio);
      } else {
        setPortfolio([...portfolio, { symbol: selectedAsset.symbol, amount, avgPrice: selectedAsset.price }]);
      }
    } else {
      const holding = portfolio.find(p => p.symbol === selectedAsset.symbol);
      if (!holding || holding.amount < amount) {
        toast.error('Недостаточно активов для продажи');
        return;
      }
      setBalances(prev => ({ ...prev, [tradeCurrency]: prev[tradeCurrency] + convertedCost }));
      const newPortfolio = portfolio.map(item => 
        item.symbol === selectedAsset.symbol ? { ...item, amount: item.amount - amount } : item
      ).filter(item => item.amount > 0);
      setPortfolio(newPortfolio);
    }

    const newTrade: Trade = {
      id: Date.now().toString(),
      type: tradeType,
      symbol: selectedAsset.symbol,
      amount,
      price: selectedAsset.price,
      total: totalCost,
      date: new Date().toISOString().split('T')[0],
      currency: tradeCurrency
    };
    setTrades([newTrade, ...trades]);
    toast.success(`${tradeType === 'buy' ? 'Куплено' : 'Продано'} ${amount} ${selectedAsset.symbol}`);
    setShowTradeModal(false);
    setTradeAmount('');
  };

  const handleLogin = () => {
    if (loginPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setIsLoggedIn(true);
      setShowLogin(false);
      setLoginPassword('');
      setCurrentTab('admin');
      toast.success('Добро пожаловать в админ-панель');
    } else {
      toast.error('Неверный пароль');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentTab('market');
    toast.info('Вы вышли из аккаунта');
  };

  const adminUpdatePrice = (id: string, newPrice: number) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, price: newPrice } : a));
    toast.success('Цена обновлена');
  };

  const adminAddBalance = (currency: keyof Balance, amount: number) => {
    setBalances(prev => ({ ...prev, [currency]: prev[currency] + amount }));
    toast.success(`Добавлено ${amount} ${currency.toUpperCase()}`);
  };

  const resetAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const formatPrice = (price: number, type: string) => {
    if (type === 'crypto' && price > 100) return price.toLocaleString();
    return price.toFixed(2);
  };

  const getCurrencySymbol = (cur: string) => cur === 'usd' ? '$' : cur === 'eur' ? '€' : '₽';

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-[#f8f9fc] dark:bg-zinc-950 text-[#111] dark:text-white transition-colors`}>
      <nav className="glass sticky top-0 z-50 border-b border-white/40 dark:border-white/10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black dark:bg-white rounded-2xl flex items-center justify-center">
              <span className="text-white dark:text-black text-xl font-semibold">C</span>
            </div>
            <div>
              <div className="font-semibold text-xl tracking-tight">CryptoGame</div>
              <div className="text-[10px] text-black/50 dark:text-white/50 -mt-1">Крипто и акции</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <button onClick={() => setCurrentTab('market')} className={`px-5 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all ${currentTab === 'market' ? 'bg-white dark:bg-zinc-800 shadow' : 'hover:bg-white/70 dark:hover:bg-zinc-800'}`}>
                  <BarChart3 size={16} /> Рынок
                </button>
                <button onClick={() => setCurrentTab('portfolio')} className={`px-5 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all ${currentTab === 'portfolio' ? 'bg-white dark:bg-zinc-800 shadow' : 'hover:bg-white/70 dark:hover:bg-zinc-800'}`}>
                  <Wallet size={16} /> Портфель
                </button>
                {isAdmin && (
                  <button onClick={() => setCurrentTab('admin')} className={`px-5 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all ${currentTab === 'admin' ? 'bg-white dark:bg-zinc-800 shadow' : 'hover:bg-white/70 dark:hover:bg-zinc-800'}`}>
                    <Settings size={16} /> Админ
                  </button>
                )}
                <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-2 rounded-2xl hover:bg-white/70 dark:hover:bg-zinc-800">
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={logout} className="ml-1 px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/70 dark:hover:bg-zinc-800 rounded-2xl transition-all">
                  <LogOut size={16} /> Выйти
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-2 rounded-2xl hover:bg-white/70 dark:hover:bg-zinc-800">
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={() => setShowLogin(true)} className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-3xl text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.985]">
                  <User size={16} /> Войти как администратор
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        <div className="mb-10">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-5xl font-semibold tracking-tighter">Добро пожаловать в CryptoGame</div>
              <div className="text-xl text-black/60 dark:text-white/60 mt-1">Твоя персональная крипто-биржа</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-black/60 dark:text-white/60">Общий баланс</div>
              <div className="text-4xl font-semibold tabular-nums tracking-tighter">${totalBalance.toFixed(0)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              { label: 'USD', value: balances.usd, icon: DollarSign, color: 'emerald' },
              { label: 'EUR', value: balances.eur, icon: Euro, color: 'blue' },
              { label: 'RUB', value: balances.rub, icon: DollarSign, color: 'violet' },
            ].map((bal, idx) => (
              <div key={idx} className="glass p-6 rounded-3xl flex justify-between items-center dark:bg-zinc-900/70">
                <div>
                  <div className="text-sm text-black/60 dark:text-white/60">{bal.label}</div>
                  <div className="text-3xl font-semibold tabular-nums tracking-tighter mt-1">{bal.value.toLocaleString()}</div>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${bal.color}-100 dark:bg-${bal.color}-950`}>
                  <bal.icon className={`text-${bal.color}-600 dark:text-${bal.color}-400`} size={22} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {currentTab === 'market' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="text-3xl font-semibold tracking-tight">Рынок</div>
              <input type="text" placeholder="Поиск актива..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input w-80 px-5 py-3 rounded-3xl text-sm placeholder:text-black/40 dark:bg-zinc-900 dark:border-white/10" />
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4 px-1">
                <div className="font-semibold text-xl tracking-tight">Акции компаний</div>
                <div className="px-3 py-px rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-medium">STOCKS</div>
              </div>
              <div className="glass rounded-3xl overflow-hidden dark:bg-zinc-900/70">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/60 dark:border-white/10 text-left text-sm text-black/60 dark:text-white/60">
                      <th className="py-4 px-8 font-medium">Актив</th>
                      <th className="py-4 px-4 font-medium text-right">Цена</th>
                      <th className="py-4 px-6 font-medium text-right">Изменение</th>
                      <th className="py-4 px-4 font-medium text-center">График</th>
                      <th className="py-4 px-8 font-medium text-right w-48">Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map(asset => (
                      <tr key={asset.id} className="table-row border-b border-white/50 dark:border-white/10 last:border-0">
                        <td className="py-5 px-8"><div><div className="font-semibold">{asset.name}</div><div className="text-xs text-black/50 dark:text-white/50 font-mono">{asset.symbol}</div></div></td>
                        <td className="py-5 px-4 text-right font-mono text-xl tabular-nums font-medium">${formatPrice(asset.price, asset.type)}</td>
                        <td className="py-5 px-6 text-right"><div className={`inline-flex items-center gap-1 px-4 py-px rounded-full text-sm font-medium ${asset.change >= 0 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>{asset.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{asset.change}%</div></td>
                        <td className="py-5 px-4 text-center"><button onClick={() => openChart(asset)} className="p-2 rounded-xl hover:bg-white/70 dark:hover:bg-zinc-800"><LineChart size={16} /></button></td>
                        <td className="py-5 px-8 text-right"><div className="flex justify-end gap-2"><button onClick={() => openTrade(asset, 'buy')} className="px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-all">Купить</button><button onClick={() => openTrade(asset, 'sell')} className="px-5 py-2 rounded-2xl bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-sm font-medium transition-all">Продать</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4 px-1">
                <div className="font-semibold text-xl tracking-tight">Криптовалюты</div>
                <div className="px-3 py-px rounded-full bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 text-xs font-medium">CRYPTO</div>
              </div>
              <div className="glass rounded-3xl overflow-hidden dark:bg-zinc-900/70">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/60 dark:border-white/10 text-left text-sm text-black/60 dark:text-white/60">
                      <th className="py-4 px-8 font-medium">Актив</th>
                      <th className="py-4 px-4 font-medium text-right">Цена</th>
                      <th className="py-4 px-6 font-medium text-right">Изменение</th>
                      <th className="py-4 px-4 font-medium text-center">График</th>
                      <th className="py-4 px-8 font-medium text-right w-48">Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptos.map(asset => (
                      <tr key={asset.id} className="table-row border-b border-white/50 dark:border-white/10 last:border-0">
                        <td className="py-5 px-8"><div><div className="font-semibold">{asset.name}</div><div className="text-xs text-black/50 dark:text-white/50 font-mono">{asset.symbol}</div></div></td>
                        <td className="py-5 px-4 text-right font-mono text-xl tabular-nums font-medium">${formatPrice(asset.price, asset.type)}</td>
                        <td className="py-5 px-6 text-right"><div className={`inline-flex items-center gap-1 px-4 py-px rounded-full text-sm font-medium ${asset.change >= 0 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>{asset.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{asset.change}%</div></td>
                        <td className="py-5 px-4 text-center"><button onClick={() => openChart(asset)} className="p-2 rounded-xl hover:bg-white/70 dark:hover:bg-zinc-800"><LineChart size={16} /></button></td>
                        <td className="py-5 px-8 text-right"><div className="flex justify-end gap-2"><button onClick={() => openTrade(asset, 'buy')} className="px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-all">Купить</button><button onClick={() => openTrade(asset, 'sell')} className="px-5 py-2 rounded-2xl bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-sm font-medium transition-all">Продать</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {currentTab === 'portfolio' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-4xl font-semibold tracking-tight">Портфель</div>
                <div className="text-2xl text-emerald-600 dark:text-emerald-400 mt-1 tracking-tighter">+${portfolioValue.toFixed(0)}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <div className="glass rounded-3xl p-7 dark:bg-zinc-900/70">
                  <div className="font-semibold mb-5 px-1">Ваши активы</div>
                  {portfolio.length > 0 ? (
                    <div className="space-y-px">
                      {portfolio.map((item, index) => {
                        const asset = assets.find(a => a.symbol === item.symbol);
                        if (!asset) return null;
                        const currentValue = item.amount * asset.price;
                        const profit = ((asset.price - item.avgPrice) / item.avgPrice) * 100;
                        return (
                          <div key={index} className="flex justify-between items-center py-5 px-4 rounded-2xl hover:bg-white/60 dark:hover:bg-white/5 transition-all">
                            <div><div className="font-semibold">{asset.name}</div><div className="text-xs text-black/50 dark:text-white/50">{item.amount} {item.symbol} @ ${item.avgPrice}</div></div>
                            <div className="text-right"><div className="font-mono text-xl">${currentValue.toFixed(0)}</div><div className={profit >= 0 ? 'text-emerald-600 dark:text-emerald-400 text-xs' : 'text-red-600 dark:text-red-400 text-xs'}>{profit >= 0 ? '+' : ''}{profit.toFixed(1)}%</div></div>
                          </div>
                        );
                      })}
                    </div>
                  ) : <div className="text-center py-12 text-black/50 dark:text-white/50">Портфель пуст</div>}
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="glass rounded-3xl p-7 h-full dark:bg-zinc-900/70">
                  <div className="font-semibold mb-5 px-1">Последние сделки</div>
                  <div className="space-y-4">
                    {trades.slice(0, 6).map(trade => (
                      <div key={trade.id} className="flex justify-between items-center text-sm">
                        <div><span className={trade.type === 'buy' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>{trade.type === 'buy' ? 'Купил' : 'Продал'}</span> {trade.amount} {trade.symbol}</div>
                        <div className="font-mono text-black/70 dark:text-white/70">{getCurrencySymbol(trade.currency)}{trade.total.toFixed(0)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'admin' && isAdmin && (
          <div>
            <div className="mb-8 flex justify-between items-end">
              <div><div className="text-4xl font-semibold tracking-tight">Админ-панель</div><div className="text-black/60 dark:text-white/60 mt-1">Управление биржей</div></div>
              <button onClick={resetAllData} className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-2xl">Сбросить все данные</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-3xl p-8 dark:bg-zinc-900/70">
                <div className="font-semibold mb-6 text-xl">Редактирование цен</div>
                <div className="space-y-4 max-h-[520px] overflow-auto pr-2">
                  {assets.map(asset => (
                    <div key={asset.id} className="flex items-center justify-between bg-white/70 dark:bg-zinc-800/60 p-4 rounded-2xl">
                      <div><div className="font-medium">{asset.name} ({asset.symbol})</div><div className="font-mono text-xl">${asset.price}</div></div>
                      <div className="flex gap-2 items-center">
                        <input type="number" defaultValue={asset.price} className="input w-28 px-4 py-2 text-sm rounded-2xl dark:bg-zinc-900" onBlur={(e) => { const newPrice = parseFloat(e.target.value); if (newPrice > 0) adminUpdatePrice(asset.id, newPrice); }} />
                        <button onClick={() => adminUpdatePrice(asset.id, parseFloat((asset.price * 1.05).toFixed(2)))} className="px-3 py-2 text-xs bg-emerald-500 text-white rounded-2xl">+5%</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-3xl p-8 dark:bg-zinc-900/70">
                <div className="font-semibold mb-6 text-xl">Пополнение баланса</div>
                <div className="space-y-8">
                  {(['usd', 'eur', 'rub'] as const).map(curr => (
                    <div key={curr} className="flex items-center justify-between">
                      <div className="font-medium uppercase text-lg tracking-wider">{curr}</div>
                      <div className="flex gap-3">
                        {[500, 2000, 10000].map(amt => (
                          <button key={amt} onClick={() => adminAddBalance(curr, amt)} className="px-6 py-2.5 text-sm bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-700">+{amt}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-xs text-black/40 dark:text-white/40">Данные сохраняются автоматически</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showTradeModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-6" onClick={() => setShowTradeModal(false)}>
          <div className="modal glass-dark w-full max-w-md rounded-3xl p-8 dark:bg-zinc-900" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-7">
              <div className="text-2xl font-semibold tracking-tight">{tradeType === 'buy' ? 'Покупка' : 'Продажа'}</div>
              <div className="text-xl mt-1 text-black/60 dark:text-white/60">{selectedAsset.name} ({selectedAsset.symbol})</div>
            </div>
            <div className="mb-8">
              <div className="text-xs tracking-[1.5px] text-black/60 dark:text-white/60 mb-1 px-1">ЦЕНА ЗА ЕДИНИЦУ</div>
              <div className="text-5xl font-semibold tabular-nums tracking-tighter">${selectedAsset.price}</div>
            </div>
            <div className="mb-6">
              <div className="text-xs tracking-[1.5px] text-black/60 dark:text-white/60 mb-2 px-1">ВАЛЮТА ОПЛАТЫ</div>
              <div className="flex gap-2">
                {(['usd','eur','rub'] as const).map(cur => (
                  <button key={cur} onClick={() => setTradeCurrency(cur)} className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition-all ${tradeCurrency === cur ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10'}`}>{cur.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs tracking-[1.5px] text-black/60 dark:text-white/60 mb-2 px-1">КОЛИЧЕСТВО</div>
              <input type="number" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} placeholder="0.00" className="input w-full px-6 py-5 rounded-3xl text-3xl font-medium text-center dark:bg-zinc-900" />
            </div>
            {tradeAmount && (
              <div className="mt-6 p-5 bg-white dark:bg-zinc-800 rounded-2xl text-sm flex justify-between items-center">
                <div>Итого</div>
                <div className="font-mono text-xl font-medium tabular-nums tracking-tight">{getCurrencySymbol(tradeCurrency)}{(parseFloat(tradeAmount) * selectedAsset.price * (tradeCurrency === 'eur' ? 0.92 : tradeCurrency === 'rub' ? 90 : 1)).toFixed(2)}</div>
              </div>
            )}
            <div className="mt-8 flex gap-3">
              <button onClick={() => setShowTradeModal(false)} className="flex-1 py-4 rounded-3xl border border-black/10 dark:border-white/10 text-sm">Отмена</button>
              <button onClick={executeTrade} className={`flex-1 py-4 rounded-3xl text-sm font-semibold text-white ${tradeType === 'buy' ? 'bg-emerald-600' : 'bg-red-600'}`}>{tradeType === 'buy' ? 'Купить' : 'Продать'}</button>
            </div>
          </div>
        </div>
      )}

      {showChartModal && chartAsset && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[65] p-6" onClick={() => setShowChartModal(false)}>
          <div className="modal glass-dark w-full max-w-3xl rounded-3xl p-8 dark:bg-zinc-900" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div><div className="text-3xl font-semibold tracking-tight">{chartAsset.name}</div><div className="text-xl text-black/60 dark:text-white/60">{chartAsset.symbol} • ${chartAsset.price}</div></div>
              <button onClick={() => setShowChartModal(false)} className="text-2xl">×</button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLine data={generatePriceHistory(chartAsset.symbol)}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#27272a" : "#f1f1f1"} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="natural" dataKey="price" stroke={darkMode ? "#60a5fa" : "#3b82f6"} strokeWidth={2.5} dot={false} />
                </RechartsLine>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70]">
          <div className="glass-dark w-full max-w-sm mx-4 p-9 rounded-3xl dark:bg-zinc-900">
            <div className="text-center mb-8"><div className="font-semibold text-2xl tracking-tight">Вход в админ-панель</div></div>
            <input type="password" placeholder="Пароль администратора" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="input w-full px-6 py-4 rounded-3xl mb-4 text-center text-xl dark:bg-zinc-900" />
            <div className="flex gap-3">
              <button onClick={() => { setShowLogin(false); setLoginPassword(''); }} className="flex-1 py-3.5 rounded-3xl border border-black/10 dark:border-white/10">Отмена</button>
              <button onClick={handleLogin} className="flex-1 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-3xl">Войти</button>
            </div>
            <div className="text-center text-[10px] text-black/40 dark:text-white/40 mt-6">Пароль: admin2026</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
