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
            ],
            [
                'name' => "Pancakes Protéinés",
                'category' => "Petit-déjeuner",
                'kcal' => 320,
                'protein' => "20g",
                'img' => "https://images.unsplash.com/photo-1587190036519-fd6c6d6bfed5?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["2 Œufs", "Banane écrasée", "Poudre de protéine", "Miel", "Baies fraîches"],
                'steps' => ["Mélanger œufs, banane et protéine.", "Verser sur plaque chauffante.", "Cuire 2-3 min de chaque côté.", "Servir avec baies et miel."]
            ],
            [
                'name' => "Smoothie Mangue Coco",
                'category' => "Petit-déjeuner",
                'kcal' => 280,
                'protein' => "15g",
                'img' => "https://images.unsplash.com/photo-1590080876614-d1c55b6c4a00?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["Mangue fraîche", "Yaourt grec", "Lait de coco", "Miel", "Glaçons"],
                'steps' => ["Couper la mangue en morceaux.", "Mixer avec yaourt et lait.", "Ajouter miel et glaçons.", "Servir immédiatement."]
            ],
            [
                'name' => "Toast Complet Œuf Poché",
                'category' => "Petit-déjeuner",
                'kcal' => 290,
                'protein' => "16g",
                'img' => "https://images.unsplash.com/photo-1528735471110-1f6e75c8f8b8?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["Pain complet", "Œuf bio", "Tomate", "Avocat", "Herbes fraîches"],
                'steps' => ["Griller le pain.", "Pocher l'œuf dans l'eau.", "Tartiner avocat sur le pain.", "Ajouter tomate et œuf.", "Assaisonner."]
            ],
            [
                'name' => "Salade Grecque Complète",
                'category' => "Déjeuner",
                'kcal' => 350,
                'protein' => "14g",
                'img' => "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["Tomate", "Concombre", "Oignon", "Fromage feta", "Olives", "Huile d'olive"],
                'steps' => ["Couper les légumes.", "Mélanger dans un saladier.", "Ajouter feta et olives.", "Verser huile d'olive.", "Bien mélanger et servir frais."]
            ],
            [
                'name' => "Bowl Quinoa & Légumes",
                'category' => "Déjeuner",
                'kcal' => 380,
                'protein' => "16g",
                'img' => "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["Quinoa cuit", "Brocoli", "Carotte", "Pois chiches rôtis", "Tahini"],
                'steps' => ["Cuire le quinoa.", "Rôtir les légumes.", "Assembler dans un bol.", "Verser sauce tahini.", "Décorer de graines."]
            ],
            [
                'name' => "Barres Énergétiques Maison",
                'category' => "Snacks",
                'kcal' => 200,
                'protein' => "12g",
                'img' => "https://images.unsplash.com/photo-1638199706092-0e797eae1ce7?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["Flocons d'avoine", "Poudre protéine", "Beurre d'arachide", "Miel", "Chocolat noir"],
                'steps' => ["Mélanger avoine, protéine et beurre.", "Ajouter miel.", "Former des barres.", "Enrober de chocolat.", "Réfrigérer 2h."]
            ],
            [
                'name' => "Yaourt Grec Muesli",
                'category' => "Snacks",
                'kcal' => 220,
                'protein' => "18g",
                'img' => "https://images.unsplash.com/photo-1585511925443-9fc26dd3a3a5?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["Yaourt grec", "Muesli", "Miel", "Noix", "Baies séchées"],
                'steps' => ["Remplir verre de yaourt.", "Ajouter muesli.", "Verser miel.", "Décorer noix et baies.", "Déguster frais."]
            ],
            [
                'name' => "Mix Noix Énergétique",
                'category' => "Snacks",
                'kcal' => 180,
                'protein' => "8g",
                'img' => "https://images.unsplash.com/photo-1585707034007-9a4ff45b3281?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["Amandes", "Noisettes", "Raisins secs", "Cranberries", "Sel"],
                'steps' => ["Mélanger les fruits secs.", "Ajouter noix.", "Assaisonner légèrement.", "Mettre en portion.", "À consommer modérément."]
            ],
            [
                'name' => "Poulet Rôti Légumes",
                'category' => "Dîner",
                'kcal' => 450,
                'protein' => "42g",
                'img' => "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["Poulet fermier", "Patate douce", "Brocoli", "Ail", "Herbes de Provence"],
                'steps' => ["Préparer poulet et légumes.", "Assaisonner généreusement.", "Rôtir à 200°C 45 min.", "Vérifier cuisson.", "Servir chaud."]
            ],
            [
                'name' => "Pâtes à la Carbonara",
                'category' => "Dîner",
                'kcal' => 520,
                'protein' => "28g",
                'img' => "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["Pâtes complètes", "Œufs", "Bacon", "Fromage Parmesan", "Poivre noir"],
                'steps' => ["Cuire les pâtes.", "Faire dorer bacon.", "Fouetter œufs avec fromage.", "Mélanger pâtes chaudes.", "Ajouter bacon et sauce.", "Assaisonner."]
            ],
            [
                'name' => "Steak Frites Complètes",
                'category' => "Dîner",
                'kcal' => 580,
                'protein' => "45g",
                'img' => "https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=800&auto=format&fit=crop",
                'ingredients' => ["Steak bœuf", "Pommes de terre", "Beurre", "Ail", "Thym"],
                'steps' => ["Cuire frites au four.", "Poêler steak 3-4 min côté.", "Ajouter beurre et ail.", "Laisser reposer 5 min.", "Servir avec frites."]
            ]
        ];

        foreach ($recipes as $recipe) {
            Recipe::create($recipe);
        }
    }
}
