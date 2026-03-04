import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal } from './ui/Modal';
import { paymentService } from '../services/paymentService';
import { athleteService } from '../services/athleteService';
import type { CreatePaymentDto } from '../types/payment';
import type { Athlete } from '../types/athlete';

interface PaymentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const schema = yup.object().shape({
    athleteId: yup.string().required('Sporcu seçimi zorunludur'),
    paymentType: yup.string().required('Ödeme türü zorunludur'),
    amount: yup.number().typeError('Geçerli bir tutar giriniz').positive('Tutar pozitif olmalıdır').required('Tutar zorunludur'),
    dueDate: yup.string().required('Son ödeme tarihi zorunludur'),
    description: yup.string().optional().default(''),
});

export const PaymentFormModal = ({ isOpen, onClose, onSuccess }: PaymentFormModalProps) => {
    const [athletes, setAthletes] = useState<Athlete[]>([]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreatePaymentDto>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (isOpen) {
            athleteService.getAllAthletes().then(setAthletes).catch(console.error);
        }
    }, [isOpen]);

    const onSubmit = async (data: CreatePaymentDto) => {
        try {
            await paymentService.createPayment(data);
            reset();
            onSuccess();
        } catch (error) {
            console.error('Payment creation failed', error);
            alert('Veliye borç ataması (Payment) oluşturulurken hata oluştu.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Ödeme veya Aidat Tanımla">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Athlete Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci / Sporcu <span className="text-red-500">*</span></label>
                    <select {...register('athleteId')} className="input-field">
                        <option value="">Seçiniz</option>
                        {athletes.map(athlete => (
                            <option key={athlete.id} value={athlete.id}>{athlete.firstName} {athlete.lastName}</option>
                        ))}
                    </select>
                    <p className="text-xs text-red-500 mt-1">{errors.athleteId?.message}</p>
                </div>

                {/* Type & Amount */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Türü <span className="text-red-500">*</span></label>
                        <select {...register('paymentType')} className="input-field">
                            <option value="">Seçiniz</option>
                            <option value="Aylık Aidat">Aylık Aidat</option>
                            <option value="Malzeme Ücreti">Malzeme / Forma Ücreti</option>
                            <option value="Turnuva Katılımı">Turnuva Katılımı</option>
                            <option value="Diğer">Diğer Seçenekler</option>
                        </select>
                        <p className="text-xs text-red-500 mt-1">{errors.paymentType?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tutar (TL) <span className="text-red-500">*</span></label>
                        <input type="number" step="0.01" {...register('amount')} className="input-field" placeholder="0.00" />
                        <p className="text-xs text-red-500 mt-1">{errors.amount?.message}</p>
                    </div>
                </div>

                {/* Date & Desc */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Son Ödeme Tarihi <span className="text-red-500">*</span></label>
                        <input type="date" {...register('dueDate')} className="input-field" />
                        <p className="text-xs text-red-500 mt-1">{errors.dueDate?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <input type="text" {...register('description')} className="input-field" placeholder="Örn: 2025 Şubat Aidatı" />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <button type="button" onClick={onClose} className="btn-secondary">
                        İptal
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
                        {isSubmitting ? 'Kaydediliyor...' : 'Borcu Tanımla'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
