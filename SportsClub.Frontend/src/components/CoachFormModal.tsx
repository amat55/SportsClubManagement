import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { Modal } from './ui/Modal';
import api from '../services/api';

interface CoachFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const schema = yup.object().shape({
    email: yup.string().email('Geçerli bir e-posta giriniz').required('E-posta alanı zorunludur'),
    password: yup.string().required('Şifre alanı zorunludur').min(6, 'Şifre en az 6 karakter olmalıdır'),
    firstName: yup.string().required('Ad alanı zorunludur'),
    lastName: yup.string().required('Soyad alanı zorunludur'),
});

export const CoachFormModal = ({ isOpen, onClose, onSuccess }: CoachFormModalProps) => {
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
            // Coach rolü ile kayıt yapabilmek için AuthController'a istek
            await api.post('/auth/register', {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                role: 'Antrenör'
            });

            setNotification({ type: 'success', message: 'Antrenör başarıyla kaydedildi!' });

            setTimeout(() => {
                reset();
                onSuccess();
            }, 1000);
        } catch (error) {
            console.error('Coach registration failed', error);
            setNotification({ type: 'error', message: 'Antrenör kaydedilirken bir hata oluştu. E-posta kullanımda olabilir.' });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Antrenör Kaydı">
            {notification && (
                <div className={`p-3 mb-4 rounded-lg text-sm border ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {notification.message}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ad <span className="text-red-500">*</span></label>
                        <input type="text" {...register('firstName')} className="input-field" placeholder="Ad" />
                        <p className="text-xs text-red-500 mt-1">{errors.firstName?.message as string}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Soyad <span className="text-red-500">*</span></label>
                        <input type="text" {...register('lastName')} className="input-field" placeholder="Soyad" />
                        <p className="text-xs text-red-500 mt-1">{errors.lastName?.message as string}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi <span className="text-red-500">*</span></label>
                    <input type="email" {...register('email')} className="input-field" placeholder="coach@sportsclub.com" />
                    <p className="text-xs text-red-500 mt-1">{errors.email?.message as string}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şifre <span className="text-red-500">*</span></label>
                    <input type="password" {...register('password')} className="input-field" placeholder="En az 6 karakter" />
                    <p className="text-xs text-red-500 mt-1">{errors.password?.message as string}</p>
                </div>

                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                    <p><strong>Bilgi:</strong> Eklenen antrenör, bu e-posta ve şifre ile sisteme giriş yaparak sadece kendine atanan takımları ve duyuruları görebilecektir.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <button type="button" onClick={onClose} className="btn-secondary">İptal</button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
                        {isSubmitting ? 'Kaydediliyor...' : 'Antrenörü Kaydet'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
