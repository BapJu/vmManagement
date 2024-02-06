<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    public function index()
    {
        $Events = Event::all();
        return response()->json($Events);
    }

    // Méthode pour créer un nouveau event
    public function store(Request $request)
    {
        // On récupère les infos pour établir l'IP
        $idLocalisation = $request->input('id_localisation');
        $idSubject = $request->input('id_subject');

        // On récupère le masque de sous-réseau
        $mask_subject = DB::table('subject')->where('id', $idSubject)->value('ipaddressingplan');
        $mask_site = DB::table('localisation')->where('id', $idLocalisation)->value('ipaddressingplan');

        // Vérifier d'abord la disponibilité d'une plage d'IP
        $query = "
        WITH ip_series AS (
            SELECT generate_series(1,254) AS octet
        ),
        available_ips AS (
            SELECT CONCAT('10.', '{$mask_site}', '.', '{$mask_subject}', '.', octet::text) AS available_ip
            FROM ip_series
            WHERE NOT EXISTS (
                SELECT 1 FROM event WHERE ip = CONCAT('10.', '{$mask_site}', '.', '{$mask_subject}', '.', octet::text)
            )
        )
        SELECT available_ip
        FROM available_ips
        LIMIT :limit
    ";

        $ipAvailable = DB::select($query, ['limit' => $request->input('nb_vm')]);

        if (empty($ipAvailable)) {
            // Si aucune plage d'IP disponible, renvoyer une erreur
            return response()->json(['message' => 'No IP range available'], 400);
        }

        foreach ($ipAvailable as $ip) {
            // Créer un nouvel événement pour chaque adresse IP disponible
            $event = new Event();
            $event->id_typeofvm = $request->input('id_typeofvm');
            $event->id_user = $request->input('id_user');
            $event->id_storage = $request->input('id_storage');
            $event->id_localisation = $request->input('id_localisation');
            $event->id_subject = $request->input('id_subject');
            $event->ip = $ip->available_ip;
            $event->save();
        }

        // Renvoyer un message de succès
        return response()->json(['message' => 'Events created successfully'], 201);
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
