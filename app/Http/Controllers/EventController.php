<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
        $Events = Event::all();
        return response()->json($Events);
    }

    // Méthode pour créer un nouveau rôle
    public function store(Request $request)
    {
        $Event = new Event();
        $Event->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $Event->save();

        return response()->json(['message' => 'Event created successfully']);
    }

    // Méthode pour afficher un rôle spécifique
    public function show($id)
    {
        $Event = Event::find($id);
        if (!$Event) {
            return response()->json(['message' => 'Event not found'], 404);
        }
        return response()->json($Event);
    }

    // Méthode pour mettre à jour un rôle
    public function update(Request $request, $id)
    {
        $Event = Event::find($id);
        if (!$Event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $Event->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $Event->save();

        return response()->json(['message' => 'Event updated successfully']);
    }

    // Méthode pour supprimer un rôle
    public function destroy($id)
    {
        $Event = Event::find($id);
        if (!$Event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $Event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
}
