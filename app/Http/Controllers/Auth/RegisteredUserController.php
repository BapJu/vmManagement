<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);




        event(new Registered($user));

        Auth::login($user);
        // Création du personal access token pour l'utilisateur.
        $token = $user->createToken('api_token')->plainTextToken;


        // Sauvegarder dans une session ou le renvoyer avec la réponse.
        // Pour cet exemple, disons que vous voulez juste rediriger l'utilisateur
        // vers la page d'accueil et attacher le token à la session (ou en flash session).
        session()->flash('api_token', $token);

        return redirect(RouteServiceProvider::HOME)->with('api_token', $token);

        //return redirect(RouteServiceProvider::HOME);
    }
}
