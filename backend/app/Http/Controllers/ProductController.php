<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('id')->get()->unique('name')->values();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Accès admin requis'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'label' => 'required|string|max:255',
            'badge' => 'nullable|string|max:255',
            'img' => 'required|string',
            'stock' => 'required|integer|min:0',
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Accès admin requis'], 403);
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'name')->ignore($product->id),
            ],
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'label' => 'required|string|max:255',
            'badge' => 'nullable|string|max:255',
            'img' => 'required|string',
            'stock' => 'required|integer|min:0',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(Request $request, Product $product)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Accès admin requis'], 403);
        }

        $product->delete();

        return response()->json([
            'message' => 'Produit supprimé avec succès'
        ]);
    }
}
