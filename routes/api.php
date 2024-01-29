<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\typeOfVmController;
use App\Http\Controllers\EventController;
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
Route::get('/roles', [RoleController::class, 'index']);
Route::post('/role', [RoleController::class,'store']);
Route::get('/role/{id}', [RoleController::class,'show']);
Route::put('/role/{id}', [RoleController::class, 'update']);
Route::delete('/role/{id}', [RoleController::class, 'destroy']);

// Routes pour 'lieu'
Route::get('/locations', [LocationController::class, 'index']);
Route::post('/location', [LocationController::class, 'store']);
Route::get('/location/{id}', [LocationController::class, 'show']);
Route::put('/location/{id}', [LocationController::class, 'update']);
Route::delete('/location/{id}', [LocationController::class, 'destroy']);

// Routes pour 'course'
Route::get('/courses', [CourseController::class, '@index']);
Route::post('/course', [CourseController::class, '@store']);
Route::get('/course/{id}', [CourseController::class, '@show']);
Route::put('/course/{id}', [CourseController::class, '@update']);
Route::delete('/course/{id}', [CourseController::class, '@destroy']);


// Routes pour 'type_of_vm'
Route::get('/typeOfVms', [typeOfVmController::class, '@index']);
Route::post('/typeOfVm', [typeOfVmController::class, '@store']);
Route::get('/typeOfVm/{id}', [typeOfVmController::class, '@show']);
Route::put('/typeOfVm/{id}', [typeOfVmController::class, '@update']);
Route::delete('/typeOfVm/{id}', [typeOfVmController::class, '@destroy']);


// Routes pour 'event'
Route::get('/events', [EventController::class, '@index']);
Route::post('/event', [EventController::class, '@store']);
Route::get('/event/{id}', [EventController::class, '@show']);
Route::put('/event/{id}', [EventController::class, '@update']);
Route::delete('/event/{id}', [EventController::class, '@destroy']);

