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

        // Utilisez une expression régulière pour extraire uniquement la partie JSON de la sortie
        preg_match_all('/\{(?:[^{}]|(?R))*\}/x', $output, $matches);

        $jsonOutput = isset($matches[0]) ? implode("\n", $matches[0]) : '';

        // Vérification de la sortie avant de la retourner
        if (!empty($jsonOutput)) {
            // Convertir la chaîne JSON en un tableau PHP pour la réponse
            $data = json_decode('[' . $jsonOutput . ']', true); // Utilisez des crochets pour faire un tableau JSON valide si plusieurs objets
            return response()->json(['success' => true, 'data' => $data]);
        } else {
            // Gestion de l'erreur ou de l'absence de sortie
            return response()->json(['success' => false, 'message' => 'Aucune donnée récupérée depuis Ansible.'], 500);
        }
    }



}
