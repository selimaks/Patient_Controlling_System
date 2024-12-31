import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head , usePage } from '@inertiajs/react';
import EventCalendar from "@/Components/EventCalendar";


interface Appointment {
    id: number;
    created_at: string;
    updated_at: string;
    appointment_date: string;
    appointment_time: string;
    patient_id: string;
    doctor_id: string;
    status: string;
    reason: string;
    notes: string;
}
export default function Appointments() {
    const appointments = usePage().props.appointments as Appointment[];
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Randevular
                </h2>
            }
        >
            <Head title="Appointments" />

            <div className="py-12">
                <div className=" mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <EventCalendar/>
                    {/*<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                        </div>
                    </div>*/}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
