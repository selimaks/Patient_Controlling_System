import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DashboardCard from "@/Components/DashboardCard"; // Oluşturulan bileşeni import ediyoruz

export default function Dashboard({totalPatients, todaysPatients, todaysAppointments, totalAppointments, totalDoctors, completedAppointmentsToday, todaysSchedules, newPatients,}: {
    totalPatients: string;
    todaysPatients: string;
    todaysAppointments: string;
    totalAppointments: string;
    totalDoctors: string;
    completedAppointmentsToday: string;
    todaysSchedules: {
        patient: { name: string; TCKN: string }; // Hasta bilgisi bazen null olabilir
        doctor_name: string;
        appointment_time: string;
        reason: string;
    }[];
    newPatients: { name: string; doctor: string; }[];
}) {
    console.log(todaysSchedules);
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-dark-text-primary">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <DashboardCard title="Toplam Kayıtlı Hasta Sayısı" value={totalPatients}/>
                        <DashboardCard title="Bugün Kayıtlı Hasta Sayısı" value={todaysPatients}/>
                        <DashboardCard title="Bugünkü Kayıtlı Randevular" value={todaysAppointments}/>
                        <DashboardCard title="Toplam Randevu Sayısı" value={totalAppointments}/>
                        <DashboardCard title="Doktor Sayısı" value={totalDoctors}/>
                        <DashboardCard
                            title="Bugün Tamamlanan Randevular"
                            value={completedAppointmentsToday}
                        />
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* İkinci Tablo - Bugünkü Randevular */}
                        <div className="bg-white rounded-lg shadow dark:bg-dark-background-secondary">
                            <div className="p-4">
                                <h3 className="text-center font-semibold text-gray-800 dark:text-dark-text-primary">
                                    Bugünkü Randevular
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto bg-white dark:bg-dark-background-secondary">
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
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {todaysSchedules.map((schedule, index) => (
                                        <tr
                                            key={index}
                                            className="odd:bg-white even:bg-gray-100 dark:odd:bg-dark-background-secondary dark:even:bg-dark-background-tertiary"
                                        >
                                            <td className="px-4 py-2 text-gray-800 dark:text-dark-text-primary">
                                                {schedule.patient?.name || "Hasta bilgisi yok"}
                                            </td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-dark-text-primary">
                                                {schedule.doctor_name}
                                            </td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-dark-text-primary">
                                                {schedule.appointment_time}
                                            </td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-dark-text-primary">
                                                {schedule.reason}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* İlk Tablo */}
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
                                                className="odd:bg-white even:bg-gray-100 dark:odd:bg-dark-background-secondary dark:even:bg-dark-background-tertiary"
                                            >
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
        </AuthenticatedLayout>
    );
}
