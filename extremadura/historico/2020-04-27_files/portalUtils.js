var Utils = {
	keepAliveTimer: null,
	doJsStuff: function() {
		$('.file-input').bootstrapFileInput();
	},
	generateUUID: function() {
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	    });
	    return uuid;
	},
	forEachProperty: function(obj, callback) {
		for (var key in obj) {
			callback(key, obj);
		}
	},
	keepAlive: function() {
		var timeout = _sessionTimeoutInSeconds - 30; // drop down timeout 30 seconds for safety
		timeout = Math.min(300, timeout); // Set max keep alive timeout in 5 minutes
		timeout = Math.max(30, timeout); // Set min keep alive timeout in 30 seconds
		timeout = timeout * 1000; // Set timeout in milliseconds.
		Utils.keepAliveTimer = setInterval(function() {
			getAjaxJson(_keepAliveUrl, {}, null, null, true);
		}, timeout);
	},
	clearFormData: function(e) {
		var parentForm = $(e.target).parents('FORM').first();
		if (parentForm != null) {
			parentForm.find('INPUT[type|="text"]').val('');
			parentForm.find('INPUT[type|="checkbox"]').attr('checked', false);
			parentForm.find('TEXTAREA').val('');
			parentForm.find('SELECT').val('');
		}
	},
	loadStandardAjaxCatalog: function(catalog, filter, htmlId, selectedValue, emptyName, emptyValue, markAsLoading) {
		Utils.loadAjaxCatalog(catalog, 'standard', filter, htmlId, selectedValue, emptyName, emptyValue, markAsLoading);
	},
	loadStaticAjaxCatalog: function(catalog, filter, htmlId, selectedValue, emptyName, emptyValue, markAsLoading) {
		Utils.loadAjaxCatalog(catalog, 'static', filter, htmlId, selectedValue, emptyName, emptyValue, markAsLoading);
	},
	loadCitiesAjaxCatalog: function(filter, htmlId, selectedValue, emptyName, emptyValue, markAsLoading) {
		Utils.loadAjaxCatalog('', 'cities', filter, htmlId, selectedValue, emptyName, emptyValue, markAsLoading);
	},
	loadAjaxCatalog: function(catalog, type, filter, htmlId, selectedValue, emptyName, emptyValue, markAsLoading) {
		var url = _baseAjaxUrl + 'loadCatalogAjax.php';
		var element = $('#' + htmlId);
		
		if (markAsLoading) {
			element.attr('disabled', 'disabled');
			element.empty();
			element.append('<option>' + _msgLoading + '...</option>');
		}
		
		AjaxUtils.postJson(
			url, 
			{name: catalog, type: type, filter: filter},
            function(json) {
	            if (json.success) {
	            	element.empty();
	            	if (emptyName != null) {
	            		var emptyOption = '<option';
	            		if (emptyValue != null) emptyOption += ' value="' + emptyValue + '"';
	            		emptyOption += '>' + emptyName + '</option>';
	            		element.append(emptyOption);
	            	}
	            	if (json.data && json.data.length > 0) {
	            		for (var idx = 0; idx < json.data.length; ++idx) {
	            			element.append('<option value="' + json.data[idx].value + '"' + (selectedValue==json.data[idx].value?' selected="selected"':'') + '>' + json.data[idx].name + '</option>');
	            		}
	            	}
	        		if (markAsLoading) {
	        			element.removeAttr('disabled');
	        		}
	            } else if (json.errors) {
	            	element.empty();
        			element.append('<option>ERROR!</option>');
	            }
			},
			AjaxUtils.ajaxCommunicationError,
			true
		);
	}
};
$(window).load(Utils.doJsStuff);

var MessageUtils = {
	showError: function(msg, dialogWidth) {
		MessageUtils.showInfo(msg, _msgErrorTilte, dialogWidth);
	},
	showConfirm: function(msg, yesCallback, noCallback) {
		if (noCallback === undefined) {
			noCallback = function(){/*Do Nothing*/};
		}
		MessageUtils.showInfo(msg, '', _msgDefaultWidth, _msgConfirmOkLabel, _msgConfirmCancelLabel, yesCallback, noCallback);
	},
	showInput: function(title, msg, okCallback, cancelCallback) {
		if (cancelCallback === undefined) {
			cancelCallback = function(){/*Do Nothing*/};
		}
		MessageUtils.showInfo(msg, title, _msgDefaultWidth, _msgInputOkLabel, _msgInputCancelLabel, okCallback, cancelCallback, true);
	},
	openStandardWindow: function(title, content, width, height, isModal, isClosable) {
		$($.window.getAll()).each(function (index, wnd) {wnd.unselect();});
		if (isModal == undefined) isModal = false;
		if (isClosable == undefined) isClosable = true;
		var stdWindow = $.window({
	       showModal: isModal,
	       modalOpacity: 0.5,
	       closable: isClosable,
	       minimizable: false,
	       showFooter: false,
	       title: title,
	       content: content,
	       width: width,
	       height: height
	    });
	    stdWindow.isModal = isModal;
	    return stdWindow;
	}
}

