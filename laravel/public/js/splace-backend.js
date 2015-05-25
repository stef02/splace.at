var editorDE, editorEN, linkCount = 1, booktipCount = 1;

function editorLanguageSwitch(add, remove) {
	$('#language-switch--'+remove).removeClass('active');
	$('#language-switch--'+add).addClass('active');

	$('.language-'+remove).addClass('hidden');
	$('.language-'+add).removeClass('hidden');
}
function changeLanguage() {
	$('#language-switch--de').on('click', function() {
		editorLanguageSwitch('de', 'en');
		editorDE.reflow();
	});
	$('#language-switch--en').on('click', function() {
		editorLanguageSwitch('en', 'de');
		editorEN.reflow();
	});
}

function parseSections(text) {
	var sections = {};
	var parts = text.split('[--');

	i = 0;
	for(p in parts) {
		if(i == 0) {
			i++;
			continue;
		}

		var s = parts[p].split('--]');
		sections[i-1] = { id: s[0], html: s[1] };
		i++;
	}

	return sections;
}

function saveArticle(e) {
	e.preventDefault();

	token = $('[name="_token"]').val();

	//save cover_image & bio_image
	//check gradient1 & 2

	var article = {
		'id': $('[name="id"]').val(), 
		'titleDE': $('[name="titleDE"]').val(), 
		'titleEN': $('[name="titleEN"]').val(), 
		'spitzmarke': $('[name="spitzmarke"]').val(), 
		'page_titleDE': $('[name="page_titleDE"]').val(), 
		'page_titleEN': $('[name="page_titleEN"]').val(), 
		'page_subtitleDE': $('[name="page_subtitleDE"]').val(), 
		'page_subtitleEN': $('[name="page_subtitleEN"]').val(),
		'reading_time': $('[name="reading_time"]').val(),  
		'introductionDE': $('[name="introductionDE"]').val(), 
		'introductionEN': $('[name="introductionEN"]').val(), 
		'h2DE': $('[name="h2DE"]').val(), 
		'h2EN': $('[name="h2EN"]').val(), 
		'h3DE': $('[name="h3DE"]').val(), 
		'h3EN': $('[name="h3EN"]').val(), 
		'editor_section_codeDE': $('[name="textDE"]').val(), 
		'editor_section_codeEN': $('[name="textEN"]').val(), 
		'author_name': $('[name="author_name"]').val(), 
		'bio_textDE': $('[name="bio_textDE"]').val(), 
		'bio_textEN': $('[name="bio_textEN"]').val(), 
		'used_materialDE': $('[name="used_materialDE"]').val(), 
		'used_materialEN': $('[name="used_materialEN"]').val(), 
		'gradient_1': $('[name="gradient_1"]').val(), 
		'gradient_2': $('[name="gradient_2"]').val(), 

		'cover_image_url': $('[name="cover_image"]').val(), 
		'bio_image_url': $('[name="bio_image"]').val()
	};
	
	var links = {}; 
	$('.link-input').each(function(index) {

		links[index] = { 
			'id': $(this).children('[name="link-id"]').val(), 
			'article_id': $('[name="id"]').val(), 
			'number': (index+1), 
			'link': $(this).children('[name="link"]').val(), 
			'link_descriptionDE': $(this).children('[name="link_descriptionDE"]').val(), 
			'link_descriptionEN': $(this).children('[name="link_descriptionEN"]').val()
		};
	});

	var booktips = {}; 
	$('.booktip-input').each(function(index) {

		booktips[index] = { 
			'id': $(this).children('[name="booktip-id"]').val(), 
			'article_id': $('[name="id"]').val(), 
			'number': (index+1), 
			'booktipDE': $(this).children('[name="booktip_descriptionDE"]').val(), 
			'booktipEN': $(this).children('[name="booktip_descriptionEN"]').val()
		};
	});
	

	editorDE.preview();
	var sectionsDE = editorDE.getElement('previewer');
	sectionsDE = parseSections($(sectionsDE).find('#epiceditor-preview').html());

	editorEN.preview();
	var sectionsEN = editorEN.getElement('previewer');
	sectionsEN = parseSections($(sectionsEN).find('#epiceditor-preview').html());


	$.post(article['id'], { _token: token, article: article, sectionsDE: sectionsDE, sectionsEN: sectionsEN, links: links, booktips: booktips })
        .success(function(response){
        	showSuccess('article');
/*        	setTimeout(function() { 
        		history.back() 
        	}, 2000);
*/        })
        .error(function(response){
            showError('article');
        });
}

