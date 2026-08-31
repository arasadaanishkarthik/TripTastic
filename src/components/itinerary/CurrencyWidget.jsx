import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ArrowLeftRight, TrendingUp } from 'lucide-react';
import { getCurrencyRates } from '../../services/api';

// Popular target currencies for quick-select
const POPULAR_CURRENCIES = [
  { code: 'USD', symbol: '$',  flag: '🇺🇸', name: 'US Dollar' },
  { code: 'EUR', symbol: '€',  flag: '🇪🇺', name: 'Euro' },
  { code: 'GBP', symbol: '£',  flag: '🇬🇧', name: 'Brit. Pound' },
  { code: 'JPY', symbol: '¥',  flag: '🇯🇵', name: 'Jap. Yen' },
  { code: 'AED', symbol: 'د', flag: '🇦🇪', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', flag: '🇸🇬', name: 'S\'pore Dollar' },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', name: 'Aus. Dollar' },
  { code: 'THB', symbol: '฿',  flag: '🇹🇭', name: 'Thai Baht' },
];

function formatAmount(amount, decimals = 2) {
  if (amount === null || amount === undefined) return '—';
  if (amount >= 1000000) return (amount / 1000000).toFixed(2) + 'M';
  if (amount >= 1000)    return amount.toLocaleString('en-IN', { maximumFractionDigits: decimals });
  return amount.toFixed(decimals);
}

export const CurrencyWidget = ({ itinerary }) => {
  const [rates,      setRates]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [targetCode, setTargetCode] = useState('USD');
  const [refreshing, setRefreshing] = useState(false);

  const perPerson = itinerary?.budget?.perPerson || 0;
  const total     = itinerary?.budget?.total     || 0;

  const fetchRates = useCallback(async () => {
    try {
      setError(null);
      const data = await getCurrencyRates('INR');
      setRates(data.rates);
    } catch (err) {
      console.warn('[CurrencyWidget] fetch failed:', err.message);
      setError('Currency rates unavailable');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRates();
  };

  const selectedCurrency = POPULAR_CURRENCIES.find(c => c.code === targetCode) || POPULAR_CURRENCIES[0];
  const rate = rates?.[targetCode];
  const convertedPerPerson = rate ? parseFloat((perPerson * rate).toFixed(2)) : null;
  const convertedTotal     = rate ? parseFloat((total     * rate).toFixed(2)) : null;

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4 animate-pulse">
        <div className="h-4 w-32 bg-border rounded-full" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-border rounded-xl" />)}
        </div>
        <div className="h-16 bg-border rounded-2xl" />
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-2">
          💱 Currency
        </span>
        <p className="text-xs text-text-secondary">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-5 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent block">
            💱 Currency Converter
          </span>
          <h4 className="font-heading font-bold text-sm uppercase text-text-main">
            INR → {targetCode}
          </h4>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="w-8 h-8 rounded-xl bg-border/50 hover:bg-border flex items-center justify-center transition-colors text-text-secondary hover:text-text-main"
          title="Refresh rates"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Currency quick-select */}
      <div className="grid grid-cols-4 gap-1.5">
        {POPULAR_CURRENCIES.map((cur) => (
          <button
            key={cur.code}
            onClick={() => setTargetCode(cur.code)}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-center transition-all duration-200 border text-xs font-bold
              ${targetCode === cur.code
                ? 'bg-primary/15 border-primary/40 text-primary shadow-sm'
                : 'bg-transparent border-border text-text-secondary hover:border-border hover:bg-surface-elevated hover:text-text-main'
              }`}
          >
            <span className="text-base leading-none">{cur.flag}</span>
            <span className="text-[10px] font-bold">{cur.code}</span>
          </button>
        ))}
      </div>

      {/* Conversion result */}
      {rate && (
        <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary mb-1">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>1 INR = {rate.toFixed(5)} {targetCode}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Per Person (₹{perPerson.toLocaleString()})</span>
              <span className="font-heading font-extrabold text-base text-primary">
                {selectedCurrency.symbol}{formatAmount(convertedPerPerson)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-primary/15 pt-2">
              <span className="text-xs text-text-secondary font-semibold">Total Trip (₹{total.toLocaleString()})</span>
              <span className="font-heading font-extrabold text-lg text-text-main">
                {selectedCurrency.symbol}{formatAmount(convertedTotal)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Selected currency name */}
      <div className="flex items-center justify-between text-xs text-text-secondary pt-1 border-t border-border">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3" />
          <span>{selectedCurrency.flag} {selectedCurrency.name}</span>
        </div>
        <span className="text-[9px] opacity-50">via ExchangeRate-API</span>
      </div>
    </div>
  );
};
