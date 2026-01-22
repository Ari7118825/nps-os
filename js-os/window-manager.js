import { h } from 'https://esm.sh/preact@10.19.2';
import { useState } from 'https://esm.sh/preact@10.19.2/hooks';
import htm from 'https://esm.sh/htm';

export const html = htm.bind(h);

export const Window = ({ win, onClose, onFocus, onMinimize }) => {
    const [state, setState] = useState({ x: win.x, y: win.y, w: 600, h: 400 });
    const [isMax, setIsMax] = useState(false);

    const handleAction = (e, type) => {
        if (isMax) return;
        e.preventDefault();
        onFocus();
        const startX = e.clientX, startY = e.clientY;
        const { w: sw, h: sh, x: sx, y: sy } = state;

        const move = (me) => {
            const dx = me.clientX - startX, dy = me.clientY - startY;
            if (type === 'drag') setState(p => ({ ...p, x: sx + dx, y: sy + dy }));
            if (type === 'res') setState(p => ({ ...p, w: sw + dx, h: sh + dy }));
        };

        const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
    };

    return html`
        <div class="window ${win.minimized ? 'min' : ''} ${isMax ? 'max' : ''}" 
             style="left: ${state.x}px; top: ${state.y}px; width: ${state.w}px; height: ${state.h}px; z-index: ${win.z}"
             onMouseDown=${onFocus}>
            <div class="title-bar" onMouseDown=${(e) => handleAction(e, 'drag')}>
                <div class="title-left">
                    <img src="./images/${win.icon}" class="win-icon" />
                    <span>${win.title}</span>
                </div>
                <div class="win-btns">
                    <button class="b-min" onClick=${onMinimize}></button>
                    <button class="b-max" onClick=${() => setIsMax(!isMax)}></button>
                    <button class="b-cls" onClick=${onClose}></button>
                </div>
            </div>
            <div class="window-body">${win.content}</div>
            <div class="resizer corner" onMouseDown=${(e) => handleAction(e, 'res')}></div>
        </div>
    `;
};
