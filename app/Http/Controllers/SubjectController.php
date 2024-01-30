<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
    public function index()
    {
        $Courses = Subject::all();
        return response()->json($Courses);
    }

    // Méthode pour créer un nouveau rôle
    public function store(Request $request)
    {
        $Course = new Subject();
        $Course->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $Course->save();

        return response()->json(['message' => 'Subject created successfully']);
    }

    // Méthode pour afficher un rôle spécifique
    public function show($id)
    {
        $Course = Subject::find($id);
        if (!$Course) {
            return response()->json(['message' => 'Subject not found'], 404);
        }
        return response()->json($Course);
    }

    // Méthode pour mettre à jour un rôle
    public function update(Request $request, $id)
    {
        $Course = Subject::find($id);
        if (!$Course) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        $Course->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $Course->save();

        return response()->json(['message' => 'Subject updated successfully']);
    }

    // Méthode pour supprimer un rôle
    public function destroy($id)
    {
        $Course = Subject::find($id);
        if (!$Course) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        $Course->delete();

        return response()->json(['message' => 'Subject deleted successfully']);
    }
}
