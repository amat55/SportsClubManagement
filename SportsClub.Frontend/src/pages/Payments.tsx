import { useEffect, useState } from 'react';
import { paymentService } from '../services/paymentService';
import type { Payment } from '../types/payment';
import { Wallet, CheckCircle, Clock } from 'lucide-react';
import { PaymentFormModal } from '../components/PaymentFormModal';

export const Payments = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'unpaid'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const data = activeTab === 'all'
                ? await paymentService.getAllPayments()
                : await paymentService.getUnpaidPayments();
            setPayments(data);
        } catch (error) {
            console.error('Failed to fetch payments', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [activeTab]);

    const handleMarkAsPaid = async (id: string) => {
        try {
            await paymentService.markAsPaid(id);
            await fetchPayments(); // Refresh the list
        } catch (error) {
            console.error('Failed to mark payment as paid', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Muhasebe ve Finans</h1>
                            <p className="text-sm text-gray-500">Sporcuların aidat ve malzeme ödemelerini takip edin.</p>
                        </div>
                    </div>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        <span>Yeni Ödeme/Borç Ata</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6 border-b border-gray-200">
                    <button
                        className={`pb-3 font-medium text-sm transition-colors ${activeTab === 'all' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        Tüm İşlemler
                    </button>
                    <button
                        className={`pb-3 font-medium text-sm transition-colors flex items-center gap-1 ${activeTab === 'unpaid' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('unpaid')}
                    >
                        Geciken / Ödenmeyenler
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <Wallet size={48} className="text-gray-300 mb-4" />
                            <p>İstenilen kritere uygun ödeme kaydı bulunamadı.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sporcu & Açıklama</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar/Tür</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Ödeme Tarihi</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{payment.athleteFullName || 'Bilinmiyor'}</div>
                                                <div className="text-xs text-gray-500">{payment.description || payment.paymentType}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">₺ {payment.amount.toLocaleString('tr-TR')}</div>
                                                <div className="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded mt-1">{payment.paymentType}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{new Date(payment.dueDate).toLocaleDateString('tr-TR')}</div>
                                                {payment.paymentDate && (
                                                    <div className="text-xs text-green-600 font-medium mt-1">
                                                        Ödendi: {new Date(payment.paymentDate).toLocaleDateString('tr-TR')}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment.isPaid ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle size={14} /> Tahsil Edildi
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                        <Clock size={14} /> Bekliyor
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {!payment.isPaid && (
                                                    <button
                                                        onClick={() => handleMarkAsPaid(payment.id)}
                                                        className="text-primary-600 hover:text-primary-900 bg-primary-50 px-3 py-1 rounded-md transition-colors"
                                                    >
                                                        Ödendi İşaretle
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <PaymentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPayments}
            />
        </div>
    );
};
