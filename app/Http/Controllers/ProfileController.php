<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function updateRole(Request $request, $id)
    {
        // Validez l'entrée. Assurez-vous que `role_id` est le nom correct du champ attendu.
        $validatedData = $request->validate([
            'role_id' => 'required|exists:roles,id', // Assurez-vous que 'roles' est le nom de votre table des rôles et 'id' est la colonne de clé primaire dans cette table.
        ]);

        // Trouver l'utilisateur par ID et mettre à jour son rôle.
        // Assurez-vous que User est correctement importé avec use App\Models\User; ou le namespace approprié.
        $user = User::find($id);
        if (!$user) {
            return Redirect::back()->withErrors(['user_not_found' => 'Utilisateur non trouvé.']);
        }

        // Mettre à jour le rôle de l'utilisateur.
        $user->role_id = $validatedData['role_id'];
        $user->save();

        // Rediriger l'utilisateur vers une page, par exemple la page de modification de profil, avec un message de succès.
        return Redirect::route('profile.edit')->with('success', 'Le rôle a été mis à jour avec succès.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function index()
    {
        $userRole = Auth::user()->id_role;
        if ($userRole == 1) {
            $Users = User::all();
            return response()->json($Users);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }
}
