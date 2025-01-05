import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AppointmentInfoModal from "@/Components/AppointmentInfoModal";

interface AppointmentDetails {
    id: number;
    patient_id: string;
    appointment_date: string;
    appointment_time: string;
    doctor_name: string;
    operation: string;
    notes: string;
    prescription: string;
    status: string;
}

interface AppointmentListModalProps {
    open: boolean;
    onClose: () => void;
    appointments: AppointmentDetails[];
    selectedPatientName: string;
}

const statusLabels: { [key: string]: string } = {
    scheduled: "Planlandı",
    canceled: "İptal Edildi",
    completed: "Tamamlandı",
    pending: "Bekliyor",
    missed: "Tamamlanmadı"
};
const statusClass: { [key: string]: string } = {
    scheduled: "bg-gray-500",
    canceled: "bg-gray-900",
    missed: "bg-red-500",
    pending: "bg-yellow-500",
    completed: "bg-green-500", // Varsayım: "completed" durumu bu renge sahip
};

const AppointmentListModal: React.FC<AppointmentListModalProps> = ({
                                                                       open,
                                                                       onClose,
                                                                       appointments,
                                                                       selectedPatientName,
                                                                   }) => {
    // Modal kapalıysa hiçbir şey render etme
    if (!open) return null;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<
        AppointmentDetails | null
    >(null);

    const handleInfoModalToggle = (appointment: AppointmentDetails | null = null) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(!isModalOpen);
    };

    const currentDate = new Date();

    // Randevuları ayırma
    const pastAppointments = appointments.filter(
        (appointment) =>
            new Date(`${appointment.appointment_date}T${appointment.appointment_time}`) < currentDate ||
            appointment.status === 'completed'

    );
    pastAppointments.map((appointment) => {
        if (appointment.status === 'scheduled') {
            appointment.status = 'missed';
          }
    });
    const futureAppointments = appointments.filter(
        (appointment) =>
            new Date(`${appointment.appointment_date}T${appointment.appointment_time}`) >= currentDate &&
            appointment.status != 'completed' // Durumu "completed" olanları da ekliyoruz
    );

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        bgcolor: "#ddc3cd",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "8px",
                    }}
                >
                    {/* Modal Header */}
                    <div className="justify-between items-center px-6 py-4 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-200 dark:text-gray-800">
                            {selectedPatientName} - Randevu Listesi
                        </h2>
                    </div>

                    {/* Modal İçerik */}
                    <div className="flex justify-between gap-4 max-h-[40vh]">
                        {/* Geçmiş Randevular */}
                        <div className="overflow-y-auto w-1/2">
                            <h3 className="text-center text-gray-700 dark:text-gray-900 font-semibold mb-2">
                                Geçmiş Randevular
                            </h3>
                            {pastAppointments.length > 0 ? (
                                <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                                    <thead>
                                    <tr className="text-center bg-gray-100 dark:bg-gray-100 sticky top-0">
                                        <th className="p-3 border border-gray-300 dark:border-gray-700">
                                            Tarih
                                        </th>
                                        <th className="p-3 border border-gray-300 dark:border-gray-700">
                                            Saat
                                        </th>
                                        <th className="p-3 border border-gray-300 dark:border-gray-700">
                                            Doktor
                                        </th>
                                        <th className="p-3 border border-gray-300 dark:border-gray-700">
                                            Durum
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {pastAppointments.map((appointment) => (
                                        <tr
                                            key={appointment.id}
                                            onClick={() => handleInfoModalToggle(appointment)}
                                            className="text-center border-t bg-gray-100 hover:bg-gray-300 border-gray-300 dark:border-gray-700"
                                        >
                                            <td className="p-2">
                                                {new Date(
                                                    appointment.appointment_date
                                                ).toLocaleDateString("tr-TR")}
                                            </td>
                                            <td className="p-2 border border-gray-300 dark:border-gray-700">
                                                {appointment.appointment_time}
                                            </td>
                                            <td className="p-2 border border-gray-300 dark:border-gray-700">
                                                {appointment.doctor_name}
                                            </td>
                                            <td className="p-2 border border-gray-300 dark:border-gray-700">
                          <span
                              className={`px-3 py-1 rounded-lg text-white ${statusClass[appointment.status] || "bg-gray-300"}`}
                          >
                            {statusLabels[appointment.status] || "Bilinmeyen"}
                          </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-700 dark:text-gray-900">
                                    Geçmiş randevu bulunmamaktadır.
                                </p>
                            )}
                        </div>

                        {/* Gelecek Randevular */}
                        <div className="overflow-y-auto w-1/2">
                            <h3 className="text-center text-gray-700 dark:text-gray-900 font-semibold mb-2">
                                Gelecek Randevular
                            </h3>
                            {futureAppointments.length > 0 ? (
                                <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                                    <thead>
                                    <tr className="text-center bg-gray-100 dark:bg-gray-100 sticky top-0">
                                        <th className="p-3 border border-gray-300 dark:border-gray-700">
                                            Tarih
                                        </th>
                                        <th className="p-3 border border-gray-300 dark:border-gray-700">
                                            Saat
                                        </th>
                                        <th className="p-3 border border-gray-300 dark:border-gray-700">
                                            Doktor
                                        </th>
                                        <th className="p-3 border border-gray-300 dark:border-gray-700">
                                            Durum
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {futureAppointments.map((appointment) => (
                                        <tr
                                            key={appointment.id}
                                            onClick={() => handleInfoModalToggle(appointment)}
                                            className="text-center border-t bg-gray-100 hover:bg-gray-300 border-gray-300 dark:border-gray-700"
                                        >
                                            <td className="p-2">
                                                {new Date(
                                                    appointment.appointment_date
                                                ).toLocaleDateString("tr-TR")}
                                            </td>
                                            <td className="p-2 border border-gray-300 dark:border-gray-700">
                                                {appointment.appointment_time}
                                            </td>
                                            <td className="p-2 border border-gray-300 dark:border-gray-700">
                                                {appointment.doctor_name}
                                            </td>
                                            <td className="p-2 border border-gray-300 dark:border-gray-700">
                          <span
                              className={`px-3 py-1 rounded-lg text-white ${statusClass[appointment.status] || "bg-gray-300"}`}
                          >
                            {statusLabels[appointment.status] || "Bilinmeyen"}
                          </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-700 dark:text-gray-900">
                                    Gelecek randevu bulunmamaktadır.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end px-6 py-4 border-t dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Kapat
                        </button>
                    </div>
                </Box>
            </Modal>

            <AppointmentInfoModal
                open={isModalOpen}
                onClose={() => handleInfoModalToggle(null)} // Modal kapandığında seçimi sıfırla.
                appointmentDetails={
                    selectedAppointment || {
                        id: 0,
                        patient_id: "",
                        appointment_date: "",
                        appointment_time: "",
                        doctor_name: "",
                        operation: "",
                        notes: "",
                        prescription: "",
                        status: "",
                    }
                } // Varsayılan olarak boş atanır.
                selectedPatientName={selectedPatientName}
            />
        </>
    );
};

export default AppointmentListModal;
