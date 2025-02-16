import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import '../../css/mainPage.css'

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {

    return (
        <>
            <Head title="Hoşgeldiniz" />
            <div className="bg-gray-50 text-black/50 dark:bg-dark-background dark:text-white/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">

                        <main className="mt-6">
                            <div className='selimaks-container' id='selimaks'>
                                <ul className='nav-buttons'>
                                    <img alt='Selimaks' className='logo' id='logo'
                                         src={'/logo.png'}/>
                                    {auth.user ? (
                                        <>
                                            <li>{auth.user.name}</li>
                                            <li>
                                                <Link href={route('dashboard')}>DASHBOARD</Link>
                                            </li>
                                            <li>
                                                <Link href={route("patients")} as="button">
                                                    PATIENTS
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={route("appointments")} as="button">
                                                    APPOINTMENTS
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={route('profile.edit')}>PROFILE</Link>
                                            </li>

                                            <li>
                                                <Link href={route("logout")} method="post" as="button">
                                                    LOG OUT
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>SELIMAKS</li>
                                            <li>
                                                <Link href={route('login')}>LOG IN</Link>
                                            </li>
                                            <li>
                                                <Link href={route('register')}>REGISTER</Link>
                                            </li>
                                        </>
                                    )}
                                </ul>
                                <div className='social'>
                                    <div className='social-button' id='mail'>
                                        <img alt='email' id='mail' src='https://selimaks.github.io/selimaks.com.tr/emaillogo.png'/>
                                    </div>
                                    <div className='social-button' id='linkedin'>
                                        <img alt='linkedin' id='mail'
                                             src='https://selimaks.github.io/selimaks.com.tr/linkedinlogo.png'/>
                                    </div>
                                    <div className='social-button' id='instagram'>
                                        <img alt='instagram' id='mail' src='https://selimaks.github.io/selimaks.com.tr/instalogo.png'/>
                                    </div>
                                    <div className='social-button' id='twitter'>
                                        <img alt='twitter' id='mail'
                                             src='https://selimaks.github.io/selimaks.com.tr/twitterlogo.png'/>
                                    </div>
                                    <div className='social-button' id='discord'>
                                        <img alt='discord' id='mail'
                                             src='https://selimaks.github.io/selimaks.com.tr/discordlogo.png'/>
                                    </div>
                                </div>
                            </div>
                        </main>

                        <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                            Selim Aksoy - 2025
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
