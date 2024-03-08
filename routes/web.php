<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Redirector;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');



Route::get('/dashboard-admin', function () {
    if (Auth::check()) {
        $userRole = Auth::user()->id_role;

        if ($userRole == 1) {
            return Inertia::render('DashboardAdmin');
        } else {
            return redirect()->route('dashboard')->with('error', 'Accès interdit');
        }
    } else {
        return redirect()->route('login');
    }
})->middleware(['auth', 'verified'])->name('dashboard-admin');


Route::get('/manage', function () {
    return Inertia::render('Manage');
})->middleware(['auth', 'verified'])->name('manage');

Route::get('/statistiques', function () {
    return Inertia::render('Statistiques');
})->middleware(['auth', 'verified'])->name('Statistiques');

Route::get('/manage-admin', function () {
    if (Auth::check()) {
        $userRole = Auth::user()->id_role;

        if ($userRole == 1) {
            return Inertia::render('ManageAdmin');
        } else {
            return redirect()->route('manage')->with('error', 'Accès interdit');
        }
    } else {
        return redirect()->route('login');
    }
})->middleware(['auth', 'verified'])->name('manage-admin');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
