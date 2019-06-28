// ==UserScript==
// @name            Perseus Hover Footnotes
// @namespace       http://bifrost.me
// @version         1.0
// @description	    Allows you to hover your mouse over footnotes and see the text immediately.
// @include         http://www.perseus.tufts.edu/hopper/text?*
// @grant           none
// ==/UserScript==

(function() {
    // Hide footer junk
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = ".rights_info {display: none;}";
    document.getElementsByTagName('head')[0].appendChild(style);
    
    // Remove internal section numbers that break up the text
    var sectionNumbers = document.getElementsByClassName('english');
    var len = sectionNumbers.length;
    for(var i=0; i < len; i++) {
        var number = sectionNumbers[0];
        number.parentNode.removeChild(number);
    }
    var mainText = document.getElementById('text_main');
    mainText.innerHTML = mainText.innerHTML.replace(/\[\]/g, '');
    
    // Add footnote hovers
    var sups = document.getElementsByTagName('sup');
    var footnotehtml = [];
    window.footnoteinuse = false;
    for(var i=0; i<sups.length; i++) {
        var sup = sups[i].parentNode;
        if(sup['id']) {
            var notenum = sup.hash.substr(1);
            var footnote = document.getElementById(notenum);
            if(!footnote) continue;

            footnotehtml[i] = footnote.innerHTML;
            sup.childNodes[0].textContent = '[' + (i + 1) + ']';
            sup.setAttribute('footnoteindex', i);
            sup.addEventListener('mouseover',
               function(event) {
                    window.footnoteinuse = false;
                    var footnotepopup = document.getElementById('footnotepopup');
                    if(footnotepopup) footnotepopup.parentNode.removeChild(footnotepopup);
                    var index = parseInt(this.getAttribute('footnoteindex'));

                    var popup = document.createElement('div');
                    popup.innerHTML = footnotehtml[index];

                    popup.id = 'footnotepopup';
                    popup.style.position = 'absolute';
                    popup.style.left = (event.pageX - 50) + 'px';
                    popup.style.top = (event.pageY + 10) + 'px';
                    popup.style.maxWidth = '40%';
                    popup.style.textAlign = 'left';
                    popup.style.backgroundColor = 'paleGoldenRod';
                    popup.style.border = 'thin solid';
                    popup.style.padding = '5px';
                    popup.style.zIndex = '99';
                    popup.className = 'secondary';

                    popup.addEventListener('mouseover', function(event){
                        window.footnoteinuse = true;
                    }, true);

                    popup.addEventListener('mouseout',function(event){
                        window.footnoteinuse = false;

                        var footnotepopup = document.getElementById('footnotepopup');
                        window.setTimeout(function(){
                            if(footnotepopup && !window.footnoteinuse && footnotepopup.parentNode) {
                                footnotepopup.parentNode.removeChild(footnotepopup);
                            }
                        }, 150);
                    }, true);
                
                    document.body.appendChild(popup);
                    var footnotepopup2 = document.getElementById('footnotepopup');
            }, true);


            sup.addEventListener('mouseout',function(event) {
                var footnotepopup = document.getElementById('footnotepopup');
                window.setTimeout(function(){
                    if(footnotepopup && !window.footnoteinuse && footnotepopup.parentNode) {
                        footnotepopup.parentNode.removeChild(footnotepopup);
                    }
                }, 150);
            }, true);
        }
    }
})();