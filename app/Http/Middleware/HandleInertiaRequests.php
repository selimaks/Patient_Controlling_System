<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function render($request, Throwable $e)
    {
        // Eğer bu bir Inertia.js isteğiyse ve hata varsa
        if ($request->wantsJson() || $request->header('X-Inertia')) {
            return response()->json([
                'errors' => $e instanceof ValidationException ? $e->errors() : ['message' => $e->getMessage()],
            ], 400);
        }

        return parent::render($request, $e); // Standart davranış
    }
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                // in your case, you named your flash message "success"
                'message' => fn () => $request->session()->get('message')
            ],
        ];
    }
}
