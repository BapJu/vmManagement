<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;

class LocationController extends Controller
{
    public function index()
    {
        $Locations = Location::all();
        return response()->json($Locations);
    }

    // Méthode pour créer un nouveau rôle
    public function store(Request $request)
    {
        $Location = new Location();
        $Location->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $Location->save();

        return response()->json(['message' => 'Location created successfully']);
    }

    // Méthode pour afficher un rôle spécifique
    public function show($id)
    {
        $Location = Location::find($id);
        if (!$Location) {
            return response()->json(['message' => 'Location not found'], 404);
        }
        return response()->json($Location);
    }

    // Méthode pour mettre à jour un rôle
    public function update(Request $request, $id)
    {
        $Location = Location::find($id);
        if (!$Location) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        $Location->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $Location->save();

        return response()->json(['message' => 'Location updated successfully']);
    }

    // Méthode pour supprimer un rôle
    public function destroy($id)
    {
        $Location = Location::find($id);
        if (!$Location) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        $Location->delete();

        return response()->json(['message' => 'Location deleted successfully']);
    }
}
