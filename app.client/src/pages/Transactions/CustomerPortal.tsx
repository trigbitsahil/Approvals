import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function CustomerPortal() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/transaction', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Filter to only show where ReceiverId (Customer) matches current user. 
            // In a real app, this filtering should happen on the backend based on user claims.
            setTransactions(response.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    };

    const approveTransaction = async (id: string) => {
        try {
            await axios.put('/api/v1/transaction/status', 
            { transactionId: id, newStatus: 'Approved', notes: 'Approved by Customer' },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
            toast.success("Transaction Approved");
            fetchTransactions();
        } catch (err) {
            toast.error("Approval failed");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Customer Portal</h1>
            <p className="mb-6 text-gray-600">View and approve your incoming transactions.</p>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map(tx => (
                            <tr key={tx.transactionId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.transactionId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.transactionTypeId}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${tx.displayAmount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {tx.status === 'Pending Approval' && (
                                        <button onClick={() => approveTransaction(tx.transactionId)} className="text-indigo-600 hover:text-indigo-900 mr-4">Approve</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
