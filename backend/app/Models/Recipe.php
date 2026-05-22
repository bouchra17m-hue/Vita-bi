<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'kcal',
        'protein',
        'img',
        'ingredients',
        'steps'
    ];

    protected $casts = [
        'ingredients' => 'array',
        'steps' => 'array'
    ];
}
