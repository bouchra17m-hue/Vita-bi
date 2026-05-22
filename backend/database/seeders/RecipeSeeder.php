<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Recipe;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $recipes = [
            [
                'name' => "Berry Vitality Bowl",
                'category' => "Petit-déjeuner",
                'kcal' => 340,
                'protein' => "12g",
                'img' => "https://lh3.googleusercontent.com/aida-public/AB6AXuBJe5nqMFHc9Y1pk1THZZ-wzxDN3QEyp7fIRB9d0jwkqS0s1EYXh5Zbj7pSmLLvkwrLjXXkMDxs_EH5Hiprhjz_a39RX6oR8SpRhCkt1FuWi6HvO_YMgXmVg_AUNlNJQHlC8_osSOlwO5XspvesTS3IblcnDwPsWN7kX82NAPWcYwasYR6ttSgPMZZ118oiDQB439ouu5XL2RWFhNJqWbl82d4S5k3C74qDSFLDY7xeKzmq4-EeCehkYZQP5aaB85ntVGUX-J0DOv4",
                'ingredients' => ["Baies sauvages", "Yogourt grec 0%", "Graines de chia", "Miel d'acacia"],
                'steps' => ["Mélanger le yogourt et les graines.", "Ajouter les baies fraîches.", "Napper de miel."]
            ],
            [
                'name' => "Omelette Avocat & Épinards",
                'category' => "Petit-déjeuner",
                'kcal' => 280,
                'protein' => "18g",
                'img' => "https://static.jow.fr/550x550/patterns/yolk-03-202309.png_merge_recipes/75RKiy61gQ0dYA.png.jpg",
                'ingredients' => ["3 Oeufs bio", "Épinards frais", "1/2 Avocat", "Feta légère"],
                'steps' => ["Faire sauter les épinards.", "Battre les oeufs et verser dans la poêle.", "Ajouter l'avocat et la feta à la fin."]
            ],
            [
                'name' => "Pudding de Chia",
                'category' => "Snacks",
                'kcal' => 240,
                'protein' => "8g",
                'img' => "https://www.delscookingtwist.com/wp-content/uploads/2019/05/Rhubarb-Strawberry-Chia-Pudding_1.jpg",
                'ingredients' => ["Graines de chia", "Lait d'amande", "Vanille", "Fraises"],
                'steps' => ["Mélanger le chia et le lait.", "Laisser reposer une nuit.", "Ajouter les fraises avant de servir."]
            ],
            [
                'name' => "Saumon Grillé & Asperges",
                'category' => "Dîner",
                'kcal' => 420,
                'protein' => "35g",
                'img' => "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["Pavé de saumon", "Asperges vertes", "Huile d'olive", "Citron bio"],
                'steps' => ["Assaisonner le saumon.", "Griller 4-5 min de chaque côté.", "Saisir les asperges à la poêle."]
            ],
            [
                'name' => "Curry de Pois Chiches",
                'category' => "Dîner",
                'kcal' => 380,
                'protein' => "14g",
                'img' => "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["Pois chiches", "Lait de coco", "Curry en poudre", "Epinards"],
                'steps' => ["Faire revenir les épices.", "Ajouter les pois chiches et le lait de coco.", "Laisser mijoter 15 min."]
            ]
        ];

        foreach ($recipes as $recipe) {
            Recipe::create($recipe);
        }
    }
}
