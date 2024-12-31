import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';


interface Patient {
    id: number;
    TCKN: string;
    name: string;
    email: string;
    phone_number: string;
    created_at: string;
}

export default function Patients() {
    const { patients, flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const handleEdit = (TCKN: string) => {
        const patient = patients.find((p: Patient) => p.TCKN === TCKN); // Seçilen hastayı bul
        setSelectedPatient(patient); // Hastayı modalda görmek için state'e aktar
        setIsModalOpen(true); // Modali aç
    };
    const handleSave = () => {

        if (selectedPatient) {
            // Veritabanı Kaydı (PATCH/PUT)
            router.put(`/patients/${selectedPatient.id}`, selectedPatient, {
                onSuccess: () => {
                    setIsModalOpen(false); // Modalı kapat
                }
            });
        }
    };
    const handleChange = (key: keyof Patient, value: string) => {
        if (selectedPatient) {
            setSelectedPatient({ ...selectedPatient, [key]: value }); // State'i güncelle
        }
    };

    const handleDelete = (TCKN: string) => {
        if (confirm('Bu hastayı silmek istediğinize emin misiniz?')) {
            console.log(`Sil: ${TCKN}`); // Silme işlemini burada gerçekleştirin (API çağrısı gibi)
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {flash.message ? (
                        <div className="text-green-400 text-center">{flash.message}</div>
                    ) : (
                        "Hastalar"
                    )}
                </h2>
            }
        >
            <Head title="Patients"/>

            {/* Modal */}
            {isModalOpen && selectedPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6 w-2/3 md:w-1/4">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Hasta Düzenle</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-400">T.C. Kimlik No</label>
                                <input
                                    type="text"
                                    value={selectedPatient.TCKN}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-400">Ad</label>
                                <input
                                    type="text"
                                    value={selectedPatient.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-400">E-posta</label>
                                <input
                                    type="email"
                                    value={selectedPatient.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-400">Telefon</label>
                                <input
                                    type="text"
                                    value={selectedPatient.phone_number}
                                    onChange={(e) => handleChange("phone_number", e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm text-text-primary bg-gray-200 rounded hover:bg-gray-300 dark:bg-button-secondary dark:text-text-primary dark:hover:bg-button-primary"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 text-sm text-text-primary bg-dark-button-primary rounded hover:bg-dark-button-secondary"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-background shadow-sm sm:rounded-lg dark:bg-dark-background-secondary">
                        <div className="p-6 text-text-primary dark:text-dark-text-primary">
                            <table className="min-w-full text-left text-sm font-light">
                                <thead className="border-b bg-background-secondary dark:border-dark-border-secondary dark:bg-dark-background-secondary">
                                <tr>
                                    <th scope="col" className="px-6 py-4">T.C. Kimlik No</th>
                                    <th scope="col" className="px-6 py-4">Ad</th>
                                    <th scope="col" className="px-6 py-4">E-posta</th>
                                    <th scope="col" className="px-6 py-4">Telefon</th>
                                    <th scope="col" className="px-6 py-4">Kayıt Tarihi</th>
                                </tr>
                                </thead>
                                <tbody>
                                {patients.map((patient: Patient) => (
                                    <tr key={patient.id} className="border-b">
                                        <td className="whitespace-nowrap px-6 py-4">{patient.TCKN}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{patient.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{patient.email}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{patient.phone_number}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{new Date(patient.created_at).toLocaleDateString()}</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(patient.TCKN)}
                                                    className="px-4 py-2 text-sm text-text-primary bg-dark-button-secondary rounded hover:bg-dark-button-primary focus:outline-none"
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(patient.TCKN)}
                                                    className="px-4 py-2 text-sm text-text-primary bg-button-secondary rounded hover:bg-button-primary focus:outline-none"
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
