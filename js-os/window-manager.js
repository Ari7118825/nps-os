import { h, render } from 'https://esm.sh/preact@10.19.2';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.2/hooks';
import htm from 'https://esm.sh/htm';

const html = htm.bind(h);

const Window = ({ win, onClose, onFocus, onMinimize }) => {
    const [isMax, setIsMax] = useState(false);
    const [state, setState] = useState({ x: win.x, y: win.y, w: 450, h: 300 });

    const startAction = (e, type) => {
        if (isMax) return;
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
            <div class="window-body">
                <p>Hello! I am ${win.title}.</p>
            </div>
            
            ${!isMax && html`
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

    useEffect(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    }, []);

    const spawn = () => {
        const id = Date.now();
        const newWin = { 
            id, 
            title: `App ${windows.length + 1}`, 
            icon: 'icon.png', // Ensure this file exists in /images/
            x: 100 + (windows.length * 25), 
            y: 100 + (windows.length * 25), 
            z: z + 1,
            minimized: false 
        };
        setWindows([...windows, newWin]);
        setZ(z + 1);
    };

    const toggleMinimize = (id) => {
        setWindows(windows.map(w => {
            if (w.id === id) {
                const nextMin = !w.minimized;
                // If we are un-minimizing, bring to front
                return { ...w, minimized: nextMin, z: nextMin ? w.z : z + 1 };
            }
            return w;
        }));
        setZ(z + 1);
    };

    return html`
        <div id="desktop">
            <button class="open-btn" onClick=${spawn}>Launch App</button>

            ${windows.map(win => html`
                <${Window} 
                    key=${win.id} 
                    win=${win} 
                    onFocus=${() => { setZ(z+1); win.z = z+1; }} 
                    onMinimize=${() => toggleMinimize(win.id)}
                    onClose=${() => setWindows(windows.filter(w => w.id !== win.id))} 
                />
            `)}

            <div class="taskbar">
                ${windows.map(win => html`
                    <img 
                        src="./images/${win.icon}" 
                        class="taskbar-icon" 
                        title="${win.title}"
                        onClick=${() => toggleMinimize(win.id)} 
                        style="border-bottom: ${win.minimized ? 'none' : '2px solid #3b82f6'}"
                    />
                `)}
            </div>
        </div>
    `;
};

render(html`<${App} />`, document.getElementById('app'));
