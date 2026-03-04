import { useEffect, useState } from 'react';
import { medicalService } from '../services/medicalService';
import { athleteService } from '../services/athleteService';
import type { PhysicalMeasurement } from '../types/medical';
import type { Athlete } from '../types/athlete';
import { Activity, Ruler, Weight, UserCircle, Plus } from 'lucide-react';
import { MedicalFormModal } from '../components/MedicalFormModal';

export const Medical = () => {
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
    const [measurements, setMeasurements] = useState<PhysicalMeasurement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);

    useEffect(() => {
        const fetchAthletes = async () => {
            try {
                const data = await athleteService.getAllAthletes();
                setAthletes(data);
            } catch (error) {
                console.error('Failed to load athletes', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAthletes();
    }, []);

    useEffect(() => {
        if (!selectedAthlete) return;
        const fetchMeasurements = async () => {
            try {
                const data = await medicalService.getMeasurementsByAthlete(selectedAthlete.id);
                setMeasurements(data);
            } catch (error) {
                console.error('Failed to load measurements', error);
            }
        };
        fetchMeasurements();
    }, [selectedAthlete]);

    const refreshMeasurements = async () => {
        if (!selectedAthlete) return;
        try {
            const data = await medicalService.getMeasurementsByAthlete(selectedAthlete.id);
            setMeasurements(data);
        } catch (error) {
            console.error('Failed to refresh measurements', error);
        }
    };

    if (isLoading && !athletes.length) {
        return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-teal-100 text-teal-600 rounded-lg">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Fiziksel Gelişim Takibi</h1>
                            <p className="text-sm text-gray-500">Sporcuların dönemsel ölçümlerini ve fiziksel gelişimini izleyin.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar: Athlete List */}
                    <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex flex-col">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-semibold text-gray-800">Sporcular</h3>
                        </div>
                        <div className="overflow-y-auto flex-1 p-2">
                            {athletes.map(athlete => (
                                <button
                                    key={athlete.id}
                                    onClick={() => setSelectedAthlete(athlete)}
                                    className={`w-full text-left p-3 rounded-lg mb-1 flex items-center gap-3 transition-colors ${selectedAthlete?.id === athlete.id ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'hover:bg-gray-50'}`}
                                >
                                    <UserCircle size={20} className={selectedAthlete?.id === athlete.id ? 'text-teal-500' : 'text-gray-400'} />
                                    <div className="truncate">
                                        <div className="font-medium text-sm">{athlete.firstName} {athlete.lastName}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Area: Measurement History */}
                    <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        {!selectedAthlete ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                <Activity size={48} className="text-gray-200 mb-4" />
                                <p>Gelişimini görüntülemek için sol taraftan bir sporcu seçin.</p>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedAthlete.firstName} {selectedAthlete.lastName}</h2>
                                        <p className="text-sm text-gray-500">Ölçüm Geçmişi ve Analiz</p>
                                    </div>
                                    <button className="flex items-center gap-2 btn bg-teal-600 text-white px-4 py-2 hover:bg-teal-700 rounded-lg text-sm font-medium transition-colors" onClick={() => setIsMeasurementModalOpen(true)}>
                                        <Plus size={16} />
                                        <span>Yeni Ölçüm Gir</span>
                                    </button>
                                </div>

                                {measurements.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        Bu sporcuya ait henüz bir ölçüm kaydı bulunmamaktadır.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {measurements.map(m => (
                                            <div key={m.id} className="border border-gray-100 rounded-lg p-5 flex flex-wrap gap-6 hover:shadow-md transition-shadow">
                                                <div className="w-full md:w-auto min-w-[120px]">
                                                    <div className="text-xs text-gray-500 mb-1">Ölçüm Tarihi</div>
                                                    <div className="font-medium">{new Date(m.measurementDate).toLocaleDateString('tr-TR')}</div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><Ruler size={18} /></div>
                                                    <div>
                                                        <div className="text-xs text-gray-500">Boy</div>
                                                        <div className="font-semibold text-lg">{m.height} <span className="text-sm font-normal text-gray-400">cm</span></div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-full"><Weight size={18} /></div>
                                                    <div>
                                                        <div className="text-xs text-gray-500">Kilo</div>
                                                        <div className="font-semibold text-lg">{m.weight} <span className="text-sm font-normal text-gray-400">kg</span></div>
                                                    </div>
                                                </div>

                                                <div className="hidden md:flex flex-1 justify-end items-center gap-6 text-sm">
                                                    {m.bodyFatPercentage != null && (
                                                        <div className="text-center">
                                                            <div className="text-gray-500 text-xs">Yağ Oranı</div>
                                                            <div className="font-medium">%{m.bodyFatPercentage}</div>
                                                        </div>
                                                    )}
                                                    {m.jumpHeight != null && (
                                                        <div className="text-center">
                                                            <div className="text-gray-500 text-xs">Sıçrama</div>
                                                            <div className="font-medium">{m.jumpHeight} cm</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {selectedAthlete && (
                <MedicalFormModal
                    isOpen={isMeasurementModalOpen}
                    onClose={() => setIsMeasurementModalOpen(false)}
                    onSuccess={() => {
                        setIsMeasurementModalOpen(false);
                        refreshMeasurements();
                    }}
                    athlete={selectedAthlete}
                />
            )}
        </div>
    );
};
