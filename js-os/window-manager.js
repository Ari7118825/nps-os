import { h, render } from 'https://esm.sh/preact@10.19.2';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.2/hooks';
import htm from 'https://esm.sh/htm';

const html = htm.bind(h);

const Window = ({ win, onClose, onFocus }) => {
    const [isMax, setIsMax] = useState(false);
    const [isMin, setIsMin] = useState(false);
    const [state, setState] = useState({ x: win.x, y: win.y, w: 400, h: 250 });

    const startAction = (e, type) => {
        if (isMax) return; // Disable dragging/resizing when maximized
        e.preventDefault();
        onFocus();
        const startX = e.clientX, startY = e.clientY;
        const { w: sw, h: sh, x: sx, y: sy } = state;

        const onMove = (me) => {
            const dx = me.clientX - startX, dy = me.clientY - startY;
            if (type === 'drag') setState(p => ({ ...p, x: sx + dx, y: sy + dy }));
            else if (type === 'r') setState(p => ({ ...p, w: sw + dx }));
            else if (type === 'l') setState(p => ({ ...p, x: sx + dx, w: sw - dx }));
            else if (type === 'b') setState(p => ({ ...p, h: sh + dy }));
            else if (type === 't') setState(p => ({ ...p, y: sy + dy, h: sh - dy }));
            else if (type === 'corner') setState(p => ({ ...p, w: sw + dx, h: sh + dy }));
        };

        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    return html`
        <div class="window ${isMax ? 'is-max' : ''} ${isMin ? 'is-min' : ''}" 
             style="left: ${state.x}px; top: ${state.y}px; width: ${state.w}px; height: ${state.h}px; z-index: ${win.z}"
             onMouseDown=${onFocus}>
            <div class="title-bar" onMouseDown=${(e) => startAction(e, 'drag')}>
                <span>${win.title}</span>
                <div class="controls">
                    <button class="min" onClick=${(e) => { e.stopPropagation(); setIsMin(!isMin); }}></button>
                    <button class="max" onClick=${(e) => { e.stopPropagation(); setIsMax(!isMax); setIsMin(false); }}></button>
                    <button class="close" onClick=${onClose}></button>
                </div>
            </div>
            ${!isMin && html`<div class="window-body">This is a window body.</div>`}
            
            ${!isMax && !isMin && html`
                <div class="resizer t" onMouseDown=${(e) => startAction(e, 't')}></div>
                <div class="resizer b" onMouseDown=${(e) => startAction(e, 'b')}></div>
                <div class="resizer l" onMouseDown=${(e) => startAction(e, 'l')}></div>
                <div class="resizer r" onMouseDown=${(e) => startAction(e, 'r')}></div>
                <div class="resizer corner" onMouseDown=${(e) => startAction(e, 'corner')}></div>
            `}
        </div>
    `;
};

const App = () => {
    const [windows, setWindows] = useState([]);
    const [z, setZ] = useState(100);

    // Hide the loader once Preact starts
    useEffect(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.style.opacity = '0';
        setTimeout(() => loader && loader.remove(), 500);
    }, []);

    const spawn = () => {
        const id = Date.now();
        setWindows([...windows, { id, title: `Window ${windows.length + 1}`, x: 50 + (windows.length * 20), y: 50 + (windows.length * 20), z: z + 1 }]);
        setZ(z + 1);
    };

    return html`
        <div id="desktop">
            <button class="open-btn" onClick=${spawn}>Launch App</button>
            ${windows.map(win => html`
                <${Window} key=${win.id} win=${win} 
                    onFocus=${() => { setZ(z+1); win.z = z+1; }} 
                    onClose=${() => setWindows(windows.filter(w => w.id !== win.id))} />
            `)}
        </div>
    `;
};

render(html`<${App} />`, document.getElementById('app'));
