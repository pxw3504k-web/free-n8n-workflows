"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { QRCodeSVG } from 'qrcode.react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { trackEvent } from '@/lib/analytics';

export default function SupportPage() {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(5);
  const [currency, setCurrency] = useState<'USD' | 'CNY'>('CNY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const quickAmounts = [3, 5, 10, 20];

  const handleAmountChange = (value: number) => {
    if (value >= 1 && value <= 100) {
      setAmount(value);
    }
  };

  const handleQuickSelect = (value: number) => {
    setAmount(value);
  };

  const handleSupport = async () => {
    if (amount < 1 || amount > 100) {
      setError(t('support.amountRangeError'));
      return;
    }

    setIsProcessing(true);
    setError(null);
    setQrCodeUrl(null);

    try {
      const response = await fetch('/api/support/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
        }),
      });

      const data = await response.json();
      console.log('Create order response:', { response: { ok: response.ok, status: response.status }, data });

      if (response.ok && data.success && data.qr_code_url) {
        console.log('Setting QR code URL:', data.qr_code_url);
        setQrCodeUrl(data.qr_code_url);
        setOrderId(data.order_id);
        try {
          trackEvent('support_create_order', { amount, currency, order_id: data.order_id });
        } catch (e) {}
      } else {
        console.error('Create order error:', data);
        setError(data.error || t('support.createOrderError'));
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(t('support.networkError'));
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (orderId && qrCodeUrl) {
      pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/support/order-status?order_id=${orderId}`);
          const data = await response.json();

          if (data.status === 'paid') {
            clearInterval(pollInterval);
            alert(t('support.paymentSuccess'));
            setQrCodeUrl(null);
            setOrderId(null);
            setAmount(5);
            try {
              trackEvent('support_payment_success', { order_id: orderId });
            } catch (e) {}
          } else if (data.status === 'expired' || data.status === 'cancelled') {
            clearInterval(pollInterval);
            setError(t('support.orderExpired'));
            setQrCodeUrl(null);
            setOrderId(null);
          }
        } catch (err) {
          console.error('Error polling order status:', err);
        }
      }, 3000);

      // Stop polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 5 * 60 * 1000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [orderId, qrCodeUrl, t]);

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      <Header />
      
      <main className="grow flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-200 text-center bg-gray-50">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-pink-100 to-purple-100 mb-6 shadow-sm">
              <Heart className="w-10 h-10 text-pink-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {t('support.title')}
            </h1>
            <p className="text-gray-600">
              {t('support.description')}
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {!qrCodeUrl ? (
              <>
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('support.chooseAmount')}
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={amount}
                        onChange={(e) => handleAmountChange(Number(e.target.value))}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleAmountChange(amount + 1)}
                          disabled={amount >= 100}
                          className="w-8 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAmountChange(amount - 1)}
                          disabled={amount <= 1}
                          className="w-8 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as 'USD' | 'CNY')}
                      className="px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white text-lg font-medium"
                    >
                      <option value="CNY">CNY</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <p className="mt-2 text-xs text-pink-600">
                    {t('support.amountRange')}
                  </p>
                </div>

                {/* Quick Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('support.quickSelect')}
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {quickAmounts.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleQuickSelect(value)}
                        className={`px-2 py-3 rounded-xl border-2 transition-all font-medium ${
                          amount === value
                            ? 'bg-linear-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-md'
                            : 'bg-white border-pink-100 text-gray-600 hover:border-pink-300 hover:bg-pink-50'
                        }`}
                      >
                        {currency === 'CNY' ? `¥${value}` : `$${value}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                  </div>
                )}

                {/* Support Button */}
                <button
                  onClick={handleSupport}
                  disabled={isProcessing || amount < 1 || amount > 100}
                  className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-pink-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('support.processing')}</span>
                    </>
                  ) : (
                    <>
                      <Coffee className="w-5 h-5" />
                      <span>
                        {t('support.supportButton', {
                          amount: currency === 'CNY' ? `¥${amount}` : `$${amount}`,
                        })}
                      </span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* QR Code */}
                <div className="text-center py-4">
                  <p className="text-gray-900 mb-6 font-semibold text-lg">{t('support.scanQRCode')}</p>
                  {qrCodeUrl ? (
                    <div className="space-y-6">
                      <div className="inline-block p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
                        <QRCodeSVG value={qrCodeUrl} size={220} />
                      </div>
                      <p className="text-sm text-gray-500">
                        {t('support.qrCodeHint')}
                      </p>
                    </div>
                  ) : (
                    <div className="py-12">
                      <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-sm text-gray-500">{t('support.loadingQRCode')}</p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setQrCodeUrl(null);
                      setOrderId(null);
                      setError(null);
                    }}
                    className="mt-8 px-6 py-2 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    type="button"
                  >
                    {t('support.back')}
                  </button>
                </div>
              </>
            )}

            {/* Payment Provider Info */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-6 border-t border-gray-100">
              <Lock className="w-3 h-3 text-green-500" />
              <span>{t('support.securePayment')}</span>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
