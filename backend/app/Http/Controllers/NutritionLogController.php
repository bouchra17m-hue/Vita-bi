<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\NutritionLog;
use Carbon\Carbon;

class NutritionLogController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();
        
        $logs = NutritionLog::where('user_id', $request->user()->id)
            ->whereDate('logged_at', $today)
            ->latest()
            ->get();

        return response()->json($logs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'recipe_id' => 'nullable|exists:recipes,id',
            'name' => 'required|string',
            'kcal' => 'required|integer',
            'protein' => 'nullable|string'
        ]);

        $log = NutritionLog::create([
            'user_id' => $request->user()->id,
            'recipe_id' => $request->recipe_id,
            'name' => $request->name,
            'kcal' => $request->kcal,
            'protein' => $request->protein,
            'logged_at' => Carbon::now()
        ]);

        return response()->json([
            'message' => 'Repas enregistré avec succès',
            'log' => $log
        ], 201);
    }
}
