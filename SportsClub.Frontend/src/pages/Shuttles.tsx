import { useEffect, useState } from 'react';
import { shuttleService } from '../services/shuttleService';
import type { Shuttle } from '../types/shuttle';
import { Bus, Users, Phone, UserPlus, Plus } from 'lucide-react';
import { ShuttleFormModal } from '../components/ShuttleFormModal';
import { ShuttleDetailModal } from '../components/ShuttleDetailModal';

export const Shuttles = () => {
    const [shuttles, setShuttles] = useState<Shuttle[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedShuttle, setSelectedShuttle] = useState<Shuttle | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchShuttles = async () => {
        try {
            const data = await shuttleService.getAllShuttles();
            setShuttles(data);
        } catch (error) {
            console.error('Failed to fetch shuttles', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShuttles();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                            <Bus size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Servis (Shuttle) Yönetimi</h1>
                            <p className="text-sm text-gray-500">Kulüp öğrenci servislerini, kapasitelerini ve kayıtlı öğrencileri yönetin.</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 btn bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={16} />
                        <span>Yeni Servis Ekle</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shuttles.length === 0 ? (
                        <div className="col-span-full p-12 bg-white rounded-xl shadow-sm text-center text-gray-500 flex flex-col items-center">
                            <Bus size={48} className="text-gray-300 mb-4" />
                            <p>Sistemde henüz kayıtlı bir öğrenci servisi bulunmuyor.</p>
                        </div>
                    ) : (
                        shuttles.map(shuttle => {
                            const availability = shuttle.capacity - shuttle.enrolledStudentCount;
                            const isFull = availability <= 0;

                            return (
                                <div key={shuttle.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-5 border-b border-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{shuttle.routeName}</h3>
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-700">
                                                {shuttle.licensePlate}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-4">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="p-1.5 bg-gray-50 rounded-md text-gray-400"><UserPlus size={16} /></div>
                                            <div>
                                                <div className="text-xs text-gray-400">Şoför</div>
                                                <div className="font-medium text-gray-900">{shuttle.driverName}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="p-1.5 bg-gray-50 rounded-md text-gray-400"><Phone size={16} /></div>
                                            <div>
                                                <div className="text-xs text-gray-400">İletişim</div>
                                                <div className="font-medium text-gray-900">{shuttle.driverPhone}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className={isFull ? 'text-red-500' : 'text-green-600'} />
                                            <span className="text-sm font-medium text-gray-700">
                                                {shuttle.enrolledStudentCount} / {shuttle.capacity}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setSelectedShuttle(shuttle)}
                                            className="text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
                                        >
                                            Yönet &rarr;
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <ShuttleFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    fetchShuttles();
                }}
            />

            <ShuttleDetailModal
                isOpen={!!selectedShuttle}
                onClose={() => setSelectedShuttle(null)}
                shuttle={selectedShuttle}
                onRefresh={fetchShuttles}
            />
        </div>
    );
};
