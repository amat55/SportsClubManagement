import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal } from './ui/Modal';
import { trainingService } from '../services/trainingService';
import { teamService } from '../services/teamService';
import type { CreateTrainingSessionDto } from '../types/training';
import type { Team } from '../types/team';

interface TrainingFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const schema = yup.object().shape({
    title: yup.string().required('Antrenman başlığı zorunludur'),
    description: yup.string().required('Açıklama zorunludur'),
    teamId: yup.string().required('Takım seçimi zorunludur'),
    coachId: yup.string().optional().nullable().transform((v) => v === '' ? null : v),
    startTime: yup.string().required('Başlangıç tarihi ve saati zorunludur'),
    endTime: yup.string().required('Bitiş tarihi ve saati zorunludur'),
    location: yup.string().required('Konum zorunludur')
});

export const TrainingFormModal = ({ isOpen, onClose, onSuccess }: TrainingFormModalProps) => {
    const [teams, setTeams] = useState<Team[]>([]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreateTrainingSessionDto>({
        resolver: yupResolver(schema) as any,
    });

    useEffect(() => {
        if (isOpen) {
            teamService.getAllTeams().then(setTeams).catch(console.error);
        }
    }, [isOpen]);

    const onSubmit = async (data: CreateTrainingSessionDto) => {
        try {
            const payload = { ...data };
            if (!payload.coachId) {
                payload.coachId = undefined;
            }

            // Ensure datetime is converted to UTC to avoid postgresql errors
            payload.startTime = new Date(payload.startTime).toISOString();
            payload.endTime = new Date(payload.endTime).toISOString();

            await trainingService.createSession(payload);
            reset();
            onSuccess();
        } catch (error) {
            console.error('Training creation failed', error);
            alert('Antrenman oluşturulurken bir hata meydana geldi.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Antrenman Oluştur">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık <span className="text-red-500">*</span></label>
                    <input type="text" {...register('title')} className="input-field" placeholder="Örn: Hafta Sonu Taktik İdmanı" />
                    <p className="text-xs text-red-500 mt-1">{errors.title?.message}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama <span className="text-red-500">*</span></label>
                    <textarea {...register('description')} className="input-field" rows={3} placeholder="Antrenman detaylarını girin" />
                    <p className="text-xs text-red-500 mt-1">{errors.description?.message}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Takım <span className="text-red-500">*</span></label>
                    <select {...register('teamId')} className="input-field">
                        <option value="">Seçiniz</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>{team.name} ({team.branchName})</option>
                        ))}
                    </select>
                    <p className="text-xs text-red-500 mt-1">{errors.teamId?.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Başlama Zamanı <span className="text-red-500">*</span></label>
                        <input type="datetime-local" {...register('startTime')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.startTime?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Zamanı <span className="text-red-500">*</span></label>
                        <input type="datetime-local" {...register('endTime')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.endTime?.message}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mekan/Tesis <span className="text-red-500">*</span></label>
                    <input type="text" {...register('location')} className="input-field" placeholder="Örn: 1 Nolu Açık Saha" />
                    <p className="text-xs text-red-500 mt-1">{errors.location?.message}</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <button type="button" onClick={onClose} className="btn-secondary">İptal</button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? 'Oluşturuluyor...' : 'Antrenmanı Kaydet'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
