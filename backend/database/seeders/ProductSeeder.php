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
            ]
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['name' => $product['name']],
                $product
            );
        }
    }
}
