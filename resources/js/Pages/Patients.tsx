import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
interface Patient {
    id: number;
    isDeleted: boolean;
    TCKN: string;
    name: string;
    email: string;
    doctor: string;
    gender: string;
    phone_number: string;
    created_at: string;
    created_by: string;
}
export default function Patients() {
    useEffect(() => {
        // Tüm sayfa kaydırmasını devre dışı bırak
        document.body.style.overflow = 'hidden';

        return () => {
            // Sayfadan çıkıldığında kaydırmayı geri yükle
            document.body.style.overflow = 'auto';
        };
    }, []);

    const { patients } = usePage().props;
    const user = usePage().props.auth.user;
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [originalPatient, setOriginalPatient] = useState<Patient | null>(null);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);

    // **Yeni Hasta Ekleme:**
    const handleAddPatient = () => {
        // Yeni boş hasta oluştur
        const newPatient: Patient = {
            id: 0, // Sahte bir id (Backend'de bu değeri kaydettikten sonra güncelleyeceksiniz.)
            isDeleted: false,
            TCKN: '',
            name: '',
            email: '',
            doctor: '',
            gender: '',
            phone_number: '',
            created_at: new Date().toISOString(),
            created_by: user.name, // Gerekirse oturum açmış kullanıcıyı ekleyebilirsiniz
        };
        setSelectedPatient(newPatient); // Sağ tarafı yeni hasta bilgileriyle doldurun
        setOriginalPatient(newPatient); // Orijinal durumu da aynı yapın
    };

    useEffect(() => {
        if (originalPatient && selectedPatient) {
            const isSame =
                JSON.stringify(originalPatient) === JSON.stringify(selectedPatient);
            setIsSaveDisabled(isSame); // Eğer bilgiler aynıysa butonu devre dışı yap
        }
    }, [originalPatient, selectedPatient]);

    useEffect(() => {
        // Eğer bir hasta seçilmemişse veya yeni bir hasta ekleniyorsa, silme butonu devre dışı olmalı
        if (!selectedPatient || selectedPatient.id === 0) {
            setIsDeleteDisabled(true);
        } else {
            setIsDeleteDisabled(false);
        }
    }, [selectedPatient]);

    const handleSelect = (id: number) => {
        const patient = (patients as Patient[]).find((p: Patient) => p.id === id); // Seçilen hastayı bul
        setSelectedPatient(patient ?? null); // Sağdaki detay alanına göndermek için durumu ayarla
        setOriginalPatient(patient ?? null); // Hasta seçildiğinde orijinal bilgiyi sakla
    };
    const handleSave = () => {

        if (selectedPatient) {
            if (selectedPatient.id === 0) {
                // Yeni hasta oluşturulacaksa POST isteği
                router.post('/patients/create', { ...selectedPatient }, {
                    onSuccess: () => {
                        console.log("Yeni Hasta Eklendi: ", selectedPatient.name);
                    },
                    onError: () => {
                        console.log("Hasta Eklenemedi: ", selectedPatient.name);
                    }
                });
            } else {
                // Mevcut hasta güncellenecekse PUT isteği
                router.put(`/patients/update/${selectedPatient.id}`, { ...selectedPatient }, {
                    onSuccess: () => {
                        console.log("Hasta Güncellendi: ", selectedPatient.name);
                        setOriginalPatient(selectedPatient);
                    }
                });
            }
        }
    };
    const handleChange = (field: string, value: string) => {
        if (selectedPatient) {
            setSelectedPatient({ ...selectedPatient, [field]: value } as Patient); // State'i güncelle
        }
    };

    const handleDelete = () => {
        if (selectedPatient) {
            if (selectedPatient.id != 0) {
                if (confirm('Bu hastayı silmek istediğinize emin misiniz?')) {
                    router.put(`/patients/delete/${selectedPatient.id}`, { ...selectedPatient }, {
                        onSuccess: () => {
                            console.log("Hasta Silindi: ", selectedPatient.name);
                            setSelectedPatient(null);
                        },
                        onError: () => {
                            console.log("Hasta Silinemedi: ", selectedPatient.name);
                        }
                    });

                }
            }else{
                console.log("Boş bir hasta silinemez.");
            }
        }
    };
    // @ts-ignore
    return (
        <div className="patients">
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        {/* Hastalar yazısı */}
                        <h2 className="font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Hastalar
                        </h2>

                        {/* Yeni Hasta Ekle düğmesi */}
                        <button
                            onClick={handleAddPatient}
                            className="px-4 py-2 bg-dark-button-primary text-text-primary rounded-lg hover:bg-dark-button-secondary transition-all duration-200"
                        >
                            Yeni Hasta Ekle
                        </button>
                    </div>
                }
            >
                 <Head title="Patients"/>

                {/* İki yan yana sütunlu düzen */}
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex h-full py-8">

                    {/* Sol taraf - Hastalar listesi */}
                    <div
                        className="h-screen w-1/3 border-r border-dark-background-quinary dark:border-dark-border-secondary p-4 overflow-y-auto">
                        <div
                            className="overflow-y-auto overscroll-contain h-[calc(77vh-2rem)] bg-background shadow-sm sm:rounded-lg dark:bg-dark-background-secondary">
                            <table
                                className="text-text-primary dark:text-dark-text-primary min-w-full text-left text-sm font-light">
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
                                {(patients as Patient[]).map((patient: Patient) => (
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
                    <div
                        className="bg-white dark:bg-dark-background-secondary shadow-lg sm:rounded-lg w-2/3 p-6 m-4 sticky top-4 h-[calc(77vh-2rem)] overflow-y-hidden overscroll-contain">
                        {selectedPatient ? (
                            <div className="text-text-primary dark:text-dark-text-primary space-y-6">
                                {/* Başlık */}
                                <div className="flex items-center space-x-4 border-b pb-4">
                                    <div
                                        className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                                        {selectedPatient.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-semibold">{selectedPatient.name}</h3>

                                    </div>
                                </div>

                                {/* Bilgi Alanları */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className=" text-sm">İsim</p>
                                        <input onChange={(e) => handleChange("name", e.target.value)} type={"text"}
                                               value={selectedPatient.name}
                                               className="w-[60%] px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 dark:bg-dark-background dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                                    </div>
                                    <div>
                                        <p className=" ml-2  text-sm">E-posta</p>
                                        <input onChange={(e) => handleChange("email", e.target.value)} type={"text"}
                                               value={selectedPatient.email}
                                               className="w-[60%] px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 dark:bg-dark-background dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                                    </div>
                                    <div>
                                        <p className=" ml-2 text-sm">Telefon</p>
                                        <input onChange={(e) => handleChange("phone_number", e.target.value)}
                                               type={"text"}
                                               value={selectedPatient.phone_number}
                                               className="w-[60%] px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 dark:bg-dark-background dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                                    </div>
                                    <div>
                                        <p>T.C. Kimlik No</p>
                                        <input onChange={(e) => handleChange("TCKN", e.target.value)} type={"text"}
                                               value={selectedPatient.TCKN}
                                               className="w-[60%] px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 dark:bg-dark-background dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                                    </div>
                                    <div>
                                        <p>Cinsiyet</p>
                                        <input onChange={(e) => handleChange("gender", e.target.value)} type={"text"}
                                               value={selectedPatient.gender}
                                               className="w-[60%] px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 dark:bg-dark-background dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                                    </div>
                                    <div>
                                        <p>Doktor</p>
                                        <input onChange={(e) => handleChange("doctor", e.target.value)} type={"text"}
                                               value={selectedPatient.doctor}
                                               className="w-[60%] px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 dark:bg-dark-background dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <p className=" text-sm">Kayıt
                                            Tarihi</p>
                                        <p className="text-lg font-medium">
                                            {new Date(selectedPatient.created_at).toLocaleDateString("tr-TR", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </p>
                                        <p className="mt-2text-sm">Kayıt
                                            Eden</p>
                                        <p className="text-lg font-medium">
                                            {selectedPatient.created_by}
                                        </p>
                                    </div>
                                </div>

                                {/* Eylem Düğmeleri */}
                                <div className="flex space-x-4 border-t pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaveDisabled} // Eğer bilgiler değişmediyse devre dışı bırak
                                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                            isSaveDisabled
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-dark-button-primary hover:bg-dark-button-secondary text-text-primary'
                                        }`}
                                    >
                                        Kaydet
                                    </button>
                                    {!isDeleteDisabled && (
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 bg-button-secondary text-text-primary rounded-lg hover:bg-button-primary transition-all duration-200"
                                        >
                                            Sil
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p>Bir hasta seçin.</p>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
