<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Operations as Operation;
use function Laravel\Prompts\select;

class Operations extends Controller
{
    public function createOperation(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'color' => 'required|string|max:255',
        ]);

        $operationData = [
            'created_at' => now(),
            'updated_at' => now(),
            'operation' => $validatedData['title'],
            'color' => $validatedData['color'],
        ];

        DB::table('operations')->insert($operationData);
        return redirect()->back()->with('message', "Operasyon eklendi.");
    }
    public function deleteOperations(Request $request){
        Operation::findOrFail($request['id'])->delete();
        return redirect()->back()->with('message', "Operasyon silindi.");
    }

}
