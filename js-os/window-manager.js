import { h, render } from 'https://esm.sh/preact@10.19.2';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.2/hooks';
import htm from 'https://esm.sh/htm';

const html = htm.bind(h);

const Window = ({ win, onClose, onFocus, onMinimize }) => {
    const [isMax, setIsMax] = useState(false);
    const [state, setState] = useState({ x: win.x, y: win.y, w: 600, h: 400 });

    const startAction = (e, type) => {
        if (isMax) return;
        e.preventDefault(); onFocus();
        const startX = e.clientX, startY = e.clientY;
        const { w: sw, h: sh, x: sx, y: sy } = state;

        const onMove = (me) => {
            const dx = me.clientX - startX, dy = me.clientY - startY;
            if (type === 'drag') setState(p => ({ ...p, x: sx + dx, y: sy + dy }));
            else if (type === 'corner') setState(p => ({ ...p, w: sw + dx, h: sh + dy }));
            else if (type === 'r') setState(p => ({ ...p, w: sw + dx }));
            else if (type === 'b') setState(p => ({ ...p, h: sh + dy }));
        };

        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    return html`
        <div class="window ${isMax ? 'is-max' : ''} ${win.minimized ? 'is-min' : ''}" 
             style="left: ${state.x}px; top: ${state.y}px; width: ${state.w}px; height: ${state.h}px; z-index: ${win.z}"
             onMouseDown=${onFocus}>
            <div class="title-bar" onMouseDown=${(e) => startAction(e, 'drag')}>
                <div class="title-left">
                    <img src="./images/${win.icon}" class="title-icon" />
                    <span>${win.title}</span>
                </div>
                <div class="controls">
                    <button class="min" onClick=${(e) => { e.stopPropagation(); onMinimize(); }}></button>
                    <button class="max" onClick=${(e) => { e.stopPropagation(); setIsMax(!isMax); }}></button>
                    <button class="close" onClick=${onClose}></button>
                </div>
            </div>
            <div class="window-body" id="win-body-${win.id}">
                ${win.content || 'Loading...'}
            </div>
            ${!isMax && html`<div class="resizer corner" onMouseDown=${(e) => startAction(e, 'corner')}></div>`}
        </div>
    `;
};

// Global Window Manager API
window.wm = {
    open: null, // Will be set by desktop-manager
};

export { Window, html };
