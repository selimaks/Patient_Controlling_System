import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import PatientEditModal from "@/Components/PatientEditModal";

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
    const handleEdit = (id: number) => {
        const patient = patients.find((p: Patient) => p.id === id); // Seçilen hastayı bul
        setSelectedPatient(patient); // Hastayı modalda görmek için state'e aktar
        setIsModalOpen(true); // Modali aç
    };
    const handleSelect = (id: number) => {
        const patient = patients.find((p: Patient) => p.id === id); // Seçilen hastayı bul
        setSelectedPatient(patient); // Sağdaki detay alanına göndermek için durumu ayarla
    };
    const handleSave = () => {

        if (selectedPatient) {
            // Veritabanı Kaydı (PATCH/PUT)
            router.put(`/patients/${selectedPatient.id}`, { ...selectedPatient }, {
                onSuccess: () => {
                    console.log("Hasta Güncellendi: ", selectedPatient.name);
                    setIsModalOpen(false); // Modalı kapat
                }
            });
        }
    };
    const handleChange = (field: string, value: string) => {
        if (selectedPatient) {
            setSelectedPatient({ ...selectedPatient, [field]: value } as Patient); // State'i güncelle
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Bu hastayı silmek istediğinize emin misiniz?')) {
            console.log(`Sil: ${id}`); // Silme işlemini burada gerçekleştirin (API çağrısı gibi)
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-center font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {flash.message ? (
                        <div className="text-green-400">{flash.message}</div>
                    ) : (
                        "Hastalar"
                    )}
                </h2>
            }
        >
            <Head title="Patients"/>

            {/* İki yan yana sütunlu düzen */}
            <div className="flex h-full py-12">
                {/* Sol taraf - Hastalar listesi */}
                <div className="h-screen w-1/3 border-r border-dark-background-quinary dark:border-dark-border-secondary p-4 overflow-y-auto">
                    <div className="overflow-y-auto overscroll-contain h-[calc(77vh-2rem)] bg-background shadow-sm sm:rounded-lg dark:bg-dark-background-secondary">
                        <table className="text-text-primary dark:text-dark-text-primary min-w-full text-left text-sm font-light">
                            <thead
                                className="sticky top-0 z-10 border-b border-dark-background-quinary px-6 py-4 bg-background-secondary dark:bg-dark-background-secondary">
                            <tr>
                                <th className="sticky top-0 z-10 px-6 py-4 bg-background-secondary dark:bg-dark-background-secondary">
                                    T.C. Kimlik No
                                </th>
                                <th className="sticky top-0 z-10 px-6 py-4 bg-background-secondary dark:bg-dark-background-secondary">
                                    Ad
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {patients.map((patient: Patient) => (
                                <tr
                                    key={patient.id}
                                    onClick={() => handleSelect(patient.id)} // Hasta seçimi
                                    className={`border-b cursor-pointer border-dark-background-quinary
                                    hover:bg-gray-100 dark:hover:bg-dark-background-tertiary
                                    ${selectedPatient?.id === patient.id ? 'bg-gray-200 dark:bg-dark-background-tertiary' : ''}`} // Seçili olan hastayı vurgula
                                >
                                    <td className="whitespace-nowrap px-6 py-4">{patient.TCKN}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{patient.name}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sağ taraf - Hasta bilgileri */}
                <div className="bg-white dark:bg-dark-background-secondary shadow-lg sm:rounded-lg w-2/3 p-6 m-4 sticky top-4 h-[calc(77vh-2rem)] overflow-y-hidden overscroll-contain">
                    {selectedPatient ? (
                        <div className="text-text-primary dark:text-dark-text-primary space-y-6">
                            {/* Başlık */}
                            <div className="flex items-center space-x-4 border-b pb-4">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                                    {selectedPatient.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold">{selectedPatient.name}</h3>
                                    <p className="text-gray-500 dark:text-dark-text-secondary">T.C. Kimlik No: {selectedPatient.TCKN}</p>
                                </div>
                            </div>

                            {/* Bilgi Alanları */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 dark:text-dark-text-secondary text-sm">E-posta</p>
                                    <p className="text-lg font-medium">{selectedPatient.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-dark-text-secondary text-sm">Telefon</p>
                                    <p className="text-lg font-medium">{selectedPatient.phone_number}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-dark-text-secondary text-sm">Kayıt Tarihi</p>
                                    <p className="text-lg font-medium">
                                        {new Date(selectedPatient.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Eylem Düğmeleri */}
                            <div className="flex space-x-4 border-t pt-4">
                                <button
                                    onClick={() => console.log("Düzenle")}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => console.log("Sil")}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 dark:text-dark-text-secondary">Bir hasta seçin.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
);
}
{/*
    <AuthenticatedLayout
        header={
            <h2 className="text-center font-semibold leading-tight text-gray-800 dark:text-gray-200">
                {flash.message ? (
                    <div className="text-green-400">{flash.message}</div>
                ) : (
                    "Hastalar"
                )}
            </h2>
        }
    >
        <Head title="Patients"/>

        <PatientEditModal
            isOpen={isModalOpen}
            patient={selectedPatient}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            onChange={handleChange}
        />

        <div className="py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div
                    className="overflow-hidden bg-background shadow-sm sm:rounded-lg dark:bg-dark-background-secondary">
                    <div className="p-6 text-text-primary dark:text-dark-text-primary">
                        <table className="min-w-full text-left text-sm font-light">
                            <thead
                                className="border-b bg-background-secondary dark:border-dark-border-secondary dark:bg-dark-background-secondary">
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
                                <tr
                                    key={patient.id}
                                    onClick={() => handleEdit(patient.id)} // Satır tıklanabilir hale geldi
                                    className="border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-background-tertiary" // Hover efekti ekle
                                >
                                    <td className="whitespace-nowrap px-6 py-4">{patient.TCKN}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{patient.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{patient.email}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{patient.phone_number}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {new Date(patient.created_at).toLocaleDateString()}
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
)
    ;
}
*/}
