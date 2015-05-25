<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('articles', function($table)
		{
			$table->increments('article_id');
			$table->integer('magazine_id');
			$table->string('spitzmarke');
			$table->string('titleDE');
			$table->string('titleEN');
			$table->text('page_titleDE');
			$table->text('page_titleEN');
			$table->text('page_sub_titleDE');
			$table->text('page_sub_titleEN');
			$table->string('reading_time');
			$table->string('cover_image');
			$table->string('cover_image_mime');
			$table->string('gradient_1');
			$table->string('gradient_2');
			$table->text('introductionDE');
			$table->text('introductionEN');
			$table->text('h2DE');
			$table->text('h2EN');
			$table->text('h3DE');
			$table->text('h3EN');
			$table->string('author_name');
			$table->string('bio_image');
			$table->string('bio_image_mime');
			$table->text('bio_textDE');
			$table->text('bio_textEN');

			$table->text('used_materialDE');
			$table->text('used_materialEN');
			$table->text('editor_section_codeDE');
			$table->text('editor_section_codeEN');

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('articles');
	}

}
