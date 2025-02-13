/**
 * This is the History in Black and White JS file
 * @author Matthias Steinbauer <matthias.steinbauer@jku.at>
 */
var HISTBW = HISTBW || {};

HISTBW.topZIndex = 600;
HISTBW.bottomZIndex = 500;

/**
 * This is called by the framework after widget was successfully loaded
 */ 
function histbw_startup() {
	console.log('History in Black and White started');
	HISTBW.dragElement = null;

	// pointer based devices
	$('#toneDrag').on('mousedown', HISTBW.startDragElement);
	$('#monoDrag').on('mousedown', HISTBW.startDragElement);
	$('#monoToneDragMono').on('mousedown', HISTBW.startDragElement);
	$('#monoToneDragTone').on('mousedown', HISTBW.startDragElement);

	// touch based devices
	$('#histBwContainer').on('touchmove', function(evt) { evt.preventDefault(); });
	$('#toneDrag').on('touchstart', HISTBW.startDragElement);
	$('#monoDrag').on('touchstart', HISTBW.startDragElement);
	$('#monoToneDragMono').on('touchstart', HISTBW.startDragElement);
	$('#monoToneDragTone').on('touchstart', HISTBW.startDragElement);

	$(document).on('mouseup', HISTBW.stopDragElement);
	$(document).on('touchend', HISTBW.stopDragElement);
	$(document).on('mousemove', HISTBW.handleMouseMove);
	$(document).on('touchmove', HISTBW.handleMouseMove);
};

/**
 * This is called by the framework right before the widget will be unloaded from DOM
 */ 
function histbw_teardown() {
	console.log('History in Black and White teardown');
};

/**
 * Reacts to the mouse down
 */
HISTBW.startDragElement = function(evt) {
	console.log('starting to drag element with event');
	console.log(evt);
	var dragTarget = $(evt.target);
	console.log(dragTarget);
	HISTBW.dragElement = dragTarget;
	HISTBW.deLeft = HISTBW.dragElement.offset().left;
	HISTBW.deTop = HISTBW.dragElement.offset().top;
};

/**
 * Handle the mouse move events
 */
HISTBW.handleMouseMove = function(evt) {
	if(HISTBW.dragElement != null) {
		var id = HISTBW.dragElement.attr('id');
		var sel;
		var pageX, pageY;
		if(evt.type == 'touchmove') {
			pageX = evt.originalEvent.pageX;
			pageY = evt.originalEvent.pageY;
		}else{
			pageX = evt.pageX;
			pageY = evt.pageY;
		}
		if(id === 'monoDrag' || id === 'monoToneDragMono') {
			sel = '#mono';
			$(sel).width(1024 - pageX);
			$(sel).height(730 - pageY);
			$(sel).css('z-index', HISTBW.topZIndex);
			$(sel).css('z-index', HISTBW.bottomZIndex);
		}else if(id === 'toneDrag' || id === 'monoToneDragTone') {
			sel = '#tone';
			$(sel).width(pageX);
			$(sel).height(pageY);
			$(sel).css('z-index', HISTBW.topZIndex);
			$(sel).css('z-index', HISTBW.bottomZIndex);
		}
		HISTBW.computeOverlap();
	}
};

/**
 * Computes whether tone and mono overlap and from where to where
 */
HISTBW.computeOverlap = function() {
	var mx = 1024 - $('#mono').width();
	var my = 730 - $('#mono').height();
	var tx = $('#tone').width();
	var ty = $('#tone').height();
	if(mx < tx && my < ty) {
		console.log('overlap!');
		$('#monotone').show();
		var w = tx - mx;
		var h = ty - my;
		$('#monotone').width(w);
		$('#monotone').height(h);
		$('#monotone').offset({ left: mx, top: my });
		$('#monotone').css('background-position', '-' + mx + 'px -' + my + 'px');
	}else{
		$('#monotone').hide();
	}
	// console.log('mx ' + mx + ' my ' + my + ' tx ' + tx + ' ty ' + ty);
};

/**
 * Reacts to the mouse down
 */
HISTBW.stopDragElement = function(evt) {
	var dragTarget = $(evt.target);
	HISTBW.dragElement = null;
};

/**
 * The following will run the startup code in cases where we are not 
 * embedded in the framework
 */
$(document).ready(function() {
	histbw_startup();
});
