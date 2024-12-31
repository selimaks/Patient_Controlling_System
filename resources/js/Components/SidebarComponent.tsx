import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { HomeIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline'

export default function Sidebar({user}: { user: { name: string; email: string } }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={`${
                isCollapsed ? 'w-16' : 'w-64'
            } h-screen bg-background-secondary dark:bg-dark-background-secondary transition-all duration-300 shadow-lg`}
        >
            {/* Üst Logo */}
            <div className="flex items-center justify-between px-4 py-4">
                <Link href="/public" className={`${isCollapsed ? 'hidden' : 'block'} text-lg font-bold`}>
                    LOGO
                </Link>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-gray-500 dark:text-gray-400 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${isCollapsed ? '' : 'rotate-180'} transition-transform`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>

            {/* Kullanıcı Bilgisi */}
            {!isCollapsed && (
                <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-gray-800 dark:text-dark-text-primary text-base font-semibold">
                        {user.name}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                </div>
            )}

            {/* Menü Öğeleri */}
            <ul className="mt-4 space-y-2">
                <li>
                    <Link
                        href={route('dashboard')}
                        className="group flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-dark-text-primary rounded-lg"
                    >
                        <HomeIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-500" />
                        {!isCollapsed && <span className="ml-4">Dashboard</span>}
                    </Link>
                </li>
                <li>
                    <Link
                        href={route('appointments')}
                        className="group flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-dark-text-primary rounded-lg"
                    >
                        <CalendarIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-500" />
                        {!isCollapsed && <span className="ml-4">Randevular</span>}
                    </Link>
                </li>
                <li>
                    <Link
                        href={route('profile.edit')}
                        className="group flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-dark-text-primary rounded-lg"
                    >
                        <UserIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-500" />
                        {!isCollapsed && <span className="ml-4">Profil</span>}
                    </Link>
                </li>
                <li>
                    <Link
                        href={route('logout')}
                        method="post"
                        className="group flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-dark-text-primary rounded-lg"
                    >
                        {!isCollapsed && <span className="ml-4">Çıkış Yap</span>}
                    </Link>
                </li>
            </ul>
        </aside>
    );
}