var AjaxUtils = {
	doOnLoad: function(cssSelector) {
		// Hide 'jsNoShow' items
		$(cssSelector).find('.jsNoShow').hide();
		// Show 'jsShow' items
		$(cssSelector).find('.jsShow').show();
		// Clean form button
		$(cssSelector).find('.btnClean').click(Utils.clearFormData);
		
		$(cssSelector).find('.jsIsMandatory').each(function (idx, element){
			$(element).attr('title', _msgIsMandatoryTitle);
		});
	},
	ajaxCommunicationError: function() {
		MessageUtils.showError(_msgAjaxCommunicationError);
	},
	ajaxShowErrors: function(errors) {
		if (errors.html) {
			var html = jQuery.parseJSON(errors.html);
			if (html.errors) {
				MessageUtils.showError(html.errors);
				return;
			}
		} 
		if (errors.errors) {
			MessageUtils.showError(errors.errors);
		} else {
			MessageUtils.showError(errors);
		}
	},
	postJson: function(url, paramsArray, successCallback, errorCallback) {
		$.ajax(url, {
			type: 'POST',
			dataType: 'json',
	        data: paramsArray,
	        success: successCallback, // (data, textStatus, jqXHR)
	        error: errorCallback // (jqXHR, textStatus, errorThrown)
	    });
	},
	getJson: function(url, paramsArray, successCallback, errorCallback) {
		$.ajax(url, {
			type: 'GET',
			dataType: 'json',
	        data: paramsArray,
	        success: successCallback, // (data, textStatus, jqXHR)
	        error: errorCallback // (jqXHR, textStatus, errorThrown)
	    });
	},
	postHtml: function(url, paramsArray, successCallback, errorCallback) {
		$.ajax(url, {
			type: 'POST',
			dataType: 'html',
	        data: paramsArray,
	        success: successCallback, // (data, textStatus, jqXHR)
	        error: errorCallback // (jqXHR, textStatus, errorThrown)
	    });
	},
	getHtml: function(url, paramsArray, successCallback, errorCallback) {
		$.ajax(url, {
			type: 'GET',
			dataType: 'html',
	        data: paramsArray,
	        success: successCallback, // (data, textStatus, jqXHR)
	        error: errorCallback // (jqXHR, textStatus, errorThrown)
	    });
	}
};

