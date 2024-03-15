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

    public function getTypeOfVmsDescriptions()
    {
        $TypeOfVms = TypeOfVm::all('id', 'description'); // Récupère seulement les colonnes id et description
        return response()->json($TypeOfVms);
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
        $command = "ansible all, -m shell -a \"pvesh get /nodes/ens10pxcv/lxc --output-format=json | jq '.[] | select(.template == 1)'\"";

        // Exécution de la commande
        $output = shell_exec($command);
        $segments = explode(">>\n", $output);


        $clear_output = $segments[1] ?? null;

        $json_objects = explode("\n", trim($clear_output));

        foreach ($json_objects as $json_object) {
            $data = json_decode($json_object, true); // Décode le JSON en tableau associatif
            if ($data) {
                // Extraire vmid et name et les ajouter au tableau
                $vm_details[] = [
                    'vmid' => $data['vmid'],
                    'name' => $data['name'],
                ];
            }
        }

        // Convertir le tableau final en JSON
        $json_result = json_encode($vm_details);


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
