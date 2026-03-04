import { useEffect, useState } from 'react';
import { teamService } from '../services/teamService';
import type { Team } from '../types/team';
import { Target, Users, UserPlus } from 'lucide-react';
import { TeamFormModal } from '../components/TeamFormModal';
import { TeamDetailModal } from '../components/TeamDetailModal';
import { CoachFormModal } from '../components/CoachFormModal';

export const Teams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    const fetchTeams = async () => {
        try {
            const data = await teamService.getAllTeams();
            setTeams(data);
        } catch (error) {
            console.error('Failed to fetch teams', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Target size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Takımlar ve Branşlar</h1>
                            <p className="text-sm text-gray-500">Spor kulübündeki mevcut branşları ve kayıtlı takımları izleyin.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 btn bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm" onClick={() => setIsCoachModalOpen(true)}>
                            <UserPlus size={16} />
                            <span>Yeni Antrenör Ekle</span>
                        </button>
                        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                            <span>Yeni Takım Oluştur</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : teams.length === 0 ? (
                        <div className="col-span-full p-12 bg-white rounded-xl shadow-sm text-center text-gray-500 flex flex-col items-center">
                            <Target size={48} className="text-gray-300 mb-4" />
                            <p>Herhangi bir takım kaydı bulunamadı.</p>
                        </div>
                    ) : (
                        teams.map((team) => (
                            <div key={team.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                <div className="p-5 border-b border-gray-50 flex items-start justify-between">
                                    <div>
                                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded inline-block mb-2">
                                            {team.branchName || 'Bilinmeyen Branş'}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">Sezon: {team.season}</p>
                                    </div>
                                </div>
                                <div className="p-5 bg-gray-50 flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-medium text-gray-500">Antrenör:</span>
                                        <span className="text-sm font-semibold text-gray-800">{team.coachName || 'Atanmadı'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary-600">
                                        <Users size={16} />
                                        <span className="text-sm font-medium">{team.athleteCount || 0} Sporcu</span>
                                    </div>
                                </div>
                                <div className="bg-white p-3 border-t border-gray-100 text-center">
                                    <button
                                        onClick={() => setSelectedTeam(team)}
                                        className="text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">Yönet</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <TeamFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchTeams();
                    setIsModalOpen(false);
                }}
            />

            <TeamDetailModal
                isOpen={!!selectedTeam}
                onClose={() => setSelectedTeam(null)}
                team={selectedTeam}
                onRefresh={fetchTeams}
            />

            <CoachFormModal
                isOpen={isCoachModalOpen}
                onClose={() => setIsCoachModalOpen(false)}
                onSuccess={() => {
                    setIsCoachModalOpen(false);
                    // No need to refresh teams specifically for an added coach, it will show up in the dropdowns lazily when opened
                }}
            />
        </div>
    );
};
