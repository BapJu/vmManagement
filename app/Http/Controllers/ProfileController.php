<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
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
        // Validez l'entrée avec Validator pour une meilleure personnalisation de la réponse en cas d'échec.
        $validator = Validator::make($request->all(), [
            'id_role' => 'required|exists:role,id',
        ]);

        // Vérifiez si la validation échoue.
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422); // Code de statut 422 Unprocessable Entity pour les erreurs de validation.
        }

        // Trouver l'utilisateur par ID.
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404); // Code de statut 404 Not Found si l'utilisateur n'existe pas.
        }

        // Mettre à jour le rôle de l'utilisateur avec les données validées.
        $user->id_role = $validator->validated()['id_role'];
        $user->save();

        // Retourner une réponse JSON avec un message de succès.
        return response()->json(['message' => 'Le rôle a été mis à jour avec succès.'], 200); // Code de statut 200 OK pour une opération réussie.
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
