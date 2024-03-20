import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm} from '@inertiajs/react';
import {useEffect, useState, useCallback } from 'react';

export default function Dashboard({ auth }) {
    const [vmStats, setVmStats] = useState({ totalCreated: 0, totalActive: 0 });
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(() => auth.user.id_role === 4);
    const [showForm, setShowForm] = useState(false);
    const [localisations, setLocalisations] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [storages, setStorages] = useState([]);
    const [serveurs, setServeurs] = useState([]);
    const [error, setError] = useState('');

    const { data, setData, errors, processing } = useForm({
        id_localisation: 1,
        id_subject: null,
        id_typeofvm: null,
        id_storage: 1,
        nb_vm: 1,
        id_user: auth.user.id,
        end_date: null,
        name_vm: null,
        start_vm : true,
        serveur_id : 1,
    });

    const nameParts = auth.user.name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');


    const toggleFormDisplay = () => setShowForm(!showForm);

    const handleVmCountChange = (e) => {
        const newCount = e.target.value;
        setData('nb_vm', newCount);
    };

    const getSubjectDescription = useCallback((id) => {
        const subject = subjects.find(subject => subject.id === Number(id));
        return subject ? subject.description.substring(0, 7) : 'XXXXXX';
    }, [subjects]);


    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('bearerToken');
                const response = await fetch('/api/events/current_user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const eventData = await response.json();
                // Filtrer les VMs créées et actives
                const totalCreated = eventData.length;
                const totalActive = eventData.filter(event => event.active === true).length;
                setVmStats({ totalCreated, totalActive });
            } catch (error) {
                console.error('Error fetching VM stats:', error);
                setError('An error occurred while fetching VM stats. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);




    useEffect(() => {
        const fetchAPIs = async () => {
            try {
                const responses = await Promise.all([
                    fetch('/api/localisations'),
                    fetch('/api/subjects'),
                    fetch('/api/storages'),
                    fetch('/api/serveurs')
                ]);
                const [localisationsData, subjectsData, storagesData, serveursData] = await Promise.all(responses.map(res => res.json()));

                setLocalisations(localisationsData);
                setSubjects(subjectsData);
                setStorages(storagesData);
                setServeurs(serveursData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching data. Please try again.');
            }
        };
        fetchAPIs();
    }, []);

    useEffect(() => {
        if (data.id_localisation && data.id_subject) {
            fetch(`/api/typeOfVms/location=${data.id_localisation}/subject=${data.id_subject}/serveur=${data.serveur_id}`)
                .then(response => response.json())
                .then(setTemplates)
                .catch(error => {
                    console.error('Error fetching templates:', error);
                    setError('An error occurred while fetching templates. Please try again.');
                });
        }
    }, [data.id_localisation, data.id_subject, data.serveur_id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('bearerToken');
            const response = await fetch('/api/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.redirected) {
                window.location.href = response.url;
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error creating VM:', error);
            setError('An error occurred while creating VM. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    data.prefix_name_vm = `${initials}-${getSubjectDescription(data.id_subject || 1)}-`;
    console.log(data);
    return (<AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}

        >

            <Head title="Dashboard"/>
            {auth.user.id_role===4 && (
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mt-8 bg-yellow-200 border-l-4 border-yellow-500 text-yellow-700 p-4 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="font-semibold text-lg">Vous n'avez pas les droits de modification, merci de prendre contact avec un admin </h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* VM Statistics Dashboard */}
                    <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="font-semibold text-lg">Vos Statistics VM</h3>
                            <div>Total VMs Created: {vmStats.totalCreated}</div>
                            <div>Total VMs Active: {vmStats.totalActive}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ax-w-7xl mx-auto sm:px-6 lg:px-8 mb-4">
                <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="max-w-lg mx-auto mt-4 mb-4">
                        <h3 className="font-semibold text-lg">Créer une VM</h3>
                        <div className="flex justify-center items-center" style={{minHeight: '500px'}}>
                            {!showForm &&(
                            <div className="flex justify-center items-center mt-4">
                                <button
                                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={toggleFormDisplay} // Lorsqu'on clique, on change l'état pour afficher le formulaire
                                    disabled={auth.user.id_role===4}
                                >
                                    Déployer des VMs
                                </button>
                            </div>
                            )}
                            {showForm && (
                                isLoading ? (
                                    <div
                                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                        role="status">
            <span
                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label htmlFor="localisation" className="block text-gray-700">Site:</label>
                                            <select
                                                id="localisation"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                onChange={(e) => setData('id_localisation', e.target.value)}
                                                required
                                            >
                                                {localisations.map(localisation => (<option key={localisation.id}
                                                                                            value={localisation.id}>{localisation.name}</option>))}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="subject" className="block text-gray-700">Domaine:</label>
                                            <select
                                                id="subject"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                onChange={(e) => setData('id_subject', e.target.value)}
                                                required
                                            >
                                                <option value="">Choisissez votre domaine</option>
                                                {subjects.map(subject => (<option key={subject.id}
                                                                                  value={subject.id}>{subject.description}</option>))}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="serveur" className="block text-gray-700">Serveurs:</label>
                                            <select
                                                id="serveur"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                onChange={(e) => setData('serveur_id', e.target.value)}
                                                required
                                            >
                                                {serveurs.map(serveur => (<option key={serveur.id}
                                                                                  value={serveur.id}>{serveur.noeud}</option>))}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="storage" className="block text-gray-700">Mémoire:</label>
                                            <select
                                                id="storage"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                onChange={(e) => setData('id_storage', e.target.value)}
                                                required
                                            >
                                                {storages.map(storage =>
                                                        storage.serveur_id === data.serveur_id && (
                                                            <option key={storage.id} value={storage.id}>
                                                                {storage.name}
                                                            </option>
                                                        )
                                                )}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="template" className="block text-gray-700">Template:</label>
                                            <select
                                                id="template"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                onChange={(e) => setData('id_typeofvm', e.target.value)}
                                                required
                                            >
                                                <option value="">Choisissez votre template</option>
                                                {templates.map(template =>
                                                    template.serveur_id === data.serveur_id && (
                                                        <option
                                                            key={template.id} value={template.id}>{template.description}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="name_vm" className="block text-gray-700">Nom de la
                                                VM</label>
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    value={`${initials}-${getSubjectDescription(data.id_subject)}-`}
                                                    className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    disabled
                                                />
                                                <input
                                                    id="name_vm"
                                                    type="text"
                                                    maxLength="7"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    onChange={(e) => setData('name_vm', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    value="-XXXXX"
                                                    className="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="end_date" className="block text-gray-700">Date de fin des
                                                Vms:</label>
                                            <input
                                                id="end_date"
                                                type="date"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                onChange={(e) => setData('end_date', e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="vmCount" className="block text-gray-700">Nombre de VM à
                                                créer:</label>
                                            <input
                                                id="vmCount"
                                                type="number"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                value={data.nb_vm}
                                                onChange={handleVmCountChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="start_vm" className="block text-gray-700">Démarrer les VMs à
                                                la création:</label>
                                            <button
                                                id="start_vm"
                                                type="button"
                                                className={`mt-1 block w-14 h-8 rounded-full shadow-sm ${data.start_vm ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                                role="switch"
                                                aria-checked={data.start_vm}
                                                onClick={() => setData('start_vm', !data.start_vm)}
                                            >
                                                <span
                                                    className={`transform transition duration-300 ease-in-out ${data.start_vm ? 'translate-x-6' : 'translate-x-0'} block w-6 h-6 bg-white rounded-full shadow-sm`}></span>
                                            </button>
                                        </div>

                                        <button
                                            type="submit"
                                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            disabled={isLoading}
                                        >
                                            Créer VM
                                        </button>

                                        {isLoading && <div>Loading...</div>}
                                    </form>
                                )
                            )}

                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>


    );
}
