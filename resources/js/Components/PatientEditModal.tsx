// components/PatientEditModal.tsx

interface PatientEditModalProps {
    isOpen: boolean;
    patient: {
        TCKN: string;
        name: string;
        email: string;
        phone_number: string;
    } | null;
    onClose: () => void;
    onSave: () => void;
    onChange: (field: string, value: string) => void;
}

const PatientEditModal: React.FC<PatientEditModalProps> = ({
    isOpen,
    patient,
    onClose,
    onSave,
    onChange
}) => {
    if (!isOpen || !patient) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6 w-2/3 md:w-1/4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Hasta Düzenle</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-400">T.C. Kimlik No</label>
                        <input
                            type="text"
                            value={patient.TCKN}
                            onChange={(e) => onChange("TCKN", e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-400">Ad</label>
                        <input
                            type="text"
                            value={patient.name}
                            onChange={(e) => onChange("name", e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-400">E-posta</label>
                        <input
                            type="email"
                            value={patient.email}
                            onChange={(e) => onChange("email", e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-400">Telefon</label>
                        <input
                            type="text"
                            value={patient.phone_number}
                            onChange={(e) => onChange("phone_number", e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-text-primary bg-gray-200 rounded hover:bg-gray-300 dark:bg-button-secondary dark:text-text-primary dark:hover:bg-button-primary"
                    >
                        İptal
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 text-sm text-text-primary bg-dark-button-primary rounded hover:bg-dark-button-secondary"
                    >
                        Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientEditModal;