var ModalUtils = {
	modalsStack: [],
	pleaseWaitId: 'pleaseWaitDialog',
	parametersDataName: 'rcms_parameters',
	lockScreenMessage: 'Loading...',
	dropFromStack: function(id) {
		if (ModalUtils.modalsStack.length > 0) {
			var remainingElements = [];
			for (var idx = 0; idx < ModalUtils.modalsStack.length; ++idx) {
				var element = ModalUtils.modalsStack[idx];
				if (element != id) remainingElements.push(element);
			}
			ModalUtils.modalsStack = remainingElements;
		}
	},
	addModal: function(id) {
		ModalUtils.modalsStack.push(id);
	},
	getCurrentModal: function() {
		if (ModalUtils.modalsStack.length > 0) {
			return ModalUtils.modalsStack[ModalUtils.modalsStack.length - 1];
		} else {
			return null;
		}
	},
	openPleaseWait: function() {
	    var pleaseWaitWindow = $('body').find('#' + ModalUtils.pleaseWaitId);
	    if (!pleaseWaitWindow.length) {
	    	var modalContent = '<div id="' + ModalUtils.pleaseWaitId + '" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="' + ModalUtils.pleaseWaitId + '_title" aria-hidden="true"><div class="modal-dialog"><div class="modal-content">';
	    	modalContent += '<div class="modal-header"><h4 id="' + ModalUtils.pleaseWaitId + '_title" class="modal-title">' + ModalUtils.lockScreenMessage + '</h4></div>';
	    	modalContent += '<div class="modal-body">';
	    	modalContent += '<div class="progress progress-striped active"><div style="width: 100%" aria-valuemax="100" aria-valuemin="0" aria-valuenow="100" role="progressbar" class="progress-bar progress-bar-info"><span class="sr-only">' + ModalUtils.lockScreenMessage + '</span></div></div>';
	    	modalContent += '</div>';
	    	modalContent += '</div></div></div>';
	    	$('body').append(modalContent);
	    	pleaseWaitWindow = $('body').find('#' + ModalUtils.pleaseWaitId);
	    }
	    $(pleaseWaitWindow).modal();
	},
	closePleaseWait: function() {
		$('body').find('#' + ModalUtils.pleaseWaitId).modal('hide');
	},
	/**
	 * data: String with the modal content.
	 * parameters: extra parameters passed as first argument of callbacks.
	 * openedCallback: callback function launched after open modal.
	 * closedCallback: callback function launched after close modal.
	 */
	open: function(data, parameters, openedCallback, closedCallback) {
		var modalId = Utils.generateUUID();
		ModalUtils.addModal(modalId);
		$('body').append('<div id="' + modalId + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabel_' + modalId + '" aria-hidden="true">');
		
		currentModalWindow = $('#' + modalId);
		if (typeof(openedCallback) == 'function') $(currentModalWindow).on('shown.bs.modal', function () { openedCallback($(currentModalWindow).data('rcms_parameters')); });
		if (typeof(closedCallback) == 'function') $(currentModalWindow).on('hidden.bs.modal', function () { closedCallback($(currentModalWindow).data('rcms_parameters')); });
		$(currentModalWindow).on('hidden.bs.modal', function() {
			$('#' + modalId).remove();
			ModalUtils.dropFromStack(modalId);
		});
		
		// Sanitize parameters
		if (!parameters) parameters = {};
		
		$(currentModalWindow).html(data);
		$(currentModalWindow).data(ModalUtils.parametersDataName, parameters);
		
		// Init utils
		 AjaxUtils.doOnLoad('#' + modalId);
		
		$(currentModalWindow).modal();
	},
	openBasic: function (title, data, parameters, openedCallback, closedCallback, extraClasses) {
		if (extraClasses == undefined) extraClasses = '';
		html = '';
		html += '<div class="modal-dialog ' + extraClasses + '">';
			html += '<div class="modal-content">';
				html += '<div class="modal-header">';
					html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
					html += '<h4 id="modalLabel_' + Utils.generateUUID() + '" class="modal-title">';
						if (!StringUtils.isEmpty(title)) html += title;
					html += '</h4>';
				html += '</div>';
				html += '<div class="modal-body">';
					html += data;
				html += '</div>';
			html += '</div>';
		html += '</div>';
		ModalUtils.open(html, parameters, openedCallback, closedCallback);
	},
	closeCurrent: function(callback) {
		var currentModalWindow = $('#' + ModalUtils.getCurrentModal());
		$(currentModalWindow).modal('hide');
		
		if (typeof callback == 'function') setTimeout(callback, 300);
	},
	getCurrentParameters: function() {
		var currentModalWindow = $('#' + ModalUtils.getCurrentModal());
		return $(currentModalWindow).data(ModalUtils.parametersDataName);
	},
	/**
	 * url: String with the url for ajax post.
	 * postData: Object with post data to send.
	 * parameters: extra parameters passed as first argument of callbacks. Add a 'pleaseWait = true' parameter to lock screen.
	 * openedCallback: callback function launched after open modal.
	 * closedCallback: callback function launched after close modal.
	 * closedCallback: callback function launched after ajax return and before open modal, if defined, must return TRUE to show modal. Args: ajax returned object, postData, parameters.
	 */
	loadAjaxModal: function(url, postData, parameters, openedCallback, closedCallback, beforeOpenCallback) {
		if (!postData) postData = {};
		if (!parameters) parameters = {};
		postData.rcmsModalId = ModalUtils.getCurrentModal();
		AjaxUtils.postAjaxJson(
			url, 
			postData,
            function(json) {
				var openModal = true;
				if (typeof(beforeOpenCallback) == 'function') {
					openModal = beforeOpenCallback(json, postData, parameters);
				}
				if (openModal) {
		            if (json.html) {
		            	ModalUtils.open(json.html, parameters, openedCallback, closedCallback);
		            } else if (json.errors) {
		            	ModalUtils.showErrorModal(json.errors);
		            }
				}
			},
			ModalUtils.showAjaxCommunicationError,
			null,
			parameters.pleaseWait
		);
	},
	showAjaxCommunicationError: function() {
		ModalUtils.showErrorModal(_msgAjaxCommunicationError);
	},
	showErrorModal: function (messages, parameters, openedCallback, closedCallback) {
		var modalId = ModalUtils.getCurrentModal();
		ModalUtils.open('<div id="modalMessages_' + modalId + '" />', parameters, function () {
    		MessageUtils.showError('modalMessages_' + modalId, messages);
    	});
	}
};

var StringUtils = {
	plainText: function(string) {
		var result = string;
		
		if (string != '') {
			result = result.replace(/[‡·‰\u00e0\u00e1\u00e4]/g,"a").replace(/[¿¡ƒ\u00c0\u00c1\u00c4]/g,"A");
			result = result.replace(/[ËÈÎ\u00e8\u00e9\u00eb]/g,"e").replace(/[»…À\u00c8\u00c9\u00cb]/g,"E");
			result = result.replace(/[ÏÌÔ\u00ec\u00ed\u00ef]/g,"i").replace(/[ÃÕœ\u00cc\u00cd\u00cf]/g,"I");
			result = result.replace(/[ÚÛˆ\u00f2\u00f3\u00f6]/g,"o").replace(/[“”÷\u00d2\u00d3\u00d6]/g,"O");
			result = result.replace(/[˘˙¸\u00f9\u00fa\u00fc]/g,"u").replace(/[Ÿ⁄‹\u00d9\u00da\u00dc]/g,"U");
		}

		return result;
	},
	startsWith: function(src, needle, caseInsensitive) {
		if (src == null && needle == null) return true;
		if (src == null || needle == null) return false;
		if (src.length < needle.length) return false;
		var srcChunk = src.substring(0, needle.length);
		if (caseInsensitive === undefined || caseInsensitive == false) {
			return srcChunk.toLowerCase() == needle.toLowerCase();
		} else {
			return srcChunk == needle;
		}
	},
	contains: function(src, needle, caseInsensitive) {
		if (src == null && needle == null) return true;
		if (src == null || needle == null) return false;
		if (src.length < needle.length) return false;
		if (caseInsensitive === undefined || caseInsensitive == false) {
			return src.toLowerCase().indexOf(needle.toLowerCase()) > -1;
		} else {
			return src.indexOf(needle) > -1;
		}
	},
	padding: function(src, length, pad, direction) {
		var paddedStr = String(src);
		if (pad === undefined) pad = ' ';
		if (direction == undefined) direction = 0;
		while (paddedStr.length < length) {
			if (direction == 0) {
				paddedStr = pad + paddedStr;
			} else {
				paddedStr = paddedStr + pad;
			}
		}
		return paddedStr;
	},
	paddingLeft: function(src, length, pad) {
		return StringUtils.padding(src, length, pad, 0);
	},
	paddingRight: function(src, length, pad) {
		return StringUtils.padding(src, length, pad, 1);
	},
	isEmpty: function (string) {
		if (typeof string == "undefined") return true;
		if (string == null) return true;
		if (string == '') return true;
		return false;
	}
};

var FileUtil = {
	checkExtension: function(filename, allowedExtensions) {
		var allowed = false;
		
		if ($.isEmpty(allowedExtensions) || (allowedExtensions == '*')) {
			allowed = true;
		} else {
			var extensions = allowedExtensions.split(',');
			if (filename.lastIndexOf(".") > 0) {
				var fileExtension = filename.substring(filename.lastIndexOf(".") + 1, filename.length).toLowerCase();
				
				for (var idx = 0; idx < extensions.length; ++idx) {
					if (extensions[idx].toLowerCase() == fileExtension) {
						allowed = true;
						break;
					}
				}
			}
		}
		
		return allowed;
	}
}

var NavigatorUtil = {
	IE : "MSIE",
	FIREFOX: "Firefox",
	CHROME: "Chrome",
	informationArray : function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
        return 'MSIE '+(tem[1] || '');
    }
    M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    return M;
    }
};

