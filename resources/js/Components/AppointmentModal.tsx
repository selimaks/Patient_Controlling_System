import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {usePage} from '@inertiajs/react'

interface AppointmentModalProps {
    open: boolean;
    onClose: () => void;
    appointmentDetails: {
        patient_id: string;
        appointment_date: string;
        appointment_time: string;
        doctor_name: string;
        operation: string;
        notes: string;
        status: string;
    };
    selectedPatientName: string | null;
    onAppointmentChange: (field: string, value: string) => void;
    onCreateAppointment: () => void;
}
interface Doctor {
    name: string;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
    open,
    onClose,
    appointmentDetails,
    selectedPatientName,
    onAppointmentChange,
    onCreateAppointment,
}) => {
    const {doctors} = usePage().props;
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: '#ddc3cd',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '8px',
                }}
            >
                <h2 className="text-lg font-bold mb-4">Randevu Detayları - {selectedPatientName}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Tarih</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={appointmentDetails.appointment_date}
                            onChange={(e) => onAppointmentChange('appointment_date', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Saat</label>
                        <input
                            type="time"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={appointmentDetails.appointment_time}
                            onChange={(e) => {
                                onAppointmentChange('appointment_time', e.target.value + ':00');
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Doktor</label>
                        <div>
                            <select
                                onChange={(e) => onAppointmentChange('doctor_name', e.target.value)}
                                value={appointmentDetails.doctor_name}
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="" disabled>
                                    Doktor Seçiniz
                                </option>
                                {(doctors as Doctor[]).map((doctor, index) => (
                                    <option key={index} value={doctor.name}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Operasyon</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={appointmentDetails.operation}
                            onChange={(e) => onAppointmentChange('operation', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Notlar</label>
                        <textarea
                            rows={1} // Minimum satır sayısı
                            className="w-full h-auto px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none overflow-hidden"
                            value={appointmentDetails.notes}
                            onChange={(e) => {
                                const textarea = e.target;
                                textarea.style.height = "auto"; // Mevcut yüksekliği sıfırla
                                textarea.style.height = `${textarea.scrollHeight}px`; // Scroll yüksekliğine göre genişlet
                                onAppointmentChange('notes', e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        onClick={onClose}
                    >
                        İptal
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={()=> {
                            onAppointmentChange('patient_id', appointmentDetails.patient_id);
                            onAppointmentChange('status', 'scheduled');
                            onCreateAppointment();
                    }}
                    >
                    Oluştur
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default AppointmentModal;
