import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { Modal } from './ui/Modal';
import api from '../services/api';

interface ShuttleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const schema = yup.object().shape({
    licensePlate: yup.string().required('Plaka zorunludur'),
    driverName: yup.string().required('Şoför adı zorunludur'),
    driverPhone: yup.string().required('Şoför telefonu zorunludur'),
    routeName: yup.string().required('Güzergah zorunludur'),
    capacity: yup.number().typeError('Geçerli bir kapasite girin').required('Kapasite zorunludur').min(1, 'En az 1 kişi'),
});

export const ShuttleFormModal = ({ isOpen, onClose, onSuccess }: ShuttleFormModalProps) => {
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<any>({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        if (isOpen) setNotification(null);
    }, [isOpen]);

    const onSubmit = async (data: any) => {
        setNotification(null);
        try {
            await api.post('/shuttles', data);
            setNotification({ type: 'success', message: 'Servis başarıyla oluşturuldu!' });

            setTimeout(() => {
                reset();
                onSuccess();
            }, 1000);
        } catch (error) {
            console.error('Shuttle creation failed', error);
            setNotification({ type: 'error', message: 'Servis kaydedilirken bir hata oluştu.' });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Servis Ekle">
            {notification && (
                <div className={`p-3 mb-4 rounded-lg text-sm border ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {notification.message}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Araç Plakası <span className="text-red-500">*</span></label>
                        <input type="text" {...register('licensePlate')} className="input-field" placeholder="Örn: 34 ABC 123" />
                        <p className="text-xs text-red-500 mt-1">{errors.licensePlate?.message as string}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Şoför Adı <span className="text-red-500">*</span></label>
                        <input type="text" {...register('driverName')} className="input-field" placeholder="Örn: Ahmet Yılmaz" />
                        <p className="text-xs text-red-500 mt-1">{errors.driverName?.message as string}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Şoför Telefonu <span className="text-red-500">*</span></label>
                        <input type="text" {...register('driverPhone')} className="input-field" placeholder="Örn: 0555 123 4567" />
                        <p className="text-xs text-red-500 mt-1">{errors.driverPhone?.message as string}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kapasite <span className="text-red-500">*</span></label>
                        <input type="number" {...register('capacity')} className="input-field" placeholder="Koltuk Sayısı" />
                        <p className="text-xs text-red-500 mt-1">{errors.capacity?.message as string}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Güzergah Bilgisi <span className="text-red-500">*</span></label>
                    <textarea {...register('routeName')} className="input-field" rows={2} placeholder="Örn: Kadıköy - Ataşehir Ring"></textarea>
                    <p className="text-xs text-red-500 mt-1">{errors.routeName?.message as string}</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <button type="button" onClick={onClose} className="btn-secondary">İptal</button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500">
                        {isSubmitting ? 'Kaydediliyor...' : 'Servisi Kaydet'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
