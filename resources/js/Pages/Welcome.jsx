import {Link, Head} from '@inertiajs/react';

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
                        <div className="max-w-7xl mx-auto p-6 lg:p-8">
                            <div className="flex justify-center">
                                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                     width="1024.000000pt" height="1024.000000pt" viewBox="0 0 1024.000000 1024.000000"
                                     preserveAspectRatio="xMidYMid meet">

                                    <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
                                       fill="#000000" stroke="none">
                                        <path d="M0 5120 l0 -5120 5120 0 5120 0 0 5120 0 5120 -5120 0 -5120 0 0
-5120z m5305 3205 c74 -25 222 -101 565 -290 216 -119 798 -428 1420 -755 107
-56 273 -143 369 -194 131 -68 190 -106 238 -150 35 -32 63 -63 63 -70 0 -10
-63 -45 -460 -252 -85 -44 -263 -138 -395 -208 -132 -71 -530 -281 -885 -468
-355 -187 -711 -376 -792 -420 -151 -83 -209 -130 -246 -201 l-20 -39 -18 38
c-38 81 -39 81 -1014 594 -285 149 -502 265 -613 324 -45 24 -192 102 -327
173 -135 71 -276 146 -315 166 -38 20 -172 90 -297 155 -125 64 -228 121 -228
125 0 25 109 119 192 164 304 166 592 321 723 391 324 171 1132 608 1430 771
274 151 322 169 458 170 59 1 97 -5 152 -24z m2634 -2396 c18 -17 40 -48 50
-68 l19 -36 -95 -2 -94 -2 -167 -87 c-92 -48 -225 -117 -297 -155 -311 -163
-472 -246 -655 -338 -108 -55 -214 -109 -235 -121 -22 -13 -143 -77 -270 -142
-981 -512 -969 -505 -1010 -570 l-17 -28 -29 40 c-33 45 -73 72 -197 134 -48
24 -229 116 -402 206 -173 89 -486 250 -695 357 -209 107 -461 237 -560 288
-99 51 -283 145 -410 210 -126 64 -263 136 -304 158 -69 37 -83 41 -163 45
-48 3 -88 6 -88 9 0 14 42 81 62 99 30 28 89 64 105 64 8 0 13 -26 15 -82 l3
-81 670 -344 c369 -189 807 -414 974 -499 168 -86 390 -201 495 -256 105 -56
241 -125 301 -155 l110 -54 121 3 121 3 144 72 c79 40 223 115 319 166 96 52
279 147 405 212 127 65 266 138 310 162 44 25 166 87 270 140 221 111 440 224
645 333 80 42 209 110 288 150 l142 73 0 61 c0 33 3 71 6 83 l6 22 38 -19 c21
-11 52 -33 69 -51z m-4549 -1261 c0 -4 -3 -8 -7 -8 -17 1 -257 126 -260 135
-2 6 58 -19 132 -54 74 -36 135 -68 135 -73z m3770 116 c-64 -37 -198 -104
-207 -104 -11 0 230 129 242 129 6 1 -10 -11 -35 -25z m-4658 -136 l3 -82 120
-64 c166 -87 1004 -520 1450 -749 204 -105 469 -241 590 -304 121 -62 251
-129 290 -149 l69 -35 154 1 154 0 -46 -23 c-26 -13 -64 -42 -85 -64 l-39 -39
-31 39 c-23 29 -51 47 -109 71 -42 18 -106 49 -142 70 -36 21 -144 77 -240
125 -274 136 -1542 788 -2042 1049 -124 64 -129 66 -203 66 l-75 0 19 38 c11
20 28 47 38 59 17 20 99 73 115 73 4 0 8 -37 10 -82z m5376 63 c20 -11 49 -32
63 -48 24 -25 59 -83 59 -98 0 -3 -40 -5 -90 -5 l-90 0 0 33 c0 42 12 137 17
137 2 0 20 -9 41 -19z m-3980 -307 c-8 -7 -258 115 -258 126 0 5 59 -19 131
-56 72 -36 129 -67 127 -70z m2652 66 c-41 -21 -79 -39 -85 -39 -5 0 24 18 65
39 41 21 80 39 85 39 6 0 -24 -18 -65 -39z m-360 -195 c0 -3 -27 -18 -60 -35
-33 -17 -60 -28 -60 -25 0 2 26 18 58 34 64 34 62 33 62 26z m-1894 -75 c71
-36 131 -66 133 -67 2 -2 2 -6 -2 -9 -6 -6 -255 119 -272 138 -15 15 -4 11
141 -62z m1714 -20 c-30 -16 -59 -29 -65 -29 -5 0 15 13 45 29 30 16 60 29 65
29 6 0 -15 -13 -45 -29z m-341 -174 c-10 -9 -109 -56 -109 -51 0 6 91 54 104
55 5 0 7 -2 5 -4z m-860 -71 c73 -36 131 -68 128 -72 -8 -7 -267 118 -267 129
0 11 -9 15 139 -57z m741 10 c0 -6 -117 -65 -127 -65 -4 1 21 16 57 35 72 38
70 37 70 30z m-185 -665 c-3 -5 -12 -10 -18 -10 -7 0 -6 4 3 10 19 12 23 12
15 0z"/>
                                        <path d="M5015 8061 c-59 -21 -159 -71 -305 -151 -58 -32 -262 -142 -455 -245
-192 -103 -393 -211 -445 -240 -52 -29 -282 -153 -510 -275 -228 -121 -421
-228 -427 -237 -36 -47 7 -112 78 -120 49 -6 57 -2 379 172 69 37 233 125 365
195 232 122 559 298 1004 538 294 158 287 156 451 156 97 0 147 -4 176 -15 23
-9 230 -116 460 -239 608 -325 625 -334 904 -482 140 -74 334 -177 430 -228
184 -98 239 -115 290 -88 53 28 56 93 6 130 -12 9 -92 53 -177 98 -85 45 -210
113 -279 150 -69 37 -330 177 -580 311 -250 133 -507 270 -570 304 -63 34
-193 103 -287 154 -95 51 -197 101 -228 112 -73 25 -210 26 -280 0z"/>
                                        <path d="M5018 7591 c-31 -10 -148 -67 -260 -126 -111 -59 -311 -165 -443
-235 -132 -70 -395 -209 -585 -308 -190 -99 -360 -193 -377 -210 -42 -38 -44
-78 -5 -114 15 -14 70 -49 122 -76 446 -235 1032 -543 1105 -582 307 -162 394
-208 430 -223 91 -38 173 -43 265 -15 38 12 312 153 800 413 173 92 443 235
600 317 157 81 293 158 303 169 24 29 21 71 -5 100 -13 13 -104 66 -203 118
-347 181 -962 505 -1185 625 -297 159 -314 166 -420 165 -54 0 -106 -7 -142
-18z m467 -373 c138 -72 282 -148 322 -170 71 -38 123 -86 123 -113 0 -28 -77
-74 -367 -225 -163 -84 -312 -167 -330 -183 -19 -17 -42 -46 -52 -65 l-18 -36
-18 37 c-30 63 -27 61 -580 348 -60 32 -126 70 -145 87 -31 26 -34 31 -23 54
6 14 27 37 45 51 35 27 600 322 658 344 71 27 117 11 385 -129z"/>
                                    </g>
                                </svg>

                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto p-6 lg:p-8">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Bienvenue sur VM
                                    Management</h1>
                                <p className="mt-4 text-gray-600 dark:text-gray-300">La plateforme de gestion des
                                    machines virtuelles de l'ISEN Brest</p>
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
