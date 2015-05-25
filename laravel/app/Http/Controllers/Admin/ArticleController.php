<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Illuminate\Contracts\Auth\Registrar;
use App\Splace\Article;
use App\Splace\Section;
use App\Splace\Links;
use App\Splace\Booktips;

class ArticleController extends Controller {

	/*
	|--------------------------------------------------------------------------
	| Home Controller
	|--------------------------------------------------------------------------
	|
	| This controller renders your application's "dashboard" for users that
	| are authenticated. Of course, you are free to change or remove the
	| controller as you wish. It is just here to get your app started!
	|
	*/

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		$this->middleware('auth');

		if(!\Auth::guest()) {
			if(\Auth::user()->is_admin != '1') {
				return redirect('user')->send();
			}
		}
	}

	/**
	 * Show the application dashboard to the user.
	 *
	 * @return Response
	 */
	public function index()
	{		$article = Article::getAll();
		if(count($article) == '0') {
			$warning = 'noarticleexists';
		}
		else {
			$warning = '-';
		}

		return view('admin/articles')
			->with('articles', $article)
			->with('warning', $warning);
	}

	/**
	 * Show the article markdown editor with new article
	 *
	 * @return Response
	 */
	public function newArticle()
	{
		return view('admin/articleeditor')
			->with('new', true);
	}

	/**
	 * Show the article markdown editor with specified article
	 *
	 * @return Response
	 */
	public function editArticle($id)
	{
		if(!Article::exists($id)) {
			return view('admin/articles')
				->with('articles', Article::getAll())
				->with('warning', 'noarticlewiththisid');
		}

		return view('admin/articleeditor')
			->with('article', Article::getById($id))
			->with('links', Links::getByArticle($id))
			->with('booktips', Booktips::getByArticle($id))
			->with('new', false);
	}

	/**
	 * Save new or edited article
	 *
	 * @return Response
	 */
	public function saveArticle()
	{
		$article = Input::get('article');
		$id = $article['id'];
		
		if(Article::exists($article['id'])) {
			Article::editArticle($article);
		}
		else {
			$id = Article::createArticle($article);
		}
		Section::insertSections($id, Input::get('sectionsDE'), Input::get('sectionsEN'));

		Links::deleteLinksByArticle($article['id']);
		$links = Input::get('links');
		foreach ($links as $link) {
			Links::createLink($link);
		}

		Booktips::deleteBooktipsByArticle($article['id']);
		$booktips = Input::get('booktips', 0);
		if($booktips != 0) {
			foreach ($booktips as $booktip) {
				Booktips::createBooktip($booktip);
			}
		}

		return response()->json(['success' => 'true']);
	}

	/**
	 * Delete article by id
	 *
	 * @return Response
	 */
	public function deleteArticle($id)
	{
		Article::deleteArticle($id);

		return redirect('admin/article');
	}

}
