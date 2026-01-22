import { h, render } from 'https://esm.sh/preact@10.19.2';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.2/hooks';
import htm from 'https://esm.sh/htm';
import { Window, html } from './window-manager.js';

const App = () => {
    const [windows, setWindows] = useState([]);
    const [shortcuts, setShortcuts] = useState([]);
    const [z, setZ] = useState(100);
    const [bgColor, setBgColor] = useState('#000');

    useEffect(() => {
        // Random Background
        const colors = ['#1e3a8a', '#1e1b4b', '#312e81', '#1e293b', '#064e3b'];
        setBgColor(colors[Math.floor(Math.random() * colors.length)]);

        // Load desktop shortcuts from "filesystem" (our filetree folder)
        const desktopPath = './filetree/root/home/desktop/';
        const items = ['file_browser.short', 'create.short'];
        
        Promise.all(items.map(item => fetch(desktopPath + item).then(r => r.json())))
            .then(setShortcuts);

        // Link Window Manager Global
        window.wm.open = (title, icon, content) => {
            const id = Date.now();
            setWindows(prev => [...prev, { id, title, icon, content, z: z + 1, minimized: false }]);
            setZ(z + 1);
        };
    }, []);

    const launchShortcut = async (s) => {
        const module = await import(`../filetree/${s.exec}`);
        module.init(window.wm);
    };

    return html`
        <div id="desktop" style="background: ${bgColor}">
            <div class="shortcut-grid">
                ${shortcuts.map(s => html`
                    <div class="shortcut" onDblClick=${() => launchShortcut(s)}>
                        <img src="./images/${s.icon}" />
                        <span>${s.name}</span>
                    </div>
                `)) }
            </div>

            ${windows.map(win => html`
                <${Window} key=${win.id} win=${win} 
                    onFocus=${() => { setZ(z+1); win.z = z+1; }} 
                    onMinimize=${() => setWindows(windows.map(w => w.id === win.id ? {...w, minimized: !w.minimized} : w))}
                    onClose=${() => setWindows(windows.filter(w => w.id !== win.id))} />
            `)}

            <div class="taskbar">
                ${windows.map(win => html`
                    <img src="./images/${win.icon}" class="taskbar-icon" 
                         style="border-bottom: ${win.minimized ? 'none' : '2px solid white'}"
                         onClick=${() => setWindows(windows.map(w => w.id === win.id ? {...w, minimized: false, z: z+1} : w))} />
                `)}
            </div>
        </div>
    `;
};

render(html`<${App} />`, document.getElementById('app'));
