<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $products = [
            [
                'name' => "Chaussures Pulse-Vibe",
                'category' => "vêtements femme",
                'price' => 129.99,
                'label' => "Apparel",
                'badge' => "Nouveau",
                'stock' => 18,
                'img' => "https://lh3.googleusercontent.com/aida-public/AB6AXuCJvqMvy4SYrWIJ8qmToKlxcWuW3_QW5KQi4EKEq4Kh29aEvlhbn2RtlgYJQSbqvPcULpFWEZuwA4MmudK6KApEtoq94wjy1sMnMeJwTvDnCEl0vxx35sUUvRMeBrHDvE5yjfeLVGjX4szHHWGj7A9-wlMpRoiMtSoRCn6UELs0QREpp5HD0lKXgg7pFSsQpnmHyG50XS8Xor3tqZiUfNQDxiUKVb3H5fzhwz5iQvmawmvllGcgPgm5Igp3JkqGPF75cZpdJghP9pQ"
            ],
            [
                'name' => "Ensemble Performance Pro",
                'category' => "vêtements femme",
                'price' => 85.00,
                'label' => "Apparel",
                'badge' => null,
                'stock' => 12,
                'img' => "https://lh3.googleusercontent.com/aida-public/AB6AXuB0SDZQKAUPz5EpJCnnRoWgixlv--uY7r3DoZrXubDwsg4kYXovfIsbpe62I4DFZIb3IBY4bvycBKAo0mDKf6YBodaBzmfQljTCcZnGdZpR4BJqZPak52x-k32M6_7JRcZMdGtpatnCwxJe6pas9noJKSYuKZlIij1U-6HZdqUqQ2k5w0dPQl8OW4HaPKfXnhGtEn4irFKwXMw-f2P_7xItLYW0F5dwvzFmej6fiKygS97RoN9rmEqYR9lvUFD_JKKv3APR44P42qo"
            ],
            [
                'name' => "Isolate Whey Vanille",
                'category' => "protéines",
                'price' => 64.95,
                'label' => "Nutrition",
                'badge' => "Best Seller",
                'stock' => 25,
                'img' => "https://lh3.googleusercontent.com/aida-public/AB6AXuCB9M-pCL41dMmY9aRNzlBGugpJ2gKtlBmPQP74aVlwN6ThcJIuLlb5vu4mJU0MEntEA3cT6Z7kVLSwPoEan8nm3XvBeMPR9tcKFxNKdh77ANkotVTh2b7iLa3LPwbQ9jZHbeAfj1Y8uXWjfiVpIhRslhNFz6yudZGkOEBGklJVilB3eUZV0js33dC2boBB_xFMtzEhMl9rI7JtvXH9ejFspja9HWTE5PJfpDegeb9FnCfbJClLEokgLWmHX5nVwBZ8sfeCdA4LGBg"
            ],
            [
                'name' => "Legging Performance Flex",
                'category' => "vêtements femme",
                'price' => 89.99,
                'label' => "Apparel",
                'badge' => "Tendance",
                'stock' => 30,
                'img' => "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop"
            ],
            [
                'name' => "Top Entraînement Air",
                'category' => "vêtements femme",
                'price' => 44.99,
                'label' => "Apparel",
                'badge' => null,
                'stock' => 22,
                'img' => "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop"
            ],
            [
                'name' => "Whey Isolate Chocolat",
                'category' => "protéines",
                'price' => 69.99,
                'label' => "Nutrition",
                'badge' => "Best Seller",
                'stock' => 40,
                'img' => "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop"
            ],
            [
                'name' => "Créatine Monohydrate 300g",
                'category' => "protéines",
                'price' => 39.99,
                'label' => "Nutrition",
                'badge' => null,
                'stock' => 35,
                'img' => "https://images.unsplash.com/photo-1579722821270-1f4205d291b7?w=800&auto=format&fit=crop"
            ],
            [
                'name' => "Haltères Ajustables 2x10kg",
                'category' => "matériels",
                'price' => 89.99,
                'label' => "Equipment",
                'badge' => "Pro",
                'stock' => 15,
                'img' => "https://images.unsplash.com/photo-1534438327276-14e5300a3a48?w=800&auto=format&fit=crop"
            ],
            [
                'name' => "Corde à Sauter Speed",
                'category' => "matériels",
                'price' => 22.99,
                'label' => "Equipment",
                'badge' => null,
                'stock' => 50,
                'img' => "https://images.unsplash.com/photo-1601422466-94baf4757f2f?w=800&auto=format&fit=crop"
            ],
            [
                'name' => "Kit Training Maison",
                'category' => "matériels",
                'price' => 49.9,
                'label' => "Equipment",
                'badge' => "Pack",
                'stock' => 20,
                'img' => "https://lh3.googleusercontent.com/aida-public/AB6AXuC_bA3AN51XFXpdoY9UYtutmU8NUMCoLSwDu4JlsN3qHQXhdJ_aBbfcCsZY7LDjBKBmZ98U_joIe08bJdMHZf0g_Z1klOl5NTXmcg4HQ1yQaXhxtr3egssxTo_yS9wodHybJoq4PcDbQmgJ2n4bysKnTN7m_xJb9W-BYGl9JGysUIlNuO_0YAVRfvr-ru_4WbjhmL0SDFSO2QBaRT_NV7XCqwriwj6UycXXCPtYxVpkBpNUrRSvO0Z09gtXXcNqDd-tKSA335c8lrk"
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['name' => $product['name']],
                $product
            );
        }
    }
}
