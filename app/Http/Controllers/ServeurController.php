<?php

namespace App\Http\Controllers;

use App\Models\Serveur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ServeurController extends Controller
{
    public function index()
    {
        $TypeOfVms = Serveur::all();
        return response()->json($TypeOfVms);
    }


    // Méthode pour créer un nouveau rôle
    public function store(Request $request)
    {
        $Serveur = new Serveur();
        $Serveur->address_ip = $request->input('address_ip');
        $Serveur->noeud = $request->input('noeud');
        $Serveur->ssh_user = $request->input('ssh_user');
        $Serveur->ssh_password = Hash::make($request->input('ssh_password'));
        $Serveur->save();

        return response()->json(['message' => 'Serveur created successfully']);
    }

    // Méthode pour afficher un rôle spécifique
    public function show($id)
    {
        $Serveur = Serveur::find($id);
        if (!$Serveur) {
            return response()->json(['message' => 'Serveur not found'], 404);
        }
        return response()->json($Serveur);
    }

    // Méthode pour mettre à jour un rôle
    public function update(Request $request, $id)
    {
        $Serveur = Serveur::find($id);
        if (!$Serveur) {
            return response()->json(['message' => 'Serveur not found'], 404);
        }

        $Serveur->address_ip = $request->input('adress_ip');
        $Serveur->noeud = $request->input('noeud');
        $Serveur->ssh_user = $request->input('ssh_user');
        $Serveur->ssh_password = Hash::make($request->input('ssh_password'));
        $Serveur->updated_at = now();
        $Serveur->save();

        return response()->json(['message' => 'Serveur updated successfully']);
    }

    // Méthode pour supprimer un rôle
    public function destroy($id)
    {
        $Serveur = Serveur::find($id);
        if (!$Serveur) {
            return response()->json(['message' => 'Serveur not found'], 404);
        }

        $Serveur->delete();

        return response()->json(['message' => 'Serveur deleted successfully']);
    }






}
