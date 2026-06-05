<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Accès admin requis'], 403);
        }

        $productCount = Product::count();
        $totalRevenue = Order::sum('total_amount') ?? 0;
        $orderCount = Order::count();
        $lowStockCount = Product::where('stock', '<=', 5)->count();
        $userCount = User::count();

        $recentOrders = Order::with('items')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'total' => $order->total_amount,
                    'status' => $order->status,
                    'date' => $order->created_at?->format('Y-m-d H:i'),
                    'items_count' => $order->items->count(),
                ];
            });

        $topProducts = Product::orderByDesc('stock')->limit(5)->get();

        return response()->json([
            'stats' => [
                'product_count' => $productCount,
                'total_revenue' => $totalRevenue,
                'order_count' => $orderCount,
                'Low_stock' => $lowStockCount,
                'user_count' => $userCount,
            ],
            'recent_orders' => $recentOrders,
            'top_products' => $topProducts,
        ]);
    }
}
