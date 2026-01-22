import { h, render } from 'https://esm.sh/preact';
import { useState, useEffect, useRef } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';

const html = htm.bind(h);

const Window = ({ id, title, content, onClose, zIndex, onFocus }) => {
    const [pos, setPos] = useState({ x: 100 + (id * 20), y: 100 + (id * 20) });
    const [size, setSize] = useState({ w: 400, h: 300 });
    const winRef = useRef(null);

    // dragging logic
    const handleDrag = (e) => {
        onFocus();
        const startX = e.clientX - pos.x;
        const startY = e.clientY - pos.y;
        
        const move = (me) => {
            setPos({ x: me.clientX - startX, y: me.clientY - startY });
        };
        const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
    };

    // simplified resize logic for the right edge
    const handleResize = (e, direction) => {
        e.stopPropagation();
        const startW = size.w;
        const startX = e.clientX;

        const move = (me) => {
            if(direction === 'r') setSize(s => ({ ...s, w: startW + (me.clientX - startX) }));
        };
        const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
    };

    return html`
        <div class="window" style="left: ${pos.x}px; top: ${pos.y}px; width: ${size.w}px; height: ${size.h}px; z-index: ${zIndex}" onMouseDown=${onFocus}>
            <div class="title-bar" onMouseDown=${handleDrag}>
                <span>${title}</span>
                <div class="controls">
                    <button onClick=${onClose} class="close">×</button>
                </div>
            </div>
            <div class="window-body">${content}</div>
            <div class="resizer r" onMouseDown=${(e) => handleResize(e, 'r')}></div>
            <div class="resizer b" onMouseDown=${(e) => handleResize(e, 'b')}></div>
            <div class="resizer rb" onMouseDown=${(e) => handleResize(e, 'rb')}></div>
        </div>
    `;
};

const OS = () => {
    const [windows, setWindows] = useState([]);
    const [topZ, setTopZ] = useState(100);

    const addWindow = () => {
        const id = Date.now();
        setWindows([...windows, { id, title: `Window ${windows.length + 1}`, z: topZ }]);
        setTopZ(topZ + 1);
    };

    const focusWindow = (id) => {
        setTopZ(topZ + 1);
        setWindows(windows.map(w => w.id === id ? { ...w, z: topZ + 1 } : w));
    };

    return html`
        <div id="desktop">
            <button onclick=${addWindow} style="margin: 20px; position: relative; z-index: 9999;">New Window</button>
            ${windows.map(win => html`
                <${Window} 
                    key=${win.id} 
                    id=${win.id} 
                    title=${win.title} 
                    zIndex=${win.z}
                    onFocus=${() => focusWindow(win.id)}
                    onClose=${() => setWindows(windows.filter(w => w.id !== win.id))}
                    content="This is a window body message." 
                />
            `)}
        </div>
    `;
};

render(html`<${OS} />`, document.body);