//JQUERY EXTENSIONS
jQuery.extend({
	isEmpty: function(obj) {
	    var isEmpty = false;
		 
	    if (typeof obj == 'undefined' || obj === null || obj === ''){
	      isEmpty = true;
	    }     
	       
	    if (typeof obj == 'number' && isNaN(obj)){
	      isEmpty = true;
	    }
	       
	    if (obj instanceof Date && isNaN(Number(obj))){
	      isEmpty = true;
	    }
	       
	    return isEmpty;
	},
});

/*
Bootstrap - File Input
======================

This is meant to convert all file input tags into a set of elements that displays consistently in all browsers.

Converts all
<input type="file">
into Bootstrap buttons
<a class="btn">Browse</a>

*/
(function($) {

$.fn.bootstrapFileInput = function() {

this.each(function(i,elem){

  var $elem = $(elem);

  // Maybe some fields don't need to be standardized.
  if (typeof $elem.attr('data-bfi-disabled') != 'undefined') {
    return;
  }

  // Set the word to be displayed on the button
  var buttonWord = 'Browse';

  if (typeof $elem.attr('title') != 'undefined') {
    buttonWord = $elem.attr('title');
  }

  var className = '';

  if (!!$elem.attr('class')) {
    className = ' ' + $elem.attr('class');
  }

  // Now we're going to wrap that input field with a Bootstrap button.
  // The input will actually still be there, it will just be float above and transparent (done with the CSS).
  $elem.wrap('<a class="file-input-wrapper btn btn-default ' + className + '"></a>').parent().prepend($('<span></span>').html(buttonWord));
})

// After we have found all of the file inputs let's apply a listener for tracking the mouse movement.
// This is important because the in order to give the illusion that this is a button in FF we actually need to move the button from the file input under the cursor. Ugh.
.promise().done( function(){

  // As the cursor moves over our new Bootstrap button we need to adjust the position of the invisible file input Browse button to be under the cursor.
  // This gives us the pointer cursor that FF denies us
  $('.file-input-wrapper').mousemove(function(cursor) {

    var input, wrapper,
      wrapperX, wrapperY,
      inputWidth, inputHeight,
      cursorX, cursorY;

    // This wrapper element (the button surround this file input)
    wrapper = $(this);
    // The invisible file input element
    input = wrapper.find("input");
    // The left-most position of the wrapper
    wrapperX = wrapper.offset().left;
    // The top-most position of the wrapper
    wrapperY = wrapper.offset().top;
    // The with of the browsers input field
    inputWidth= input.width();
    // The height of the browsers input field
    inputHeight= input.height();
    //The position of the cursor in the wrapper
    cursorX = cursor.pageX;
    cursorY = cursor.pageY;

    //The positions we are to move the invisible file input
    // The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle
    moveInputX = cursorX - wrapperX - inputWidth + 20;
    // Slides the invisible input Browse button to be positioned middle under the cursor
    moveInputY = cursorY- wrapperY - (inputHeight/2);

    // Apply the positioning styles to actually move the invisible file input
    input.css({
      left:moveInputX,
      top:moveInputY
    });
  });

  $('body').on('change', '.file-input-wrapper input[type=file]', function(){

    var fileName;
    fileName = $(this).val();

    // Remove any previous file names
    $(this).parent().next('.file-input-name').remove();
    if (!!$(this).prop('files') && $(this).prop('files').length > 1) {
      fileName = $(this)[0].files.length+' files';
    }
    else {
      fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
    }

    // Don't try to show the name if there is none
    if (!fileName) {
      return;
    }

    var selectedFileNamePlacement = $(this).data('filename-placement');
    if (selectedFileNamePlacement === 'inside') {
      // Print the fileName inside
      $(this).siblings('span').html(fileName);
      $(this).attr('title', fileName);
    } else {
      // Print the fileName aside (right after the the button)
      $(this).parent().after('<span class="file-input-name">'+fileName+'</span>');
    }
  });

});

};

//Add the styles before the first stylesheet
//This ensures they can be easily overridden with developer styles
var cssHtml = '<style>'+
'.file-input-wrapper { overflow: hidden; position: relative; cursor: pointer; z-index: 1; }'+
'.file-input-wrapper input[type=file], .file-input-wrapper input[type=file]:focus, .file-input-wrapper input[type=file]:hover { position: absolute; top: 0; left: 0; cursor: pointer; opacity: 0; filter: alpha(opacity=0); z-index: 99; outline: 0; }'+
'.file-input-name { margin-left: 8px; }'+
'</style>';
$('link[rel=stylesheet]').eq(0).before(cssHtml);

})(jQuery);