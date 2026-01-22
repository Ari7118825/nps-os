import { h, render } from 'https://esm.sh/preact';
import { useState, useCallback } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';

const html = htm.bind(h);

const Window = ({ win, onClose, onFocus }) => {
    const [state, setState] = useState({
        x: win.x, y: win.y, w: 400, h: 250
    });

    // Unified handler for dragging and resizing
    const startAction = (e, type) => {
        e.preventDefault();
        onFocus(); // Bring to front

        const startX = e.clientX;
        const startY = e.clientY;
        const startW = state.w;
        const startH = state.h;
        const startPosX = state.x;
        const startPosY = state.y;

        const onMouseMove = (moveE) => {
            const dx = moveE.clientX - startX;
            const dy = moveE.clientY - startY;

            if (type === 'drag') {
                setState(prev => ({ ...prev, x: startPosX + dx, y: startPosY + dy }));
            } else if (type === 'r') {
                setState(prev => ({ ...prev, w: startW + dx }));
            } else if (type === 'l') {
                setState(prev => ({ ...prev, x: startPosX + dx, w: startW - dx }));
            } else if (type === 'b') {
                setState(prev => ({ ...prev, h: startH + dy }));
            } else if (type === 't') {
                setState(prev => ({ ...prev, y: startPosY + dy, h: startH - dy }));
            } else if (type === 'corner') {
                setState(prev => ({ ...prev, w: startW + dx, h: startH + dy }));
            }
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    return html`
        <div class="window" style="left: ${state.x}px; top: ${state.y}px; width: ${state.w}px; height: ${state.h}px; z-index: ${win.z}">
            <div class="title-bar" onMouseDown=${(e) => startAction(e, 'drag')}>
                <span>${win.title}</span>
                <div class="controls">
                    <button class="min"></button>
                    <button class="max"></button>
                    <button class="close" onClick=${onClose}></button>
                </div>
            </div>
            <div class="window-body">
                <p>This is a window.</p>
            </div>
            
            <div class="resizer t" onMouseDown=${(e) => startAction(e, 't')}></div>
            <div class="resizer b" onMouseDown=${(e) => startAction(e, 'b')}></div>
            <div class="resizer l" onMouseDown=${(e) => startAction(e, 'l')}></div>
            <div class="resizer r" onMouseDown=${(e) => startAction(e, 'r')}></div>
            <div class="resizer corner" onMouseDown=${(e) => startAction(e, 'corner')}></div>
        </div>
    `;
};

const App = () => {
    const [windows, setWindows] = useState([]);
    const [zIndexCounter, setZIndex] = useState(100);

    const spawnWindow = () => {
        const id = Date.now();
        const newWin = {
            id,
            title: `Window ${windows.length + 1}`,
            x: 100 + (windows.length * 30),
            y: 100 + (windows.length * 30),
            z: zIndexCounter
        };
        setWindows([...windows, newWin]);
        setZIndex(zIndexCounter + 1);
    };

    const focusWindow = (id) => {
        setZIndex(zIndexCounter + 1);
        setWindows(windows.map(w => w.id === id ? { ...w, z: zIndexCounter + 1 } : w));
    };

    return html`
        <div id="desktop">
            <button class="open-btn" onClick=${spawnWindow}>+ New Window</button>
            ${windows.map(win => html`
                <${Window} 
                    key=${win.id} 
                    win=${win} 
                    onFocus=${() => focusWindow(win.id)}
                    onClose=${() => setWindows(windows.filter(w => w.id !== win.id))} 
                />
            `)}
        </div>
    `;
};

render(html`<${App} />`, document.body);
