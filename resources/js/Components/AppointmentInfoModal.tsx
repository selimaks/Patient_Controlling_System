import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

interface AppointmentInfoModalProps {
    open: boolean;
    onClose: () => void;
    appointmentDetails: {
        id: number;
        patient_id: string;
        appointment_date: string;
        appointment_time: string;
        doctor_name: string;
        operation: string;
        notes: string;
        prescription: string;
        status: string;
    };
    selectedPatientName: string | null;
    onAppointmentChange: (field: string, value: string) => void;
    onCreateAppointment: () => void;
}

const AppointmentInfoModal: React.FC<AppointmentInfoModalProps> = ({
    open,
    onClose,
    appointmentDetails,
    selectedPatientName,
}) => {
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
                        <label className="block text-sm font-medium">{appointmentDetails.appointment_date}</label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Saat</label>
                        <label className="block text-sm font-medium">{appointmentDetails.appointment_time}</label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Doktor</label>
                        <label className="block text-sm font-medium">{appointmentDetails.doctor_name}</label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Operasyon</label>
                        <label className="block text-sm font-medium">{appointmentDetails.operation}</label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Notlar</label>
                        <label className="block text-sm font-medium">{appointmentDetails.notes}</label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Reçete</label>
                        <label className="block text-sm font-medium">{appointmentDetails.prescription}</label>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={onClose}
                    >
                        Kapat
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default AppointmentInfoModal;
