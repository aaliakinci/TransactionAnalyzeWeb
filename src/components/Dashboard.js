import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import UploadCsv from './UploadCsv'; 

const Dashboard = ({ data, loading }) => {
    const [totalSpend, setTotalSpend] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);
    const [averageTransaction, setAverageTransaction] = useState(0);
    const [uniqueMerchants, setUniqueMerchants] = useState(0);
    const [selectedTab, setSelectedTab] = useState('merchant_analysis');

    useEffect(() => {
        if (data) {
            const transactions = data.normalized_transactions;
            const totalSpend = data.detected_patterns.reduce((sum, t) => {
                const amount = typeof t.amount === 'string' ? parseFloat(t.amount.replace('~', '')) : t.amount;
                return sum + (isNaN(amount) ? 0 : amount);
              }, 0).toFixed(2);
            const transactionCount = transactions.length;
            const averageTransaction = transactionCount > 0 ? (totalSpend / transactionCount).toFixed(2) : 0;

            // Tekrar etmeyen merchant'ları hesaplıyoruz
            const uniqueMerchants = new Set(transactions.map((t) => t.normalized.merchant)).size;

            setAverageTransaction(averageTransaction);
            setTotalSpend(totalSpend);

            setTransactionCount(transactionCount);
            setUniqueMerchants(uniqueMerchants);
        }
    }, [data]);

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">📊 Transaction Analyzer</h1>
                <UploadCsv />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-6 mb-6">
                {[
                    { label: 'Total Spend', value: `$${totalSpend}`, icon: '💰' },
                    { label: 'Transactions', value: transactionCount, icon: '📑' },
                    { label: 'Avg. Transaction', value: `$${averageTransaction}`, icon: '📈' },
                    { label: 'Merchants', value: uniqueMerchants, icon: '🏪' },
                ].map((stat, index) => (
                    <div key={index} className="p-6 bg-white shadow-lg rounded-xl flex flex-col items-center">
                        <p className="text-4xl">{stat.icon}</p>
                        <p className="text-gray-500 text-lg">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 mb-4 border-b">
                {[
                    { label: 'Merchant Analysis', value: 'merchant_analysis' },
                    { label: 'Pattern Detection', value: 'pattern_detection' },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        className={`px-6 py-2 rounded-t-lg text-lg font-semibold transition ${selectedTab === tab.value
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                        onClick={() => setSelectedTab(tab.value)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Merchant Analysis Tab */}
            {selectedTab === 'merchant_analysis' && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">🔍 Normalized Merchants</h2>
                    <p className="text-gray-500 mb-6">AI-powered merchant name normalization and categorization</p>
                    {loading ? (
                        <Spinner />
                    ) : (
                        data?.normalized_transactions.map((merchant) => (
                            <div className="mb-4 p-4 bg-white border rounded-lg flex justify-between items-center shadow-sm">
                                {/* Sol taraf: Orijinal işlem */}
                                <div className="flex-1">
                                    <p className="text-gray-500 text-sm">Original</p>
                                    <p className="font-semibold text-gray-800">{merchant.original}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {[merchant.normalized.category, merchant.normalized.sub_category, ...merchant.normalized.flags].map((tag, i) => (
                                            <span key={i} className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Sağ taraf: Normalized alanı */}
                                <div className="text-right flex flex-col items-end">
                                    <p className="text-gray-500 text-sm">Normalized</p>
                                    <p className="text-lg font-semibold text-gray-900">{merchant.normalized.merchant}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Pattern Detection Tab */}
            {selectedTab === 'pattern_detection' && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold">🔎 Detected Patterns</h2>
                    <p className="text-gray-500 mt-2">Subscription and recurring payment detection</p>
                    {loading ? (
                        <Spinner />
                    ) : (
                        data?.detected_patterns.map((pattern, index) => (
                            <div key={index} className="mb-4 p-4 bg-gray-50 border rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">{pattern.merchant}</p>
                                    <p className={`text-gray-600 capitalize ${pattern.type === 'subscription' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {pattern.type}
                                    </p>
                                    <p className="text-gray-500">{pattern.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold">${pattern.amount}</p>
                                    {pattern.next_expected && <p className="text-gray-500">Next: {pattern.next_expected}</p>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;