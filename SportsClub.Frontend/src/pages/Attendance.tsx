import { useEffect, useState } from 'react';
import { trainingService } from '../services/trainingService';
import { attendanceService } from '../services/attendanceService';
import { athleteService } from '../services/athleteService';
import type { TrainingSession } from '../types/training';
import type { AttendanceFile } from '../types/attendance';
import type { Athlete } from '../types/athlete';

import { CalendarCheck, CheckSquare, Square, ChevronLeft } from 'lucide-react';
import { TrainingFormModal } from '../components/TrainingFormModal';

export const Attendance = () => {
    const [sessions, setSessions] = useState<TrainingSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);

    const [sessionAthletes, setSessionAthletes] = useState<Athlete[]>([]);
    const [attendances, setAttendances] = useState<AttendanceFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchInitialData = async () => {
        try {
            const sessionsData = await trainingService.getAllSessions();
            setSessions(sessionsData);
        } catch (error) {
            console.error('Failed to load sessions', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 1. Fetch available teams and sessions
    useEffect(() => {
        fetchInitialData();
    }, []);

    // 2. Fetch athletes and attendance for the selected session
    useEffect(() => {
        if (!selectedSession) return;

        const fetchSessionDetails = async () => {
            setIsLoading(true);
            try {
                const [athletesData, attendancesData] = await Promise.all([
                    athleteService.getAllAthletes(), // Idealde getAthletesByTeam(selectedSession.teamId) olmalı
                    attendanceService.getBySession(selectedSession.id)
                ]);

                // For now, filter athletes locally simply since we don't have a team-specific athlete endpoint yet 
                // Note: Realistically, the backend should expose this.
                setSessionAthletes(athletesData);
                setAttendances(attendancesData);
            } catch (error) {
                console.error('Failed to load session details', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessionDetails();
    }, [selectedSession]);

    const toggleAttendance = async (athleteId: string, currentStatus: boolean) => {
        if (!selectedSession) return;
        try {
            await attendanceService.takeOrUpdate({
                trainingSessionId: selectedSession.id,
                athleteId: athleteId,
                isPresent: !currentStatus,
                excuseNote: ''
            });
            // Update local state to reflect UI change immediately
            setAttendances(prev => {
                const existing = prev.find(a => a.athleteId === athleteId);
                if (existing) {
                    return prev.map(a => a.athleteId === athleteId ? { ...a, isPresent: !currentStatus } : a);
                } else {
                    // If it was the first time marking
                    return [...prev, {
                        id: 'temp-id',
                        trainingSessionId: selectedSession.id,
                        trainingSessionTitle: selectedSession.title,
                        athleteId: athleteId,
                        athleteFullName: 'Unknown',
                        isPresent: !currentStatus,
                        excuseNote: ''
                    }];
                }
            });
        } catch (error) {
            console.error('Error toggling attendance', error);
            alert('Yoklama güncellenemedi.');
        }
    };

    if (isLoading && !sessions.length) {
        return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        {selectedSession && (
                            <button
                                onClick={() => setSelectedSession(null)}
                                className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                                title="Geri Dön"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <CalendarCheck size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Yoklama Yönetimi</h1>
                            <p className="text-sm text-gray-500">
                                {selectedSession
                                    ? `${selectedSession.title} - ${new Date(selectedSession.startTime).toLocaleDateString('tr-TR')}`
                                    : 'Antrenman programı seçerek yoklama alabilirsiniz.'}
                            </p>
                        </div>
                    </div>
                    {!selectedSession && (
                        <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                            <span>Yeni Antrenman Ekle</span>
                        </button>
                    )}
                </div>

                {/* View 1: Session Selector */}
                {!selectedSession && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessions.length === 0 ? (
                            <div className="col-span-full p-12 bg-white rounded-xl shadow-sm text-center text-gray-500">
                                Sistemde kayıtlı bir antrenman programı bulunmuyor.
                            </div>
                        ) : (
                            sessions.map(session => (
                                <div key={session.id} onClick={() => setSelectedSession(session)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-purple-200 transition-all">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{session.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{session.teamName || 'Bilinmeyen Takım'}</p>

                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span className="bg-gray-100 px-2 py-1 rounded">
                                            {new Date(session.startTime).toLocaleDateString('tr-TR')} {new Date(session.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span>{session.location}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* View 2: Attendance Taker */}
                {selectedSession && (
                    <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-semibold text-gray-800">Takım Sporcuları</h3>
                            <p className="text-sm text-gray-500">Listeden öğrencilerin geliş durumlarını anlık olarak işaretleyin.</p>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {sessionAthletes.length === 0 && !isLoading ? (
                                <div className="p-8 text-center text-gray-500">Bu takıma kayıtlı sporcu bulunamadı.</div>
                            ) : (
                                sessionAthletes.map(athlete => {
                                    const attendanceRecord = attendances.find(a => a.athleteId === athlete.id);
                                    const isPresent = attendanceRecord?.isPresent || false;

                                    return (
                                        <div key={athlete.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                                                    {athlete.firstName[0]}{athlete.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{athlete.firstName} {athlete.lastName}</p>
                                                    <p className="text-xs text-gray-500">Doğum: {new Date(athlete.dateOfBirth).getFullYear()}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleAttendance(athlete.id, isPresent)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isPresent
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {isPresent ? <CheckSquare size={18} /> : <Square size={18} />}
                                                {isPresent ? 'Katıldı' : 'Katılmadı'}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

            </div>

            <TrainingFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    fetchInitialData();
                    setIsCreateModalOpen(false);
                }}
            />
        </div>
    );
};
