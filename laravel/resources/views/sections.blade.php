@extends('app')

@section('content')
<div class="container">
	<div class="row">
		<div class="col-md-10 col-md-offset-1">

			@if ($warning == 'nosectionwiththisid')
			<div class="panel-warning">
				<div class="panel-heading">Kein Absatz mit dieser ID vorhanden</div>
			</div>
			@elseif ($warning == 'nosectionexists')
			<div class="panel-warning">
				<div class="panel-heading">Keine Absätze vorhanden</div>
			</div>
			@else
			
			<div class="panel panel-default">
				<div class="panel-heading">Absätze</div>

				<div class="panel-body">
					<ul class="sections">
						@foreach ($sections as $section)
						<li>
							<a href="/admin/sections/{{ $section->section_id }}">{{ $section->article_id }} | {{ $section->key }}</a>
							<a class="article-delete link-color__red" href="/admin/section/delete/{{ $section->section_id }}"><i class="fa fa-times"></i> Löschen</a>
						</li>
						@endforeach

						<li class="important">
							<div class="col-xs-4 col-xs-push-4 article-pagination">
							@if ( $sections->currentPage() > 1 )
							<a class="show-prev-page" href="{{ $sections->previousPageUrl() }}"><i class="fa fa-chevron-left fa-2x"></i></a>
							@endif
							
							<span class="article-counter">Seite {{ $sections->currentPage() }} von {{ $sections->lastPage() }}</span>
							
							@if ( $sections->hasMorePages() )
							<a class="show-next-page" href="{{ $sections->nextPageUrl() }}"><i class="fa fa-chevron-right fa-2x"></i></a>
							@endif
							</div>
						</li>

					</ul>
				</div>
			</div>

			@endif
		</div>
	</div>
</div>
@endsection
