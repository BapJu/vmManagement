import {useEffect, useState} from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        id_localisation: localisations[0] ? localisations[0].id : '' ?? '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [localisations, setLocalisation] = useState([]);

    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        fetch('/api/localisations')
            .then(response => response.json())
            .then(data => {
                setLocalisation(data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);
    console.log(data);
    const submit = (e) => {
        e.preventDefault();
        if (data.email.endsWith("@isen-ouest.yncrea.fr")) {
            setEmailError('');
            post(route('register'));
        } else {
            setEmailError('Vous devez utilisez une adresse ISEN pour vous inscrire');
        }


    };

    console.log(data);

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Full Name"/>

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="John Doe"
                        required
                    />

                    <InputError message={errors.name} className="mt-2"/>
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="id_localisation" value="Site"/>
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

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email"/>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => {
                            setData('email', e.target.value);
                            }
                        }
                        required
                    />
                        {emailError && <p className="text-red-500 mt-2">{emailError}</p>}

                    <InputError message={errors.email} className="mt-2"/>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password"/>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2"/>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password"/>

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2"/>
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
