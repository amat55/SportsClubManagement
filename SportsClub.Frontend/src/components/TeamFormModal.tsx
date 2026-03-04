import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal } from './ui/Modal';
import { teamService } from '../services/teamService';
import type { CreateTeamDto, Branch } from '../types/team';

interface TeamFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const schema = yup.object().shape({
    name: yup.string().required('Takım adı zorunludur'),
    branchId: yup.string().required('Branş seçimi zorunludur'),
    coachId: yup.string().optional().nullable().transform((v) => v === '' ? null : v),
    season: yup.string().required('Sezon bilgisi zorunludur (Örn: 2024-2025)'),
});

export const TeamFormModal = ({ isOpen, onClose, onSuccess }: TeamFormModalProps) => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreateTeamDto>({
        resolver: yupResolver(schema) as any,
    });

    useEffect(() => {
        if (isOpen) {
            setNotification(null);
            teamService.getAllBranches().then(setBranches).catch(console.error);
        }
    }, [isOpen]);

    const onSubmit = async (data: CreateTeamDto) => {
        setNotification(null);
        try {
            const payload: Record<string, any> = { ...data };
            if (!payload.coachId) {
                delete payload.coachId;
            }

            await teamService.createTeam(payload as CreateTeamDto);
            setNotification({ type: 'success', message: 'Takım başarıyla oluşturuldu!' });
            setTimeout(() => {
                reset();
                onSuccess();
            }, 1000);
        } catch (error) {
            console.error('Team creation failed', error);
            setNotification({ type: 'error', message: 'Takım oluşturulurken bir hata meydana geldi.' });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Takım Oluştur">
            {notification && (
                <div className={`p-3 mb-4 rounded-lg text-sm border ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {notification.message}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Takım Adı <span className="text-red-500">*</span></label>
                    <input type="text" {...register('name')} className="input-field" placeholder="Örn: U14 Yıldız Erkekler" />
                    <p className="text-xs text-red-500 mt-1">{errors.name?.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branş <span className="text-red-500">*</span></label>
                        <select {...register('branchId')} className="input-field">
                            <option value="">Seçiniz</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-red-500 mt-1">{errors.branchId?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sezon <span className="text-red-500">*</span></label>
                        <input type="text" {...register('season')} className="input-field" placeholder="Örn: 2024-2025" />
                        <p className="text-xs text-red-500 mt-1">{errors.season?.message}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Antrenör (ID)</label>
                    <input type="text" {...register('coachId')} className="input-field" placeholder="Geçici Olarak Boş Bırakılabilir (Guid)" />
                    <p className="text-xs text-red-500 mt-1">{errors.coachId?.message}</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <button type="button" onClick={onClose} className="btn-secondary">
                        İptal
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
                        {isSubmitting ? 'Oluşturuluyor...' : 'Takımı Kaydet'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
