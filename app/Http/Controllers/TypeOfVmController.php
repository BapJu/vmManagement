<?php

namespace App\Http\Controllers;

use App\Models\TypeOfVm;
use Illuminate\Http\Request;

class TypeOfVmController extends Controller
{
    public function index()
    {
        $TypeOfVms = TypeOfVm::all();
        return response()->json($TypeOfVms);
    }

    public function getDescription($id)
    {
        $typeOfVM = TypeOfVM::find($id);
        if ($typeOfVM) {
            return response()->json(['description' => $typeOfVM->description]);
        } else {
            return response()->json(['error' => 'Type of VM not found.'], 404);
        }
    }

    // Méthode pour créer un nouveau rôle
    public function store(Request $request)
    {
        $TypeOfVm = new TypeOfVm();
        $TypeOfVm->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $TypeOfVm->save();

        return response()->json(['message' => 'TypeOfVm created successfully']);
    }

    // Méthode pour afficher un rôle spécifique
    public function show($id)
    {
        $TypeOfVm = TypeOfVm::find($id);
        if (!$TypeOfVm) {
            return response()->json(['message' => 'TypeOfVm not found'], 404);
        }
        return response()->json($TypeOfVm);
    }

    // Méthode pour mettre à jour un rôle
    public function update(Request $request, $id)
    {
        $TypeOfVm = TypeOfVm::find($id);
        if (!$TypeOfVm) {
            return response()->json(['message' => 'TypeOfVm not found'], 404);
        }

        $TypeOfVm->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $TypeOfVm->save();

        return response()->json(['message' => 'TypeOfVm updated successfully']);
    }

    // Méthode pour supprimer un rôle
    public function destroy($id)
    {
        $TypeOfVm = TypeOfVm::find($id);
        if (!$TypeOfVm) {
            return response()->json(['message' => 'TypeOfVm not found'], 404);
        }

        $TypeOfVm->delete();

        return response()->json(['message' => 'TypeOfVm deleted successfully']);
    }


    public function filter($idLocalisation, $idSubject)
    {
        $TypeOfVms = TypeOfVm::where('id_localisation', $idLocalisation)->where('id_subject', $idSubject)->get();
        return response()->json($TypeOfVms);
    }

    public function getPromoxTemplate()
    {
        // Assurez-vous que le chemin est correct et sécurisé
        $command = "ansible all, -m shell -a \"pvesh get /nodes/ens10pxcv/lxc --output-format=json | jq '.[] | select(.template == 1)'\" > /var/www/html/vmManagement/scripts/proxmox_template.json";

        // Exécution de la commande
        shell_exec($command);
        $lines = file('/var/www/html/vmManagement/scripts/proxmox_template.json', FILE_IGNORE_NEW_LINES);
        $lines = array_slice($lines, 1);
        $read_json = implode("\n", $lines);
        $read_json = json_decode($read_json);



        // Convertir le tableau final en JSON
        $json_result = json_encode($read_json);


        // Vérification de la sortie avant de la retourner
        if (!empty($json_result)) {
            // Décommentez la ligne suivante si vous êtes sûr que la sortie est en JSON et doit être décodée
            // $output = json_decode($output, true);
            return response()->json(['success' => true, 'data' => $json_result]);
        } else {
            // Gestion de l'erreur ou de l'absence de sortie
            return response()->json(['success' => false, 'message' => 'Aucune donnée récupérée depuis Ansible.'], 500);
        }
    }


}
