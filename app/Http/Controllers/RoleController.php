<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return response()->json($roles);
    }

    // Méthode pour créer un nouveau rôle
    public function store(Request $request)
    {
        $role = new Role();
        $role->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $role->save();

        return response()->json(['message' => 'Role created successfully']);
    }

    // Méthode pour afficher un rôle spécifique
    public function show($id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }
        return response()->json($role);
    }

    // Méthode pour mettre à jour un rôle
    public function update(Request $request, $id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        $role->name = $request->input('name'); // Assurez-vous d'avoir un champ 'name' dans votre formulaire
        $role->save();

        return response()->json(['message' => 'Role updated successfully']);
    }

    // Méthode pour supprimer un rôle
    public function destroy($id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted successfully']);
    }
}
