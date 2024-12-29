<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conversation;
use Illuminate\Support\Facades\DB;

class ConversationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed işlemi ile birkaç sohbet örneği oluşturulur
        Conversation::factory(5)->create();
    }
}
