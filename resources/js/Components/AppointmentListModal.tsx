import React from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

interface Appointment {
  id: number;
  patient_id: string;
  appointment_date: string;
  appointment_time: string;
  doctor_name: string;
  operation: string;
  notes: string;
  status: string;
}

interface AppointmentListModalProps {
  open: boolean;
  onClose: () => void;
  appointments: Appointment[];
  selectedPatientName: string;
}
const statusLabels: { [key: string]: string } = {
    scheduled: "Planlandı",
    canceled: "İptal Edildi",
    completed: "Tamamlandı",
    pending: "Bekliyor",
};
const AppointmentListModal: React.FC<AppointmentListModalProps> = ({
  open,
  onClose,
  appointments,
  selectedPatientName,
}) => {
  if (!open) return null; // Modal kapalıysa hiçbir şey render etme

  return (
      <>
          <Modal open={open} onClose={onClose}>
              <Box
                  sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '60%',
                      bgcolor: '#ddc3cd',
                      boxShadow: 24,
                      p: 4,
                      borderRadius: '8px',
                  }}
              >
                  {/* Modal Header */}
                  <div className="justify-between items-center px-6 py-4 dark:border-gray-700">
                      <h2 className="text-lg font-bold text-gray-200 dark:text-gray-800">
                          {selectedPatientName} - Randevu Listesi
                      </h2>
                  </div>
                {/* Modal İçeriği */}
                <div className="overflow-y-auto max-h-96">
                  {appointments.length > 0 ? (
                    <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                      {/* Tablo başlıkları */}
                      <thead>
                        <tr className="text-center bg-gray-100 dark:bg-gray-100 sticky top-0">
                          <th className="p-3 border border-gray-300 dark:border-gray-700">Tarih</th>
                          <th className="p-3 border border-gray-300 dark:border-gray-700">Saat</th>
                          <th className="p-3 border border-gray-300 dark:border-gray-700">Doktor</th>
                          <th className="p-3 border border-gray-300 dark:border-gray-700">İşlem</th>
                          <th className="p-3 border border-gray-300 dark:border-gray-700">Notlar</th>
                          <th className="p-3 border border-gray-300 dark:border-gray-700">Reçete</th>
                          <th className="p-3 border border-gray-300 dark:border-gray-700">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment) => (
                          <tr
                            key={appointment.id}
                            className="text-center border-t bg-gray-100 border-gray-300 dark:border-gray-700"
                          >
                            <td className="p-2">
                              {new Date(appointment.appointment_date).toLocaleDateString("tr-TR")}
                            </td>
                            <td className="p-2 border border-gray-300 dark:border-gray-700">{appointment.appointment_time}</td>
                            <td className="p-2 border border-gray-300 dark:border-gray-700">{appointment.doctor_name}</td>
                            <td className="p-2 border border-gray-300 dark:border-gray-700">{appointment.operation}</td>
                            <td className="p-2 border border-gray-300 dark:border-gray-700">{appointment.notes}</td>
                            <td className="p-2 border border-gray-300 dark:border-gray-700">{appointment.notes}</td>
                            <td className="p-2 border border-gray-300 dark:border-gray-700">
                              <span
                                className={`px-3 py-1 rounded-lg text-white ${
                                  appointment.status === "scheduled"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                                }`}
                              >
                                {statusLabels[appointment.status] || "Bilinmeyen Durum"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-200 dark:text-gray-800">
                      Bu hastaya ait herhangi bir randevu bulunmuyor.
                    </p>
                  )}
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
      </>
  );
};

export default AppointmentListModal;
