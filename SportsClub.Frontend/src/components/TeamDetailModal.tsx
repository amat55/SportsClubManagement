import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import type { Team } from '../types/team';
import type { User } from '../types/user';
import type { Athlete } from '../types/athlete';
import { Users, Info, Calendar } from 'lucide-react';
import { userService } from '../services/userService';
import { teamService } from '../services/teamService';
import { athleteService } from '../services/athleteService';

interface TeamDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    team: Team | null;
    onRefresh: () => void;
}

export const TeamDetailModal = ({ isOpen, onClose, team, onRefresh }: TeamDetailModalProps) => {
    const [coaches, setCoaches] = useState<User[]>([]);
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [selectedCoachId, setSelectedCoachId] = useState<string>('');
    const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');
    const [isAssigningCoach, setIsAssigningCoach] = useState(false);
    const [isAddingAthlete, setIsAddingAthlete] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        if (isOpen && team) {
            userService.getCoaches().then(setCoaches).catch(console.error);
            athleteService.getAllAthletes()
                .then(data => setAthletes(data.filter(a => a.isActive))) // Sadece aktifler
                .catch(console.error);
        }
    }, [isOpen, team]);

    useEffect(() => {
        if (!isOpen) {
            setNotification(null);
            setSelectedAthleteId('');
            setSelectedCoachId('');
        }
    }, [isOpen]);

    if (!team) return null;

    const handleAssignCoach = async () => {
        setNotification(null);
        if (!selectedCoachId) return;
        setIsAssigningCoach(true);
        try {
            await teamService.assignCoach(team.id, selectedCoachId);
            setNotification({ type: 'success', message: 'Antrenör başarıyla atandı!' });
            onRefresh();

            setTimeout(() => onClose(), 1500);
        } catch (error) {
            console.error(error);
            setNotification({ type: 'error', message: 'Antrenör atanırken bir hata oluştu.' });
        } finally {
            setIsAssigningCoach(false);
            setSelectedCoachId('');
        }
    };

    const handleAddAthlete = async () => {
        setNotification(null);
        if (!selectedAthleteId) return;
        setIsAddingAthlete(true);
        try {
            await teamService.addAthleteToTeam(team.id, selectedAthleteId);
            setNotification({ type: 'success', message: 'Sporcu takıma eklendi!' });
            onRefresh();

            setTimeout(() => onClose(), 1500);
        } catch (error) {
            console.error(error);
            setNotification({ type: 'error', message: 'Sporcu bu takıma atanmış olabilir veya bir ağ hatası oluştu.' });
        } finally {
            setIsAddingAthlete(false);
            setSelectedAthleteId('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Takım Yönetimi">
            <div className="space-y-6">
                {notification && (
                    <div className={`p-3 rounded-lg text-sm border ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {notification.message}
                    </div>
                )}
                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl">
                        {team.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                        <p className="text-gray-500 font-medium">{team.branchName}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users size={20} /></div>
                        <div>
                            <span className="text-xs text-gray-500 block">Kayıtlı Sporcu</span>
                            <span className="font-semibold text-gray-900">{team.athleteCount || 0} Kişi</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Info size={20} /></div>
                        <div>
                            <span className="text-xs text-gray-500 block">Durum</span>
                            <span className="font-semibold text-gray-900">{team.isActive ? 'Aktif' : 'Pasif'}</span>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-100 rounded-xl p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Calendar size={18} className="text-blue-500" />
                        Antrenör Ataması
                    </h4>
                    <div className="mb-2">
                        <p className="text-sm text-gray-600">Mevcut Antrenör: <span className="font-bold text-gray-900">{team.coachName || 'Atanmamış'}</span></p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="input-field flex-1"
                            value={selectedCoachId}
                            onChange={(e) => setSelectedCoachId(e.target.value)}
                        >
                            <option value="">Yeni antrenör seçin...</option>
                            {coaches.map(coach => (
                                <option key={coach.id} value={coach.id}>{coach.firstName} {coach.lastName}</option>
                            ))}
                        </select>
                        <button
                            disabled={!selectedCoachId || isAssigningCoach}
                            onClick={handleAssignCoach}
                            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:bg-gray-300 font-medium text-sm transition-colors"
                        >
                            Ata
                        </button>
                    </div>
                </div>

                <div className="border border-gray-100 rounded-xl p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Users size={18} className="text-blue-500" />
                        Sporcu Ekleme
                    </h4>
                    <div className="flex gap-2">
                        <select
                            className="input-field flex-1"
                            value={selectedAthleteId}
                            onChange={(e) => setSelectedAthleteId(e.target.value)}
                        >
                            <option value="">Eklemek için sporcu seçin...</option>
                            {athletes.map(athlete => (
                                <option key={athlete.id} value={athlete.id}>{athlete.firstName} {athlete.lastName}</option>
                            ))}
                        </select>
                        <button
                            disabled={!selectedAthleteId || isAddingAthlete}
                            onClick={handleAddAthlete}
                            className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 disabled:bg-gray-300 font-medium text-sm transition-colors"
                        >
                            Ekle
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Sporcuları çıkarmak için detaylı kadro sayfasına gidin veya sporcu profiline erişin.</p>
                </div>

                <div className="flex justify-end pt-2">
                    <button onClick={onClose} className="btn-secondary">Kapat</button>
                </div>
            </div>
        </Modal>
    );
};
