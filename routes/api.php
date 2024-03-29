<?php

use App\Http\Controllers\Auth\AuthApiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServeurController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TypeOfVmController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\StorageController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('auth:sanctum')->get('/users', [ProfileController::class, 'index']);
Route::middleware('auth:sanctum')->patch('/user/{id}', [ProfileController::class, 'updateRole']);

//Route::get('/events/user/{userId}', [EventController::class, 'index']);


// Routes pour 'role'
Route::get('/roles', [RoleController::class, 'index']);
Route::middleware('auth:sanctum')->post('/role', [RoleController::class,'store']);
Route::get('/role/{id}', [RoleController::class,'show']);
Route::middleware('auth:sanctum')->put('/role/{id}', [RoleController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/role/{id}', [RoleController::class, 'destroy']);

// Routes pour 'localisation'
Route::get('/localisations', [LocationController::class, 'index']);
Route::middleware('auth:sanctum')->post('/localisation', [LocationController::class, 'store']);
Route::get('/localisation/{id}', [LocationController::class, 'show']);
Route::middleware('auth:sanctum')->put('/localisation/{id}', [LocationController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/localisation/{id}', [LocationController::class, 'destroy']);

// Routes pour 'Subject'
Route::get('/subjects', [SubjectController::class, 'index']);
Route::middleware('auth:sanctum')->post('/subject', [SubjectController::class, 'store']);
Route::get('/subject/{id}', [SubjectController::class, 'show']);
Route::middleware('auth:sanctum')->put('/subject/{id}', [SubjectController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/subject/{id}', [SubjectController::class, 'destroy']);


Route::get('/serveurs', [ServeurController::class, 'index']);
Route::middleware('auth:sanctum')->post('/serveur', [ServeurController::class, 'store']);
Route::middleware('auth:sanctum')->get('/serveur/{id}', [ServeurController::class, 'show']);
Route::middleware('auth:sanctum')->put('/serveur/{id}', [ServeurController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/serveur/{id}', [ServeurController::class, 'destroy']);


// Routes pour 'type_of_vm'
Route::get('/typeOfVms', [TypeOfVmController::class, 'index']);
Route::get('/typeOfVms/promox', [TypeOfVmController::class, 'getPromoxTemplate']);
Route::get('/typeOfVms/location={idLocalisation}/subject={idSubject}/serveur={idServeur}', [TypeOfVmController::class, 'filter']);
Route::middleware('auth:sanctum')->post('/typeOfVm', [TypeOfVmController::class, 'store']);
Route::get('/typeOfVm/{id}', [TypeOfVmController::class, 'show']);
Route::middleware('auth:sanctum')->put('/typeOfVm/{id}', [TypeOfVmController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/typeOfVm/{id}', [TypeOfVmController::class, 'destroy']);


// Routes pour 'event'

Route::get('/events/', [EventController::class, 'index']);
Route::middleware('auth:sanctum')->get('/events/current_user', [EventController::class, 'index_current_user']);
Route::middleware('auth:sanctum')->post('/event', [EventController::class, 'store']);
Route::middleware('auth:sanctum')->get('/event/{id}', [EventController::class, 'show']);
Route::middleware('auth:sanctum')->put('/event/{id}', [EventController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/event/{id}', [EventController::class, 'destroy']);
Route::middleware('auth:sanctum')->get('/events/user/{idUser}/serveur/{serveurId}', [EventController::class, 'filter']);
Route::middleware('auth:sanctum')->get('/events/serveur/{serveurId}', [EventController::class, 'filteronlyserveur']);
Route::middleware('auth:sanctum')->get('/events/user/{userId}', [EventController::class, 'filteronlyuser']);

// Routes pour 'storage'
Route::get('/storages', [StorageController::class, 'index']);
Route::post('/storage', [StorageController::class, 'store']);
Route::get('/storage/{id}', [StorageController::class, 'show']);
Route::get('/storage/serveur/{idServeur}', [StorageController::class, 'filter']);
Route::put('/storage/{id}', [StorageController::class, 'update']);
Route::delete('/storage/{id}', [StorageController::class, 'destroy']);

// Route pour la gestion des tokens
Route::post('/tokens/create',[AuthApiController::class, 'register']);
Route::middleware('auth:sanctum')->post('/tokens/logout',[AuthApiController::class, 'logout']);
Route::post('/tokens/login',[AuthApiController::class, 'login']);


