<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Services\YAMLGenerator;


class EventController extends Controller
{

    public function index()
    {

        $events = Event::orderBy('created_at', 'desc')->get();
        return response()->json($events);

    }

    public function index_current_user()
    {
        $Events = Event::where('id_user', auth()->user()->id)->get();
        return response()->json($Events);

    }

    // Méthode pour créer un nouveau event
    public function store(Request $request)
    {
        // Initialisation et récupération des valeurs dynamiques
        $idLocalisation = $request->input('id_localisation');
        $idSubject = $request->input('id_subject');
        $nb_vm = $request->input('nb_vm');
        $typeOfVm = $request->input('id_typeofvm');
        $storage_id = $request->input('id_storage');


        $templateVMID = DB::table('typeofvm')->where('id', $typeOfVm)->value('template_id');

        $serveur_id = DB::table('typeofvm')->where('id', $typeOfVm)->value('serveur_id');
        $serveur_ip = DB::table('serveur')->where('id', $serveur_id)->value('address_ip');
        $serveur_node = DB::table('serveur')->where('id', $serveur_id)->value('noeud');

        // Récupération des configurations depuis la BDD
        $mask_subject = DB::table('subject')->where('id', $idSubject)->value('ipaddressingplan');
        $mask_site = DB::table('localisation')->where('id', $idLocalisation)->value('ipaddressingplan');
        $category = DB::table('subject')->where('id', $idSubject)->value('description');
        $storage = DB::table('storage')->where('id', $storage_id)->value('name');


        // Vérifier d'abord la disponibilité d'une plage d'IP
        /*
        $query = "
        WITH ip_series AS (
        SELECT generate_series(1,254) AS octet
        ),
        available_ips AS (
            SELECT CONCAT('10.', '{$mask_site}', '.', '{$mask_subject}', '.', octet::text)::inet AS available_ip
            FROM ip_series
            WHERE NOT EXISTS (
                SELECT 1 FROM event WHERE ip = CONCAT('10.', '{$mask_site}', '.', '{$mask_subject}', '.', octet::text)::inet
            )
        )
        SELECT available_ip
        FROM available_ips
        LIMIT :limit
    ";
        */
        $query = "
        WITH ip_series AS (
        SELECT generate_series(200, 250) AS octet -- Génère les octets de 200 à 250
        ),
        available_ips AS (
            SELECT CONCAT('10.', '10', '.', '48', '.', octet::text)::inet AS available_ip
            FROM ip_series
            WHERE NOT EXISTS (
                SELECT 1 FROM event WHERE ip = CONCAT('10.', '10', '.', '48', '.', octet::text)::inet
            )
        )
        SELECT available_ip
        FROM available_ips
        LIMIT :limit
    ";



        $ipAvailable = DB::select($query, ['limit' => $nb_vm]);

        if (empty($ipAvailable)) {
            // Si aucune plage d'IP disponible, renvoyer une erreur
            return response()->json(['message' => 'No IP range available'], 400);
        }

        $dataForYAML = [];

        $vmIDStart = DB::table('event')->max('vmid') + 1;

        foreach ($ipAvailable as $index => $ip) {
            $vmid = $vmIDStart + $index;

            $event = new Event();
            $event->id_typeofvm = $typeOfVm;
            $event->id_user = $request->input('id_user');
            $event->id_storage = $storage_id;
            $event->vmid = str_replace('.', '', $ip->available_ip);
            $event->scheduledexpiry = $request->input('end_date');
            $event->ip = $ip->available_ip;
            $event->active = $request->input('start_vm');
            $event->namevm = $request->input('prefix_name_vm') . $request->input('name_vm') . "-" . str_replace('.', '', $ip->available_ip);
            $event->save();

            $dataForYAML[] = [
                'template_vmid' => $templateVMID,
                'vmid' => str_replace('.', '', $ip->available_ip),
                'static_ip' => $ip->available_ip,
                'gateway' => "10.{$mask_site}.{$mask_subject}.1",
                'cloneName' => $request->input('prefix_name_vm') . $request->input('name_vm') . "-" . str_replace('.', '', $ip->available_ip),
                'storage' => $storage,
                'resource_pool' => 'Serveurs',
            ];
        }

        $yamlContent = YAMLGenerator::generateYAML($dataForYAML);
        file_put_contents(base_path('/scripts/clones.yml'), $yamlContent);


        $command = "ansible-playbook " . base_path('/scripts/clone_configure_lxc.yml') . " -i /etc/ansible/hosts -l {$serveur_ip}, --extra-vars 'node_name={$serveur_node}'";

        if ($request->input('start_vm') === false ) {
            $command = $command . " --extra-vars 'start_containers=no'";
        }
        exec($command);

        return redirect('/manage');
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
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        if (!$request->has('action')) {
            return response()->json(['message' => 'Action not specified in the request'], 400);
        }

        $action = $request->input('action');

        if ($action === 'stop') {
            $event->active = false;

            $typeOfVm = $event->id_typeofvm;
            $serveur_id = DB::table('typeofvm')->where('id', $typeOfVm)->value('serveur_id');
            $serveur_ip = DB::table('serveur')->where('id', $serveur_id)->value('address_ip');


            $command = "ansible-playbook " . base_path('/scripts/stop_containers.yml') . " --extra-vars 'param_start_vmid={$event->vmid} param_end_vmid={$event->vmid}' -i /etc/ansible/hosts -l {$serveur_ip}";
            exec($command);
            $event->save();

            return response()->json(['message' => 'Event stopped successfully', 'typeOfVm' => $typeOfVm], 201);
        } elseif ($action === 'start') {
            $event->active = true;

            $typeOfVm = $event->id_typeofvm;
            $serveur_id = DB::table('typeofvm')->where('id', $typeOfVm)->value('serveur_id');
            $serveur_ip = DB::table('serveur')->where('id', $serveur_id)->value('address_ip');

            $command = "ansible-playbook " . base_path('/scripts/start_containers.yml') . " --extra-vars 'param_start_vmid={$event->vmid} param_end_vmid={$event->vmid}' -i /etc/ansible/hosts -l {$serveur_ip}";
            exec($command);
            $event->save();

            return response()->json(['message' => 'Event started successfully', 'typeOfVm' => $typeOfVm], 201);
        } elseif ($action === 'destroy') {
            $event->active = false;


            $typeOfVm = $event->id_typeofvm;
            $serveur_id = DB::table('typeofvm')->where('id', $typeOfVm)->value('serveur_id');
            $serveur_ip = DB::table('serveur')->where('id', $serveur_id)->value('address_ip');

            $command = "ansible-playbook " . base_path('/scripts/remove_lxc.yml') . " --extra-vars 'param_start_vmid={$event->vmid} param_end_vmid={$event->vmid}'  -i /etc/ansible/hosts -l {$serveur_ip}";
            exec($command);

            $event->ip = null;
            $event->effectiveexpiry = now();
            $event->save();


            return response()->json(['message' => 'Event deleted successfully'], 201);
        } else {

            return response()->json(['message' => 'Invalid action specified'], 400);
        }

    }

    public function filter($idUser)
    {
        if (!is_numeric($idUser)) {
            return response()->json(['message' => 'Invalid User ID'], 400);
        }

        $Events = Event::where('id_user', $idUser)->get();
        if ($Events->isEmpty()) {
            return response()->json([], 200);
        }
        return response()->json($Events);
    }

}
