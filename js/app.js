var myApp={dataFile:"data.min.json"};!function(){var a=document.getElementsByTagName("html")[0];"ontouchstart"in window||navigator.MaxTouchPoints>0||navigator.msMaxTouchPoints>0?a.classList.add("touch"):a.classList.add("no-touch")}(),requirejs.config({baseUrl:"js/lib",findNestedDependencies:!0,paths:{app:"../app",jquery:["//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min","jquery.min"],handlebars:["//cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min","handlebars.min"],masonry:["//cdnjs.cloudflare.com/ajax/libs/masonry/3.3.2/masonry.pkgd.min","masonry.pkgd.min"]}}),requirejs(["app/main"]);
//# sourceMappingURL=app.js.map