import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import type { Shuttle } from '../types/shuttle';
import type { Athlete } from '../types/athlete';
import { Users, Info, MapPin } from 'lucide-react';
import { athleteService } from '../services/athleteService';
import { shuttleService } from '../services/shuttleService';

interface ShuttleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    shuttle: Shuttle | null;
    onRefresh: () => void;
}

export const ShuttleDetailModal = ({ isOpen, onClose, shuttle, onRefresh }: ShuttleDetailModalProps) => {
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');
    const [pickUpPoint, setPickUpPoint] = useState<string>('');
    const [isAssigning, setIsAssigning] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        if (isOpen && shuttle) {
            athleteService.getAllAthletes()
                .then(data => setAthletes(data.filter(a => a.isActive))) // Sadece aktifleri filtrele
                .catch(console.error);
        }
    }, [isOpen, shuttle]);

    // Modalı temizle
    useEffect(() => {
        if (!isOpen) {
            setNotification(null);
            setSelectedAthleteId('');
            setPickUpPoint('');
        }
    }, [isOpen]);

    if (!shuttle) return null;

    const handleAssignAthlete = async () => {
        setNotification(null);
        if (!selectedAthleteId || !pickUpPoint) {
            setNotification({ type: 'error', message: 'Sporcu ve Durak noktası seçimi zorunludur.' });
            return;
        }

        setIsAssigning(true);
        try {
            await shuttleService.enrollStudent(shuttle.id, {
                athleteId: selectedAthleteId,
                pickUpDropOffPoint: pickUpPoint
            });
            setNotification({ type: 'success', message: 'Sporcu başarıyla servise eklendi!' });
            onRefresh();

            // Başarılı olduğunda 1.5 sn sonra kapat
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (error) {
            console.error(error);
            setNotification({ type: 'error', message: 'Sporcu zaten bu serviste olabilir veya kapasite dolu olabilir.' });
        } finally {
            setIsAssigning(false);
            setSelectedAthleteId('');
            setPickUpPoint('');
        }
    };

    const isFull = shuttle.enrolledStudentCount >= shuttle.capacity;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Servis İçeriği Yönetimi">
            <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <div className="h-16 w-16 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-2xl">
                        {shuttle.licensePlate.substring(0, 2)}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{shuttle.routeName}</h3>
                        <p className="text-gray-500 font-medium">{shuttle.licensePlate}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Users size={20} /></div>
                        <div>
                            <span className="text-xs text-gray-500 block">Doluluk</span>
                            <span className={`font-semibold ${isFull ? 'text-red-500' : 'text-gray-900'}`}>
                                {shuttle.enrolledStudentCount} / {shuttle.capacity}
                            </span>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Info size={20} /></div>
                        <div>
                            <span className="text-xs text-gray-500 block">Şoför</span>
                            <span className="font-semibold text-gray-900">{shuttle.driverName}</span>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-100 rounded-xl p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <MapPin size={18} className="text-orange-500" />
                        Servise Öğrenci Ekle
                    </h4>

                    {notification && (
                        <div className={`p-3 mb-4 rounded-lg text-sm border ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                            {notification.message}
                        </div>
                    )}

                    {isFull ? (
                        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                            <strong>Uyarı:</strong> Bu servisin kapasitesi dolmuştur, yeni öğrenci ekleyemezsiniz. Öğrenci çıkarmak için detaylı listeyi kullanın.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <select
                                className="input-field w-full"
                                value={selectedAthleteId}
                                onChange={(e) => setSelectedAthleteId(e.target.value)}
                            >
                                <option value="">Eklemek için sporcu seçin...</option>
                                {athletes.map(athlete => (
                                    <option key={athlete.id} value={athlete.id}>{athlete.firstName} {athlete.lastName}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                className="input-field w-full"
                                placeholder="Alınacak/Bırakılacak Durak (Örn: Ataşehir Migros Önü)"
                                value={pickUpPoint}
                                onChange={(e) => setPickUpPoint(e.target.value)}
                            />

                            <button
                                disabled={!selectedAthleteId || !pickUpPoint || isAssigning}
                                onClick={handleAssignAthlete}
                                className="w-full bg-orange-600 text-white rounded-lg px-4 py-2 hover:bg-orange-700 disabled:bg-gray-300 font-medium text-sm transition-colors"
                            >
                                {isAssigning ? 'Ekleniyor...' : 'Sporcuyu Servise Kaydet'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-2">
                    <button onClick={onClose} className="btn-secondary">Kapat</button>
                </div>
            </div>
        </Modal>
    );
};
