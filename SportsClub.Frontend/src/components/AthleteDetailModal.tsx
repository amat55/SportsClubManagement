import { Modal } from './ui/Modal';
import type { Athlete } from '../types/athlete';

interface AthleteDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    athlete: Athlete | null;
}

export const AthleteDetailModal = ({ isOpen, onClose, athlete }: AthleteDetailModalProps) => {
    if (!athlete) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Sporcu Detayları">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                    <div>
                        <span className="text-xs text-gray-500 block">Ad Soyad</span>
                        <span className="font-semibold text-gray-900">{athlete.firstName} {athlete.lastName}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Kayıt Tarihi</span>
                        <span className="font-semibold text-gray-900">{new Date(athlete.registrationDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">İletişim (Telefon)</span>
                        <span className="font-semibold text-gray-900">{athlete.phoneNumber}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Doğum Tarihi</span>
                        <span className="font-semibold text-gray-900">{new Date(athlete.dateOfBirth).toLocaleDateString('tr-TR')}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                    <div>
                        <span className="text-xs text-gray-500 block">Boy</span>
                        <span className="font-semibold text-gray-900">{athlete.height} cm</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Kilo</span>
                        <span className="font-semibold text-gray-900">{athlete.weight} kg</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Kan Grubu</span>
                        <span className="font-semibold text-gray-900">{athlete.bloodType}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                    <div>
                        <span className="text-xs text-gray-500 block">Adres</span>
                        <span className="text-sm font-medium text-gray-900">{athlete.address || 'Belirtilmedi'}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Ebeveyn Bilgisi</span>
                        <span className="text-sm font-medium text-gray-900">Anne: {athlete.motherName} / Baba: {athlete.fatherName}</span>
                    </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-sm font-bold text-red-800 mb-2">Acil Durum İletişimi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <span className="text-xs text-red-600 block">Kişi Adı</span>
                            <span className="font-semibold text-red-900">{athlete.emergencyContactName || 'Belirtilmedi'}</span>
                        </div>
                        <div>
                            <span className="text-xs text-red-600 block">Yakınlığı</span>
                            <span className="font-semibold text-red-900">{athlete.emergencyContactRelation || '-'}</span>
                        </div>
                        <div>
                            <span className="text-xs text-red-600 block">Telefon</span>
                            <span className="font-semibold text-red-900">{athlete.emergencyContactPhone || '-'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button onClick={onClose} className="btn-secondary">Kapat</button>
                </div>
            </div>
        </Modal>
    );
};