function saveSection(e) {
	e.preventDefault();

	token = $('[name="_token"]').val();

	var section = {
		'id': $('[name="id"]').val(), 
		'textDE': $('[name="textDE"]').val(), 
		'textEN': $('[name="textEN"]').val(), 
		'noteDE': $('[name="noteDE"]').val(), 
		'noteEN': $('[name="noteEN"]').val(), 
	};

	$.post(section['id'], { _token: token, section: section })
        .success(function(response){
        	showSuccess('section');
        	setTimeout(function() { 
        		history.back() 
        	}, 2000);
        })
        .error(function(response){
            showError('section');
        });
}
function saveComment(e) {
	e.preventDefault();
	
	token = $('[name="_token"]').val();

	var comment = {
		'id': $('[name="id"]').val(), 
		'marked': $('[name="marked"]').is(':checked') ? 1 : 0, 
		'text': $('[name="text"]').val()
	};

	$.post(comment['id'], { _token: token, comment: comment })
        .success(function(response){
        	showSuccess('comment');
        	setTimeout(function() { 
        		history.back() 
        	}, 2000);
        })
        .error(function(response){
            showError('comment');
        });
}

function showSuccess(form){
	$('.'+form+'-editor-form__success').css('display', 'block');
}
function showError(form){
	$('.'+form+'-editor-form__error').css('display', 'block');
}

function epiceditor() {
	//Epiceditor options 
	var opts = {
	  container: 'markdown-textDE',
	  textarea: 'textDE',
	  basePath: '/epiceditor',
	  theme: {
	    base: '/themes/base/epiceditor.css',
	    editor: '/themes/editor/epic-dark.css'
	  },
	  clientSideStorage: false
	}

	//Initiate Markdown Editor #1 German
	editorDE = new EpicEditor(opts);
	editorDE.load();

	opts['container'] = 'markdown-textEN';
	opts['textarea'] = 'textEN';

	//Initiate Markdown Editor #2 English
	editorEN = new EpicEditor(opts);
	editorEN.load();
}

function addLinkContent() {
	var html = '<div class="link-input" data-key="'+linkCount+'"><h4>Link '+linkCount+'</h4><input type="hidden" name="link-id" value="-1"><input class="form-control" type="text" name="link" placeholder="Link"><h5>Beschreibung Deutsch</h5><input class="form-control" type="text" name="link_descriptionDE" placeholder="Beschreibung Deutsch"><h5>Beschreibung Englisch</h5><input class="form-control" type="text" name="link_descriptionEN" placeholder="Beschreibung Englisch"><hr></div>';
	$('.link-box').append(html);
	linkCount += 1;
}

function addBooktipContent() {
	var html = '<div class="booktip-input" data-key="'+booktipCount+'"><h4>Buchtipp '+booktipCount+'</h4><input type="hidden" name="link-id" value="-1"><input class="form-control" type="text" name="booktip_descriptionDE" placeholder="Buchtipp Deutsch"><input class="form-control" type="text" name="booktip_descriptionEN" placeholder="Buchtipp Englisch"><hr></div>';
	$('.booktip-box').append(html);
	booktipCount += 1;
}

function init() {
	changeLanguage();
	
	if($('form').hasClass('article-editor-form')) {
		epiceditor();
		if($('.link-input').val() != undefined) {
			linkCount = Number($('.link-input').last().attr('data-key'))+1;
		}
		$('.add-link').on('click', addLinkContent);
		$('.delete-link').on('click', function() {
			var key = $(this).attr('data-key');
			$('.link-input[data-key="'+key+'"]').remove();
		});

		if($('.booktip-input').val() != undefined) {
			booktipCount = Number($('.booktip-input').last().attr('data-key'))+1;
		}
		$('.add-booktip').on('click', addBooktipContent);

		$('.delete-booktip').on('click', function() {
			var key = $(this).attr('data-key');
			$('.delete-booktip').each(function() {
			console.log('lalala');
		});
			$('.booktip-input[data-key="'+key+'"]').remove();
		});
	}


	$('.article-editor-form').on('submit', saveArticle);
	$('.section-editor-form').on('submit', saveSection);
	$('.comment-editor-form').on('submit', saveComment);
}


init();