import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppointmentModal from '../Components/AppointmentModal'; //
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//--Veritabanından gelen hasta bilgileri tanımı başlangıcı--
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

interface Doctor {
    name: string;
}
//--Veritabanından gelen hasta ve doktor bilgileri tanımı bitişi--

export default function Patients() {

    const user = usePage().props.auth.user;
    const { patients, doctors } = usePage().props;

    //--Patients sayfasına özel kaydırma işlemini devre dışı bırakma başlangıcı--
    useEffect(() => {
        // Tüm sayfa kaydırmasını devre dışı bırak
        document.body.style.overflow = 'hidden';

        return () => {
            // Sayfadan çıkıldığında kaydırmayı geri yükle
            document.body.style.overflow = 'auto';
        };
    }, []);
    //--Patients sayfasına özel kaydırma işlemini devre dışı bırakma bitişi--


    //--Hasta Ekleme/Güncelleme Başlangıcı--
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [originalPatient, setOriginalPatient] = useState<Patient | null>(null);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
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
    const handleSelect = (id: number) => {
        const patient = (patients as Patient[]).find((p: Patient) => p.id === id); // Seçilen hastayı bul
        setSelectedPatient(patient ?? null); // Sağdaki detay alanına göndermek için durumu ayarla
        setOriginalPatient(patient ?? null); // Hasta seçildiğinde orijinal bilgiyi sakla
    };
    useEffect(() => {
        if (originalPatient && selectedPatient) {
            const isSame =
                JSON.stringify(originalPatient) === JSON.stringify(selectedPatient);
            setIsSaveDisabled(isSame || !validateTCKN(selectedPatient.TCKN) || !isPhoneNumberValid(selectedPatient.phone_number)|| !isValidEmail(selectedPatient.email));
        }
    }, [originalPatient, selectedPatient]);
    const handleSave = () => {
        if (selectedPatient) {
            if (selectedPatient.id === 0) {
                // Yeni hasta oluşturulacaksa POST isteği
                router.post('/patients/create', { ...selectedPatient }, {
                    onSuccess: (page: any) => {
                        const successMessage = page.props.flash?.message || "Hasta başarıyla eklendi!";
                        toast.success(successMessage);
                        console.log("Yeni Hasta Eklendi: ", selectedPatient.name);
                    },
                    onError: (errors: any) => {
                        const errorMessage = errors?.message || "Hata: Bu TC kimlik numarasına kayıtlı hasta bulunuyor!";
                        toast.error(errorMessage);
                        console.log("Hasta Eklenemedi: ", selectedPatient.name);
                    }
                });
            } else {
                // Mevcut hasta güncellenecekse PUT isteği
                router.put(`/patients/update/${selectedPatient.id}`, { ...selectedPatient }, {
                    onSuccess: (page: any) => {
                        const successMessage = page.props.flash?.message || "Hasta başarıyla güncellendi!";
                        toast.success(successMessage);
                        console.log("Hasta Güncellendi: ", selectedPatient.name);
                        setOriginalPatient(selectedPatient);
                    },
                    onError: (errors: any) => {
                        const errorMessage = errors?.message || "Hata: Güncelleme başarısız!";
                        toast.error(errorMessage); // Hata mesajı
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
    //--Hasta Ekleme/Güncelleme Bitişi--

    //--Silme İşlemi başlangıcı--
    const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);
    useEffect(() => {
        if (!selectedPatient || selectedPatient.id === 0) {
            setIsDeleteDisabled(true);
        } else {
            setIsDeleteDisabled(false);
        }
    }, [selectedPatient]);
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
    //--Silme işlemi bitişi--

    //--Hasta Kayıt İptal İşlemi Başlangıcı--
    const setSelectedPatientToNull = () => {
        setSelectedPatient(null);
    }
    //--Hasta Kayıt İptal İşlemi Bitişi--

    //--Randevu oluşturma başlangıcı--
    // Modal görünürlük durumu
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState({
        patient_id: '',
        appointment_date: '',
        appointment_time: '',
        doctor_name: '',
        operation: '',
        notes: '',
        created_at: new Date().toISOString(),
        created_by: user.name,
        status: '',
    });
    // Modal'ı aç/kapat
    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
        setAppointmentDetails({
            patient_id: selectedPatient?.TCKN ?? '',
            appointment_date: '',
            appointment_time: '',
            doctor_name: selectedPatient?.doctor.toString() ?? '',
            operation: '',
            notes: '',
            created_at: new Date().toISOString(),
            created_by: user.name,
            status: 'scheduled',
        });
    };
    const handleAppointmentChange = (field: string, value: string) => {
        setAppointmentDetails({
            ...appointmentDetails,
            [field]: value,
        });
    };
    const handleCreateAppointment = () => {
        // Randevu oluşturma işlemi burada yapılacaktır
        console.log(selectedPatient);
        console.log(appointmentDetails);
        router.post('/appointments/create', {...appointmentDetails}, {
                onSuccess: (page: any) => {
                    console.log('Randevu Oluşturuldu:', appointmentDetails);
                    const successMessage = page.props.flash?.message || "Randevu Oluşuturuldu";
                    toast.success(successMessage);
                    setAppointmentDetails({
                            patient_id: '',
                            appointment_date: '',
                            appointment_time: '',
                            doctor_name: selectedPatient?.doctor.toString() ?? '',
                            operation: '',
                            notes: '',
                            created_at: new Date().toISOString(),
                            created_by: user.name,
                            status: '',
                        }
                    )

                },
                onError: (errors: any) => {
                    const errorMessage = errors?.message || "Hata: Randevu oluşturulamadı!";
                    toast.error(errorMessage);
                    console.log('Randevu Oluşturulamadı');
                }
        });

        // Backend çağrısı (örneğin, POST isteği)
        // router.post('/appointments/create', { ...appointmentDetails });

        // Modalı kapat
        handleModalToggle();
    };
    //--Randevu Oluşturma bitişi--

    //--TC Kimlik No Kontrol Başlangıcı--
    function validateTCKN(tckn: string): boolean {
        // 11 haneli ve sayısal mı kontrolü
        if (!/^[1-9][0-9]{10}$/.test(tckn)) {
            return false;
        }

        // Rakamları diziye ayır
        const digits = tckn.split('').map(Number);

        // Tek ve çift hane toplamları
        const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
        const evenSum = digits[1] + digits[3] + digits[5] + digits[7];

        // 10. hane kontrolü
        const tenthDigit = ((oddSum * 7) - evenSum) % 10;
        if (tenthDigit !== digits[9]) {
            return false;
        }

        // 11. hane kontrolü
        const firstTenSum = digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0);
        const eleventhDigit = firstTenSum % 10;
        if (eleventhDigit !== digits[10]) {
            return false;
        }
        return true;
    }
    //--TC Kimlik No Kontrol Bitişi--

    //--Telefon numarası kontrol başlangıcı--
    const formatPhoneNumber = (value: string): string => {
        // "+90-" kısmını sabit bırak ve yalnızca kullanıcı girişini formatla
        const numbersOnly = value.replace(/\D/g, '').replace(/^90/, ''); // "+90" kısmını dikkatten çıkar
        const match = numbersOnly.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return `+90-${match[1]}-${match[2]}-${match[3]}`;
        } else if (numbersOnly.length > 7) {
            return `+90-${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 6)}-${numbersOnly.slice(6)}`;
        } else if (numbersOnly.length > 3) {
            return `+90-${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
        } else if (numbersOnly.length > 0) {
            return `+90-${numbersOnly}`;
        }

        return '+90'; // Kullanıcı boş bıraktıysa sadece "+90" döndür
    };
    const isPhoneNumberValid = (phone: string): boolean => {
        // Telefon numarası "+90-" ile başlamıyor veya toplam uzunluk 16 değilse false
        return phone.startsWith("+90-") && phone.length === 16;
    };
    const handlePhoneNumberChange = (value: string) => {
        const formattedPhone = formatPhoneNumber(value);
        // Eğer değer 16 karakteri geçiyorsa işlem yapma
        if (value.length > 16) return;
        handleChange("phone_number", formattedPhone);
    };
    //--Telefon numarası kontrol bitişi--

    //--E-posta kontrol başlangıcı--
    const isValidEmail = (email: string): boolean => {
        // Geçerli e-posta doğrulama regex'i
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {return true}
        return emailRegex.test(email);
    };
    //--E-posta kontrol bitişi--

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
                <ToastContainer autoClose={3000} position="top-right" />

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
                                               className={`w-[60%] px-4 py-2 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2   dark:bg-dark-background  dark:text-gray-200  ${
                                                   isValidEmail(selectedPatient.email) ? 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-500' : 'border-red-500 dark:focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                                               }`}></input>
                                    </div>
                                    <div>
                                        <p className=" ml-2 text-sm">Telefon</p>
                                        <input onChange={(e) => handlePhoneNumberChange(e.target.value)}
                                               type={"text"}
                                               value={selectedPatient.phone_number || "+90-"}
                                               className={`w-[60%] px-4 py-2 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2   dark:bg-dark-background  dark:text-gray-200  ${
                                                   isPhoneNumberValid(selectedPatient.phone_number) ? 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-500' : 'border-red-500 dark:focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                                               }`}></input>
                                    </div>
                                    <div>
                                        <p>T.C. Kimlik No</p>
                                        <input onChange={(e) => handleChange("TCKN", e.target.value)} type={"text"}
                                               value={selectedPatient.TCKN}
                                               className={`w-[60%] px-4 py-2 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2   dark:bg-dark-background  dark:text-gray-200  ${
                                                   validateTCKN(selectedPatient.TCKN) ? 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-500' : 'border-red-500 dark:focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                                               }`}></input>
                                    </div>
                                    <div>
                                        <p>Cinsiyet</p>
                                        <select
                                            onChange={(e) => handleChange("gender", e.target.value)} // Seçileni handleChange ile al
                                            value={selectedPatient.gender}
                                            className="w-[60%] px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-dark-background dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                            <option value="" disabled>
                                                Seçiniz
                                            </option>
                                            <option value="male">Erkek</option>
                                            <option value="female">Kadın</option>
                                            <option value="other">Diğer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <p>Doktor</p>
                                        <select
                                            onChange={(e) => handleChange("doctor", e.target.value)} // Seçilen doktoru handleChange ile al
                                            value={selectedPatient.doctor}
                                            className="w-[60%] px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-dark-background dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                                ? 'bg-gray-400 text-text-primary cursor-not-allowed'
                                                : 'bg-dark-button-primary hover:bg-dark-button-secondary text-text-primary'
                                        }`}
                                    >
                                        {isDeleteDisabled ? 'Kaydet' : 'Güncelle'}
                                    </button>
                                    {isDeleteDisabled ? (
                                        <button
                                            onClick={setSelectedPatientToNull}
                                            className="px-4 py-2 bg-button-secondary text-text-primary rounded-lg hover:bg-button-primary transition-all duration-200"
                                        >
                                            İptal
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleModalToggle}
                                                className="px-4 py-2 bg-background-quaternary text-text-primary rounded-lg hover:bg-background-quinary transition-all duration-200"
                                            >
                                                Randevu Oluştur
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="px-4 py-2 bg-button-secondary text-text-primary rounded-lg hover:bg-button-primary transition-all duration-200"
                                            >
                                                Sil
                                            </button>
                                        </>
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
                {/* Modal */}
                <AppointmentModal
                    open={isModalOpen}
                    onClose={handleModalToggle}
                    appointmentDetails={appointmentDetails}
                    selectedPatientName={selectedPatient?.name || 'Hata - Sayfayı Yenileyin!'}
                    onAppointmentChange={handleAppointmentChange}
                    onCreateAppointment={handleCreateAppointment}
                />
            </AuthenticatedLayout>
        </div>
    );
}
