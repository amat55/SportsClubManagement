import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal } from './ui/Modal';
import { medicalService } from '../services/medicalService';
import type { CreatePhysicalMeasurementDto } from '../types/medical';
import type { Athlete } from '../types/athlete';

interface MedicalFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    athlete: Athlete;
}

const schema = yup.object().shape({
    measurementDate: yup.string().required('Ölçüm tarihi zorunludur'),
    height: yup.number().typeError('Geçerli bir sayı girin').required('Boy zorunludur').min(50, 'En az 50 cm').max(250, 'En fazla 250 cm'),
    weight: yup.number().typeError('Geçerli bir sayı girin').required('Kilo zorunludur').min(10, 'En az 10 kg').max(200, 'En fazla 200 kg'),
    armSpan: yup.number().typeError('Geçerli bir sayı girin').nullable().transform((v, o) => o === '' ? null : v),
    bodyFatPercentage: yup.number().typeError('Geçerli bir sayı girin').nullable().transform((v, o) => o === '' ? null : v),
    flexibilityScore: yup.number().typeError('Geçerli bir sayı girin').nullable().transform((v, o) => o === '' ? null : v),
    jumpHeight: yup.number().typeError('Geçerli bir sayı girin').nullable().transform((v, o) => o === '' ? null : v),
    notes: yup.string().optional()
});

export const MedicalFormModal = ({ isOpen, onClose, onSuccess, athlete }: MedicalFormModalProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: {
            measurementDate: new Date().toISOString().split('T')[0]
        }
    });

    const onSubmit = async (data: any) => {
        try {
            const payload: CreatePhysicalMeasurementDto = {
                ...data,
                athleteId: athlete.id,
                measurementDate: new Date(data.measurementDate).toISOString(),
                notes: data.notes || ""
            };

            await medicalService.addMeasurement(payload);
            reset();
            onSuccess();
        } catch (error) {
            console.error('Measurement creation failed', error);
            alert('Ölçüm kaydedilirken bir hata oluştu.');
        }
    };

    if (!athlete) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Ölçüm Gir">
            <div className="mb-4 p-3 bg-teal-50 text-teal-800 rounded-lg">
                <span className="font-semibold">{athlete.firstName} {athlete.lastName}</span> için fiziksel gelişim verisi ekleniyor.
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ölçüm Tarihi <span className="text-red-500">*</span></label>
                        <input type="date" {...register('measurementDate')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.measurementDate?.message as string}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Boy (cm) <span className="text-red-500">*</span></label>
                        <input type="number" step="0.1" {...register('height')} className="input-field" placeholder="Örn: 180" />
                        <p className="text-xs text-red-500 mt-1">{errors.height?.message as string}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kilo (kg) <span className="text-red-500">*</span></label>
                        <input type="number" step="0.1" {...register('weight')} className="input-field" placeholder="Örn: 75.5" />
                        <p className="text-xs text-red-500 mt-1">{errors.weight?.message as string}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kulaç Uzunluğu (cm)</label>
                        <input type="number" step="0.1" {...register('armSpan')} className="input-field" placeholder="Opsiyonel" />
                        <p className="text-xs text-red-500 mt-1">{errors.armSpan?.message as string}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sıçrama (cm)</label>
                        <input type="number" step="0.1" {...register('jumpHeight')} className="input-field" placeholder="Opsiyonel" />
                        <p className="text-xs text-red-500 mt-1">{errors.jumpHeight?.message as string}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yağ Oranı (%)</label>
                        <input type="number" step="0.1" {...register('bodyFatPercentage')} className="input-field" placeholder="Opsiyonel" />
                        <p className="text-xs text-red-500 mt-1">{errors.bodyFatPercentage?.message as string}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Esneklik Skoru</label>
                        <input type="number" step="0.1" {...register('flexibilityScore')} className="input-field" placeholder="Opsiyonel" />
                        <p className="text-xs text-red-500 mt-1">{errors.flexibilityScore?.message as string}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ek Notlar</label>
                    <textarea {...register('notes')} className="input-field" rows={2} placeholder="Değerlendirme notu..."></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <button type="button" onClick={onClose} className="btn-secondary">İptal</button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary bg-teal-600 hover:bg-teal-700 focus:ring-teal-500">
                        {isSubmitting ? 'Kaydediliyor...' : 'Ölçümü Kaydet'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
