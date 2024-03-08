import {Link, Head} from '@inertiajs/react';
import logo from '/img/logo.png';
export default function Welcome({auth}) {
    return (
        <>
            <Head title="VM Management - ISEN Brest"/>
            <div
                className="flex flex-col min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="flex-grow">
                    <div className="sm:flex sm:justify-center sm:items-center p-6">
                        <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                    >
                                        Log in
                                    </Link>

                                    <Link
                                        href={route('register')}
                                        className="ms-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className="max-w-4xl mx-auto p-6 lg:p-8">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Bienvenue sur VM
                                    Management</h1>
                                <p className="mt-4 text-gray-600 dark:text-gray-300">La plateforme de gestion des
                                    machines virtuelles de l'ISEN Brest</p>

                            </div>
                            <div className="flex justify-center">
                                <img src={logo} alt="ISEN Brest" className="w-1/2"/>
                            </div>

                            <div className="mt-12">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Objectifs du
                                    projet</h2>
                                <p className="mt-4 text-gray-600 dark:text-gray-300">
                                    Les objectifs de VM Management sont divers. Dans un premier temps, faciliter la
                                    création, la gestion et le suivi des machines virtuelles, et la rendre accessible
                                    pour tous les enseignants de manière instinctive tout en assurant la sécurité et
                                    l’efficacité des opérations. Par la suite, ce projet aura pour but d’effectuer une
                                    analyse statique des ressources mises à disposition quant à l’utilisation des
                                    machines virtuelles à l’ISEN. Ainsi, suite à ces différentes analyses, il sera plus
                                    évident pour les informaticiens en charge de la maintenance des systèmes virtuels de
                                    savoir comment améliorer la performance de ces outils mis à disposition pour les
                                    étudiants. Enfin, un dernier objectif est de fournir une plateforme viable et
                                    maintenue facilement via une documentation claire et concise.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="py-6 bg-gray-100 dark:bg-gray-800">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Created by Baptiste & Alexis - Projet M1 2024
                    </div>
                </footer>
            </div>

            <style>{`
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3Csvg%3E");
                }
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-dots-lighter {
                        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3Csvg%3E");
                    }
                }
            `}</style>
        </>
    );
}
