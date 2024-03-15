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
        $TypeOfVms = TypeOfVm::all();
        $command = "sudo ansible-playbook " . base_path('/scripts/getTemplates.yml');
        $templates = exec($command);
        //$templates = json_decode($templates, true);


        return response()->json($templates);
    }

}
