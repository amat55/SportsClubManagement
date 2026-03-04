import { useEffect, useState } from 'react';
import { athleteService } from '../services/athleteService';
import type { Athlete } from '../types/athlete';
import { Users, UserPlus, FileText, CheckCircle, XCircle } from 'lucide-react';
import { AthleteFormModal } from '../components/AthleteFormModal';
import { AthleteDetailModal } from '../components/AthleteDetailModal';

export const Athletes = () => {
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

    const fetchAthletes = async () => {
        try {
            const data = await athleteService.getAllAthletes();
            setAthletes(data);
        } catch (error) {
            console.error('Failed to fetch athletes', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAthletes();
    }, []);

    const handleToggleStatus = async (id: string) => {
        try {
            await athleteService.toggleStatus(id);
            await fetchAthletes(); // Refresh list
        } catch (error) {
            console.error('Failed to toggle status', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Sporcu Yönetimi</h1>
                            <p className="text-sm text-gray-500">Tüm kulüp sporcularını buradan listeleyip yönetebilirsiniz.</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 btn-primary" onClick={() => setIsModalOpen(true)}>
                        <UserPlus size={18} />
                        <span>Yeni Sporcu Ekle</span>
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : athletes.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <Users size={48} className="text-gray-300 mb-4" />
                            <p>Sistemde henüz kayıtlı bir sporcu bulunmuyor.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sporcu Bilgisi</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim / Veli</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {athletes.map((athlete) => (
                                        <tr key={athlete.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                                                        {athlete.firstName[0]}{athlete.lastName[0]}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{athlete.firstName} {athlete.lastName}</div>
                                                        <div className="text-xs text-gray-500">Doğum: {athlete.dateOfBirth ? new Date(athlete.dateOfBirth).toLocaleDateString('tr-TR') : 'Belirtilmedi'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{athlete.motherName} - {athlete.fatherName}</div>
                                                <div className="text-xs text-gray-500">{athlete.phoneNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${athlete.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {athlete.isActive ? 'Aktif' : 'Pasif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleToggleStatus(athlete.id)} className="text-gray-400 hover:text-blue-500 transition-colors" title="Durumu Değiştir">
                                                        {athlete.isActive ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                                    </button>
                                                    <button onClick={() => setSelectedAthlete(athlete)} className="text-gray-400 hover:text-primary-500 transition-colors" title="Detayları Görüntüle">
                                                        <FileText size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <AthleteFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchAthletes();
                    setIsModalOpen(false);
                }}
            />
            <AthleteDetailModal
                isOpen={!!selectedAthlete}
                onClose={() => setSelectedAthlete(null)}
                athlete={selectedAthlete}
            />
        </div>
    );
};
