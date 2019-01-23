/*
 * Copyright 2019 Harshali Talele  <https://github.com/harshalitalele/jsdraw>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function (b) {
    "use strict";
    
    var hasTouch = !!window.hasOwnProperty('ontouchstart'),
        ACTIONS = {
            DOWN: hasTouch ? "touchstart" : "mousedown",
            MOVE: hasTouch ? "touchmove" : "mousemove",
            UP: hasTouch ? "touchend" : "mouseup",
            LEAVE: hasTouch ? "touchleave" : "mouseleave"
        };
    
    b.actions = function (overlayElem) {
        this.baseElement = overlayElem;
        this.isActionStarted = false;
        this.isActionCompleted = false;
        this.implementedAction = null;
    };
        
    b.actions.prototype.attachActions = function () {
        var selfActions = this;
        
        function getRelativePoints(x, y) {
            var parentPos = selfActions.baseElement.getClientRects()[0];
            return {x: x - parentPos.left, y: y - parentPos.top};
        }
        
        this.mousedownListener = function (event) {
            selfActions.isActionStarted = true;
            selfActions.isActionCompleted = false;
            selfActions.baseElement.width = parseFloat(selfActions.baseElement.getClientRects()[0].width);
            selfActions.baseElement.height = parseFloat(selfActions.baseElement.getClientRects()[0].height);
        };

        this.mousemoveListener = function (event) {
            if (selfActions.isActionStarted && !selfActions.isActionCompleted) {
                if (!event.x || !event.y) {
                    event.x = event.touches[0].clientX;
                    event.y = event.touches[0].clientY;
                }
                selfActions.implementedAction.actionChangeBehavior(selfActions.baseElement, getRelativePoints(event.x, event.y));
            }
        };

        this.mouseupListener = function (event) {
            selfActions.isActionStarted = false;
            selfActions.isActionCompleted = true;
            if (!event.x || !event.y) {
                event.x = event.touches[0].clientX;
                event.y = event.touches[0].clientY;
            }
            selfActions.implementedAction.actionCompleteBehavior(selfActions.baseElement, getRelativePoints(event.x, event.y));
        };

        this.mouseleaveListener = function (event) {
            selfActions.isActionStarted = false;
            selfActions.isActionCompleted = true;
        };
        
        this.baseElement.addEventListener(ACTIONS.DOWN, this.mousedownListener);
        this.baseElement.addEventListener(ACTIONS.MOVE, this.mousemoveListener);
        this.baseElement.addEventListener(ACTIONS.UP, this.mouseupListener);
        this.baseElement.addEventListener(ACTIONS.LEAVE, this.mouseleaveListener);
    };
    
    b.actions.prototype.detachActions = function () {
        this.baseElement.removeEventListener(ACTIONS.DOWN, this.mousedownListener);
        this.baseElement.removeEventListener(ACTIONS.MOVE, this.mousemoveListener);
        this.baseElement.removeEventListener(ACTIONS.UP, this.mouseupListener);
        this.baseElement.removeEventListener(ACTIONS.LEAVE, this.mouseleaveListener);
    };
    
    b.actions.prototype.setBehavior = function (implementedAction) {
        //To Do: validate allowed if implementedAction is among the allowed ones
        this.implementedAction = implementedAction;
    };
    
}(DrawingBoard));
