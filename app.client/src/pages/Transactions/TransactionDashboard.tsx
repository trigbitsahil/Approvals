import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface DashboardData {
    totalTransactions: number;
    transactionsInProgress: number;
    fundsInProgress: number;
    recentTransactions: any[];
}

export const TransactionDashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // Ensure proper API URL depending on environment
                const response = await axios.get('/api/v1/transaction/dashboard', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setData(response.data);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            }
        };
        fetchDashboard();
    }, []);

    if (!data) return <div>Loading Transaction Dashboard...</div>;

    return (
        <div className="transaction-dashboard" style={{ padding: '20px' }}>
            <h1>Transaction Dashboard</h1>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h3>Total Transactions</h3>
                    <p style={{ fontSize: '24px' }}>{data.totalTransactions}</p>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h3>In Progress</h3>
                    <p style={{ fontSize: '24px' }}>{data.transactionsInProgress}</p>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h3>Funds In Progress</h3>
                    <p style={{ fontSize: '24px' }}>${data.fundsInProgress.toLocaleString()}</p>
                    <small>Value may be masked based on your permissions</small>
                </div>
            </div>
            
            <h2>Recent Transactions</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '8px' }}>ID</th>
                        <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '8px' }}>Status</th>
                        <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '8px' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.recentTransactions.map((tx, idx) => (
                        <tr key={idx}>
                            <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{tx.transactionId}</td>
                            <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{tx.status}</td>
                            <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>${tx.displayAmount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
