import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { reportService, type DashboardSummary } from '../services/reportService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Target, CreditCard, Wallet } from 'lucide-react';

export const Dashboard = () => {
    const { user } = useAuthStore();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await reportService.getDashboardSummary();
                setSummary(data);
            } catch (error) {
                console.error("Dashboard özeti alınamadı", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const COLORS = ['#10B981', '#F59E0B']; // Green and Amber

    const financialData = summary ? [
        { name: 'Tahsil Edilen', value: summary.totalRevenue },
        { name: 'Bekleyen', value: summary.pendingPayments }
    ] : [];

    const statsData = summary ? [
        { name: 'Sporcular', count: summary.totalAthletes },
        { name: 'Takımlar', count: summary.activeTeams }
    ] : [];

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">

                <div className="card mb-6 bg-gradient-to-r from-primary-50 to-white shadow-sm border border-primary-100 p-6 rounded-xl flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Hoş Geldiniz, {user?.firstName} {user?.lastName}!</h2>
                        <p className="text-gray-600 mt-2 font-medium">Aktif Rolleriniz: <span className="text-primary-600 bg-primary-100 px-2 py-1 rounded text-xs">{(user?.roles || []).join(', ')}</span></p>
                    </div>
                    <div className="hidden md:block">
                        <img src="https://illustrations.popsy.co/amber/success.svg" alt="Welcome" className="h-24" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
                ) : summary ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Toplam Sporcu</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{summary.totalAthletes}</h3>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Target size={24} /></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Aktif Takımlar</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{summary.activeTeams}</h3>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Wallet size={24} /></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Toplam Gelir</p>
                                    <h3 className="text-2xl font-bold text-gray-900">₺{summary.totalRevenue.toLocaleString('tr-TR')}</h3>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
                                <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><CreditCard size={24} /></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Bekleyen Tahsilat</p>
                                    <h3 className="text-2xl font-bold text-gray-900">₺{summary.pendingPayments.toLocaleString('tr-TR')}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">Genel Dağılım</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={statsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={50} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                                <h3 className="text-lg font-bold text-gray-800 w-full mb-2">Finansal Durum (Ödemeler)</h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={financialData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                            >
                                                {financialData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => `₺${(value || 0).toLocaleString('tr-TR')}`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500 mt-10">Veri bulunamadı.</div>
                )}
            </div>
        </div>
    );
};
