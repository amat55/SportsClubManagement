import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal } from './ui/Modal';
import { athleteService } from '../services/athleteService';
import { useEffect, useState } from 'react';
import type { CreateAthleteDto } from '../types/athlete';

interface AthleteFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const schema = yup.object().shape({
    firstName: yup.string().required('Ad alanı zorunludur'),
    lastName: yup.string().required('Soyad alanı zorunludur'),
    motherName: yup.string().required('Anne adı zorunludur'),
    fatherName: yup.string().required('Baba adı zorunludur'),
    dateOfBirth: yup.string().required('Doğum tarihi seçiniz'),
    placeOfBirth: yup.string().required('Doğum yeri zorunludur'),
    phoneNumber: yup.string().required('Telefon numarası zorunludur'),
    address: yup.string().required('Adres zorunludur'),
    bloodType: yup.number().required('Kan grubu seçin'),
    schoolName: yup.string().optional().default(''),
    grade: yup.string().optional().default(''),
    regularMedications: yup.string().optional().default(''),
    chronicDiseases: yup.string().optional().default(''),
    height: yup.number().typeError('Boy geçerli bir sayı olmalıdır').required('Boy zorunludur'),
    weight: yup.number().typeError('Kilo geçerli bir sayı olmalıdır').required('Kilo zorunludur'),
    shoeSize: yup.number().typeError('Ayakkabı numarası geçerli bir sayı olmalıdır').required('Ayakkabı numarası zorunludur'),
    emergencyContactName: yup.string().required('Acil durum kişisi adı zorunludur'),
    emergencyContactPhone: yup.string().required('Acil durum telefon zorunludur'),
    emergencyContactRelation: yup.string().required('Acil durum yakınlık derecesi zorunludur'),
});

export const AthleteFormModal = ({ isOpen, onClose, onSuccess }: AthleteFormModalProps) => {
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreateAthleteDto>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (isOpen) {
            setNotification(null);
        }
    }, [isOpen]);

    const onSubmit = async (data: CreateAthleteDto) => {
        setNotification(null);
        try {
            await athleteService.createAthlete(data);
            setNotification({ type: 'success', message: 'Sporcu başarıyla kaydedildi!' });

            setTimeout(() => {
                reset();
                onSuccess();
            }, 1000);
        } catch (error) {
            console.error('Athlete creation failed', error);
            setNotification({ type: 'error', message: 'Sporcu eklenirken bir hata oluştu' });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Sporcu Kaydı">
            {notification && (
                <div className={`p-3 mb-4 rounded-lg text-sm border ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {notification.message}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Temel Bilgiler */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ad <span className="text-red-500">*</span></label>
                        <input type="text" {...register('firstName')} className="input-field" placeholder="Ad" />
                        <p className="text-xs text-red-500 mt-1">{errors.firstName?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Soyad <span className="text-red-500">*</span></label>
                        <input type="text" {...register('lastName')} className="input-field" placeholder="Soyad" />
                        <p className="text-xs text-red-500 mt-1">{errors.lastName?.message}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Anne Adı <span className="text-red-500">*</span></label>
                        <input type="text" {...register('motherName')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.motherName?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Baba Adı <span className="text-red-500">*</span></label>
                        <input type="text" {...register('fatherName')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.fatherName?.message}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi <span className="text-red-500">*</span></label>
                        <input type="date" {...register('dateOfBirth')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Yeri <span className="text-red-500">*</span></label>
                        <input type="text" {...register('placeOfBirth')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.placeOfBirth?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kan Grubu <span className="text-red-500">*</span></label>
                        <select {...register('bloodType')} className="input-field">
                            <option value="">Seçiniz</option>
                            <option value="0">A+</option>
                            <option value="1">A-</option>
                            <option value="2">B+</option>
                            <option value="3">B-</option>
                            <option value="4">AB+</option>
                            <option value="5">AB-</option>
                            <option value="6">0+</option>
                            <option value="7">0-</option>
                        </select>
                        <p className="text-xs text-red-500 mt-1">{errors.bloodType?.message}</p>
                    </div>
                </div>

                {/* İletişim */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon <span className="text-red-500">*</span></label>
                        <input type="text" {...register('phoneNumber')} className="input-field" placeholder="05XX XXX XX XX" />
                        <p className="text-xs text-red-500 mt-1">{errors.phoneNumber?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adres <span className="text-red-500">*</span></label>
                        <input type="text" {...register('address')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.address?.message}</p>
                    </div>
                </div>

                {/* Eğitim & Fiziksel */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Okul</label>
                        <input type="text" {...register('schoolName')} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf</label>
                        <input type="text" {...register('grade')} className="input-field" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Boy (cm) <span className="text-red-500">*</span></label>
                        <input type="number" {...register('height')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.height?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kilo (kg) <span className="text-red-500">*</span></label>
                        <input type="number" {...register('weight')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.weight?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ayakkabı No <span className="text-red-500">*</span></label>
                        <input type="number" {...register('shoeSize')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.shoeSize?.message}</p>
                    </div>
                </div>

                {/* Acil Durum & Sağlık */}
                <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Acil Durum Kişisi <span className="text-red-500">*</span></label>
                        <input type="text" {...register('emergencyContactName')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.emergencyContactName?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Acil Telefon <span className="text-red-500">*</span></label>
                        <input type="text" {...register('emergencyContactPhone')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.emergencyContactPhone?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Acil Yakınlık <span className="text-red-500">*</span></label>
                        <input type="text" {...register('emergencyContactRelation')} className="input-field" placeholder="Dayı, Teyze vs." />
                        <p className="text-xs text-red-500 mt-1">{errors.emergencyContactRelation?.message}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sürekli Kullanılan İlaçlar</label>
                        <input type="text" {...register('regularMedications')} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kronik Hastalıklar</label>
                        <input type="text" {...register('chronicDiseases')} className="input-field" />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <button type="button" onClick={onClose} className="btn-secondary">
                        İptal
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
                        {isSubmitting ? 'Kaydediliyor...' : 'Sporcuyu Kaydet'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
