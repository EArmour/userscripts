// ==UserScript==
// @name         Giant Bomb: Hide 'In This Episode' list
// @namespace    http://bifrost.me/
// @version      1.2
// @description  Hide the list of games played in GB videos by default. Everyone likes surprises!
// @match        https://www.giantbomb.com/shows/*
// @grant        none
// ==/UserScript==

const showString = '+ Show';
const hideString = '- Hide';

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

    // Get list of "In This Episode" games, don't bother hiding if there's only one
    var gameList = document.querySelectorAll('div.episode-details > p.text-large ~ p.text-small');
    if (gameList.length < 2) {
        return;
    }

    // The new toggle element will be inserted before the first item in the list
    var targetElement = gameList[0];

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
