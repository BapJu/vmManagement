<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;

class CourseController extends Controller
{
    public function index()
    {
        $Courses = Course::all();
        return response()->json($Courses);
    }

    // Méthode pour créer un nouveau rôle
    public function store(Request $request)
    {
        $Course = new Course();
        $Course->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $Course->save();

        return response()->json(['message' => 'Course created successfully']);
    }

    // Méthode pour afficher un rôle spécifique
    public function show($id)
    {
        $Course = Course::find($id);
        if (!$Course) {
            return response()->json(['message' => 'Course not found'], 404);
        }
        return response()->json($Course);
    }

    // Méthode pour mettre à jour un rôle
    public function update(Request $request, $id)
    {
        $Course = Course::find($id);
        if (!$Course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $Course->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $Course->save();

        return response()->json(['message' => 'Course updated successfully']);
    }

    // Méthode pour supprimer un rôle
    public function destroy($id)
    {
        $Course = Course::find($id);
        if (!$Course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $Course->delete();

        return response()->json(['message' => 'Course deleted successfully']);
    }
}
