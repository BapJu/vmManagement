<?php

namespace App\Http\Controllers;

use App\Models\Storage;
use Illuminate\Http\Request;

class StorageController extends Controller
{
    public function index()
    {
        $Storages = Storage::all();
        return response()->json($Storages);
    }

    // Méthode pour créer un nouveau rôle
    public function store(Request $request)
    {
        $Storage = new Storage();
        $Storage->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $Storage->save();

        return response()->json(['message' => 'Storage created successfully']);
    }

    // Méthode pour afficher un rôle spécifique
    public function show($id)
    {
        $Storage = Storage::find($id);
        if (!$Storage) {
            return response()->json(['message' => 'Storage not found'], 404);
        }
        return response()->json($Storage);
    }

    // Méthode pour mettre à jour un rôle
    public function update(Request $request, $id)
    {
        $Storage = Storage::find($id);
        if (!$Storage) {
            return response()->json(['message' => 'Storage not found'], 404);
        }

        $Storage->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $Storage->save();

        return response()->json(['message' => 'Storage updated successfully']);
    }

    // Méthode pour supprimer un rôle
    public function destroy($id)
    {
        $Storage = Storage::find($id);
        if (!$Storage) {
            return response()->json(['message' => 'Storage not found'], 404);
        }

        $Storage->delete();

        return response()->json(['message' => 'Storage deleted successfully']);
    }
}
