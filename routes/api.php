<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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


// Routes pour 'role'
Route::get('/roles', 'RoleController@index');
Route::post('/roles', 'RoleController@store');
Route::get('/roles/{id}', 'RoleController@show');
Route::put('/roles/{id}', 'RoleController@update');
Route::delete('/roles/{id}', 'RoleController@destroy');

// Routes pour 'lieu'
Route::get('/lieux', 'LieuController@index');
Route::post('/lieux', 'LieuController@store');
Route::get('/lieux/{id}', 'LieuController@show');
Route::put('/lieux/{id}', 'LieuController@update');
Route::delete('/lieux/{id}', 'LieuController@destroy');

// Routes pour 'enseignement'
Route::get('/enseignements', 'EnseignementController@index');
Route::post('/enseignements', 'EnseignementController@store');
Route::get('/enseignements/{id}', 'EnseignementController@show');
Route::put('/enseignements/{id}', 'EnseignementController@update');
Route::delete('/enseignements/{id}', 'EnseignementController@destroy');


// Routes pour 'type_of_vm'
Route::get('/type_of_vm', 'Type_of_vmController@index');
Route::post('/type_of_vm', 'Type_of_vmController@store');
Route::get('/type_of_vm/{id}', 'Type_of_vmController@show');
Route::put('/type_of_vm/{id}', 'Type_of_vmController@update');
Route::delete('/type_of_vm/{id}', 'Type_of_vmController@destroy');


// Routes pour 'event'
Route::get('/event', 'EventController@index');
Route::post('/event', 'EventController@store');
Route::get('/event/{id}', 'EventController@show');
Route::put('/event/{id}', 'EventController@update');
Route::delete('/event/{id}', 'EventController@destroy');

