<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:255',
            'zip_code' => 'required|string|max:20',
            'phone' => 'nullable|string|max:20',
            'card_name' => 'required|string|max:255',
            'card_number' => 'required|string|max:20',
            'expiry' => 'required|string|max:7',
        ]);

        $items = $validated['items'];

        foreach ($items as $item) {
            $product = \App\Models\Product::findOrFail($item['id']);
            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'message' => "Stock insuffisant pour \"{$product->name}\". Disponible : {$product->stock}.",
                    'product_id' => $product->id,
                    'available_stock' => $product->stock,
                ], 422);
            }
        }

        try {
            DB::beginTransaction();

            $totalAmount = collect($items)->reduce(function ($carry, $item) {
                return $carry + ($item['price'] * $item['quantity']);
            }, 0);

            $order = \App\Models\Order::create([
                'user_id' => $request->user()->id,
                'total_amount' => $totalAmount,
                'status' => 'completed',
                'address' => $validated['address'],
                'city' => $validated['city'],
                'zip_code' => $validated['zip_code'],
                'phone' => $validated['phone'] ?? null,
                'card_name' => $validated['card_name'],
                'card_number' => $validated['card_number'],
                'expiry' => $validated['expiry'],
            ]);

            foreach ($items as $item) {
                $product = \App\Models\Product::findOrFail($item['id']);
                $product->stock -= $item['quantity'];
                $product->save();

                \App\Models\OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Commande passée avec succès',
                'order' => $order->load('items.product')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors du traitement de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
