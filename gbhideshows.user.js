// ==UserScript==
// @name         Giant Bomb: Hide 'In This Episode' list
// @namespace    http://bifrost.me/
// @version      1.1
// @description  Hide the list of games played in GB videos by default. Everyone likes surprises!
// @match        https://www.giantbomb.com/shows/*
// @grant        none
// ==/UserScript==

var showString = '+ Show';
var hideString = '- Hide';

var showTitle = '';
var targetParent = null;

titleWatcher();

// Selecting another episode of the same show doesn't trigger a full page reload,
// so we monitor the episode title and trigger adding the toggle when it changes
function titleWatcher() {
    var currentTitle = document.querySelector('div.episode-topslot-content-text > h1').textContent;

    if (currentTitle !== showTitle) {
        addToggle();
        showTitle = currentTitle;
    }
    setTimeout(function(){titleWatcher();}, 2000);
}


function addToggle() {
    targetParent = document.querySelector('div.episode-details');
    // Some older videos don't have the "In This Episode" section, exit script
    if (targetParent == null) {
        return;
    }

    // This is first game in the list, before which the new toggle element will be inserted
    var targetElement = document.querySelector('div.episode-details > p.text-large ~ p.text-small');

    // Create element that will be clicked to toggle the list on/off
    var toggle = document.createElement('div');
    toggle.setAttribute('class', 'vertical-spacing-small-bottom');
    toggle.setAttribute('style', 'cursor: pointer;');
    toggle.addEventListener('click', toggleClick, false);
    toggle.textContent = showString;

    targetParent.insertBefore(toggle, targetElement);
    toggleElements(true);
}

function toggleClick() {
    if (this.textContent == showString) {
        this.textContent = hideString;
        toggleElements(false);
    } else {
        this.textContent = showString;
        toggleElements(true);
    }
}

function toggleElements(makeHidden) {
    var children = targetParent.querySelectorAll(':scope p.text-small')
    children.forEach(function(currentValue){
        if (makeHidden) {
            currentValue.setAttribute('style', 'display:none!important;');
        } else {
            currentValue.removeAttribute('style');
        }
    });
}
