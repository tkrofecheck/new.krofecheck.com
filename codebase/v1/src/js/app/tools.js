myApp.Tools = (function() {
    return {
        injectScript: function(obj) {
    		$script = $('<script></script>');

    		$script.attr(obj.attr);
    		$script.html(obj.html);

    		$('head').append($script);
    	},

        addCSSRule: function(sheet, selector, rules, index) {
            if ('insertRule' in sheet) {
                sheet.insertRule(selector + '{' + rules + '}', index);
            } else if ('addRule' in sheet) {
                sheet.addRule(selector, rules, index);
            }
        },

    	getData: function(obj) {
    		var path = 'data/' + obj.dataFile;

            $.ajax({
                url: path,
                method: "GET",
                cache: false,
                success: function(data) {
                    if ('dataKey' in obj) {
                        obj.data = $.extend(true, obj.data, data[obj.dataKey]);
                    } else {
                        obj.data = $.extend(true, data, obj.data);
                    }
                    obj.dataReady.value = true;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 500) {
                        console.log('Internal error: ' + jqXHR.responseText);
                    } else {
                        console.log('Error: ' + errorThrown);
                    }
                  }
            });
            
            return obj;
    	},

    	setupListener: function(obj, key, fn) {
    		obj[key] = (function() {
                var initVal,
                    interceptors = [];

                function callInterceptors(newVal) {
                    for (var i = 0; i < interceptors.length; i += 1) {
                        interceptors[i](newVal);
                    }
                }

                return {
                    get value() {
                        // user never has access to the private variable "initVal"
                        return initVal;
                    },

                    set value(newVal) {
                        callInterceptors(newVal);
                        initVal = newVal;
                    },

                    listen: function(fn) {
                        if (typeof fn === 'function') {
                            interceptors.push(fn);
                        }
                    }
                };
            }());

            obj[key].listen(fn);

    	    return obj[key];
    	},

        getSections: function() {
            var checkAppUpdateVal = setInterval(function() {
                if (typeof myApp.updated !== 'undefined' && myApp.updated > 0) {
                    console.log(myApp.updated);

                    clearInterval(checkAppUpdateVal);
                    myApp.Portfolio.init();
                }
            }, 100);

            myApp.Nav.init();
            myApp.About.init();
            myApp.Resume.init();
        },

        customModal: {
            HandlebarsTemplate: {
                attr: {
                    'id': 'popup-modal-template',
                    'type': 'text/x-handlebars-template'
                },
                html: ''.concat(
                    '<div class="popup">',
                        '<div>{{{this.title}}}</div>',
                        '<div>{{{this.message}}}</div>',
                        '<button data-choice="yes">{{{this.text.yes}}}</button><button data-choice="no">{{{this.text.no}}}</button>',
                    '</div>'
                )
            },

            init: function(config) {
                var _this = this;

                if ($('.modal').length) {
                    console.log('Modal on screen. Only one modal permitted at a time.');
                    return false;
                }

                _this.config = config;

                _this.render();
            },

            injectScript: function() {
                var _this = this;

                // Inject Handlebars Template into <head>
                myApp.Tools.injectScript(_this.HandlebarsTemplate);
            },

            bindEvents: function() {
                var _this = this;

                $('.modal').click(function(e) { // Tapping anywhere on modal (except popup) will remove from DOM
                   e.stopPropagation(); // stop bubble

                   _this.remove();

                   return true;
                });

                $('.popup').on('click tap', function(e) { // Tapping anywhere on popup box will keep it open
                    e.stopPropagation(); // stop bubble

                    return false;
                });

                $('.popup').on('click tap', 'button', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var $btn = $(e.currentTarget),
                        btnChoice = $btn.data('choice');

                    _this.config.choice[btnChoice]();

                    _this.remove();

                    return true;
                });
            },

            render: function() {
                var _this = this;

                require(['handlebars'], function(Handlebars) {
                    var $hbTemplate = $('#popup-modal-template'),
                        $container = $('<div class="modal"></div>'),
                        source = $hbTemplate.html(),
                        template = Handlebars.compile(source),
                        context = _this.config || {},
                        html = template(context);

                    $container.html(html);

                    $('body').append($container);

                    _this.bindEvents();
                });
            },

            remove: function() {
                var _this = this,
                    $modal = $('.modal');

                $modal.children().unbind();
                $modal.unbind();
                $modal.remove();
            }
        }
    };
})();
