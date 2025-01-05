import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, router} from "@inertiajs/react";
import DashboardCard from "@/Components/DashboardCard";
import { useState } from "react";
import { isValid, parse, differenceInMinutes } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard({totalPatients, todaysPatients, todaysAppointments, totalAppointments, totalDoctors, completedAppointmentsToday, todaysSchedules, newPatients, }: {
    totalPatients: string;
    todaysPatients: string;
    todaysAppointments: string;
    totalAppointments: string;
    totalDoctors: string;
    completedAppointmentsToday: string;
    todaysSchedules: {
        id: number;
        name: string;
        TCKN: string; // Hasta bilgisi bazen null olabilir
        doctor_name: string;
        appointment_time: string;
        operation: string;
    }[];
    newPatients: { name: string; doctor: string; }[];
}) {
    console.log(todaysSchedules);
    const sortedSchedules = [...todaysSchedules].sort((a, b) =>
        a.appointment_time.localeCompare(b.appointment_time)
    );

    const [updatedSchedules, setUpdatedSchedules] = useState(sortedSchedules);

    // Randevu başlatma butonu için tıklama işlevi
    const handleStartAppointment = (id: number) => {
        router.put(`/dashboard/complete/${id}`, {id},{
            onSuccess: (page: any) => {
                setUpdatedSchedules((prevSchedules) =>
                    prevSchedules.filter((schedule) => schedule.id !== id)
                );
                toast.success(page.props.flash?.message || "Randevu güncellendi");
                console.log("Randevu güncellendi");
            },
            onError: (errors: any) => {
                toast.error(errors?.message || "Randevu güncellenemedi!");
            }
        })
    };



    // Randevuyu iptal etme butonu tıklama işlevi
    const handleCancelAppointment = (id: number) => {
        router.put(`/dashboard/cancel/${id}`, {id},{
            onSuccess: (page: any) => {
                setUpdatedSchedules((prevSchedules) =>
                    prevSchedules.filter((schedule) => schedule.id !== id)
                );
                toast.success(page.props.flash?.message || "Randevu iptal edildi");
                console.log("Randevu iptal edildi");
            },
            onError: (errors: any) => {
                toast.error(errors?.message || "Randevu güncellenemedi!");
            }
        })

    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-dark-text-primary">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <ToastContainer autoClose={3000} position="top-right" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow dark:bg-dark-background-secondary">
                            <div className="p-4">
                                <h3 className="text-center font-semibold text-gray-800 dark:text-dark-text-primary">
                                    Bugünkü Randevular
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table
                                    className="min-w-full h-full table-auto bg-white dark:bg-dark-background-secondary">
                                    <thead>
                                    <tr className="bg-gray-200 dark:bg-dark-background-secondary">
                                        <th className="text-center px-4 py-2  text-gray-600 dark:text-dark-text-primary">
                                            Hasta Adı
                                        </th>
                                        <th className="text-center px-4 py-2  text-gray-600 dark:text-dark-text-primary">
                                            Doktor Adı
                                        </th>
                                        <th className="text-center px-4 py-2  text-gray-600 dark:text-dark-text-primary">
                                            Randevu Saati
                                        </th>
                                        <th className="text-center px-4 py-2  text-gray-600 dark:text-dark-text-primary">
                                            Yapılacak İşlem
                                        </th>
                                        <th className="text-center px-4 py-2  text-gray-600 dark:text-dark-text-primary">
                                            İşlemler
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {updatedSchedules.map((schedule, index) => {
                                        const appointmentTime = parse(schedule.appointment_time, "HH:mm:ss", new Date()); // Saati parse ediliyor.
                                        const currentTime = new Date(); // Şimdiki zaman
                                        const isValidTime = isValid(appointmentTime); // appointment_time geçerli mi kontrol edin.
                                        let rowClassName = "dark:text-dark-text-primary dark:odd:bg-dark-background-secondary dark:even:bg-dark-background-tertiary";

                                        if (isValidTime) {
                                            const timeDifference = differenceInMinutes(appointmentTime, currentTime); // Zaman farkı hesaplanıyor.

                                            if (timeDifference <= 30 && timeDifference > 0) {
                                                rowClassName = "dark:text-text-primary dark:odd:bg-yellow-200 dark:even:bg-yellow-200"; // Randevu zamanı yaklaşıyor.
                                            } else if (timeDifference <= 0) {
                                                rowClassName = "text-text-primary dark:text-dark-text-primary dark:odd:bg-red-500 dark:even:bg-red-500"; // Randevu zamanı geçti.
                                            }
                                        } else {
                                            console.error("Randevu saati geçersiz: ", schedule.appointment_time); // Hatalı veya boş veri
                                        }

                                        return (
                                            <tr
                                                key={index}
                                                className={`${rowClassName} dark:odd:bg-dark-background-secondary dark:even:bg-dark-background-tertiary`}>
                                                <td className="px-4 py-2 ">
                                                    {schedule.name || "Hasta bilgisi yok"}
                                                </td>
                                                <td className="px-4 py-2 ">
                                                    {schedule.doctor_name}
                                                </td>
                                                <td className="px-4 py-2 ">
                                                    {schedule.appointment_time}
                                                </td>
                                                <td className="px-4 py-2 ">
                                                    {schedule.operation}
                                                </td>
                                                <td className="px-4 py-2 text-center text-[12px] grid grid-cols-2 ">
                                                    <button
                                                        className="bg-green-200 text-text-primary px-2 py-1 w-[3rem] h-[3rem] mr-4 rounded-full hover:bg-green-300"
                                                        onClick={() => handleStartAppointment(schedule.id)}
                                                    >
                                                        Başlat
                                                    </button>
                                                    <button
                                                        className="ml-2 bg-red-400 text-white px-2 py-1 w-[3rem] h-[3rem] mr-4 rounded-full hover:bg-red-500"
                                                        onClick={() => handleCancelAppointment(schedule.id)}
                                                    >
                                                        İptal
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="grid grid-rows-1 md:grid-rows-2 gap-6">
                            {/* Dashboard Cards */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <DashboardCard title="Toplam Kayıtlı Hasta Sayısı" value={totalPatients}/>
                                <DashboardCard title="Bugün Kayıtlı Hasta Sayısı" value={todaysPatients}/>
                                <DashboardCard title="Bugünkü Kayıtlı Randevular" value={todaysAppointments}/>
                                <DashboardCard title="Toplam Randevu Sayısı" value={totalAppointments}/>
                                <DashboardCard title="Doktor Sayısı" value={totalDoctors}/>
                                <DashboardCard
                                    title="Tamamlanan Randevu"
                                    value={completedAppointmentsToday}
                                />
                            </div>
                            {/* Kayıtlı Hasta Tablosu */}
                            <div className="bg-white rounded-lg shadow dark:bg-dark-background-secondary">
                                <div className="p-4">
                                    <h3 className="text-center font-semibold text-gray-800 dark:text-dark-text-primary">
                                        Bugün Kaydedilen Hastalar
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto bg-white dark:bg-dark-background-secondary">
                                        <thead>
                                        <tr className="bg-gray-200 dark:bg-dark-background-secondary">
                                            <th className="text-center px-4 py-2 text-gray-600 dark:text-dark-text-primary">
                                                Hasta İsmi
                                            </th>
                                            <th className="text-center px-4 py-2 text-gray-600 dark:text-dark-text-primary">
                                                Doktor
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            newPatients.map((patient, index) => (
                                                <tr
                                                    key={index}
                                                    className="odd:bg-white even:bg-gray-100 dark:odd:bg-dark-background-secondary dark:even:bg-dark-background-tertiary">
                                                    <td className="px-4 py-2 text-gray-800 dark:text-dark-text-primary">
                                                        {patient.name}
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-800 dark:text-dark-text-primary">
                                                        {patient.doctor}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
