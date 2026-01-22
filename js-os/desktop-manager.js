import { h, render } from 'https://esm.sh/preact@10.19.2';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.2/hooks';
import { Window, html } from './window-manager.js';

const Desktop = () => {
    const [windows, setWindows] = useState([]);
    const [z, setZ] = useState(100);
    const [bg] = useState(['#2c3e50', '#2d3436', '#0f0c29', '#1e272e'][Math.floor(Math.random()*4)]);

    // Define the global API so .app files can call it
    useEffect(() => {
        window.wm = {
            open: (title, icon, content) => {
                const id = Date.now();
                setWindows(prev => [...prev, { id, title, icon, content, z: z + 1, minimized: false }]);
                setZ(z + 1);
            }
        };
    }, [z]);

    const launch = async (path) => {
        // App files are ES Modules
        const app = await import(`../filetree/${path}`);
        app.init();
    };

    return html`
        <div id="desktop" style="background: ${bg}">
            <div class="desktop-icons">
                <div class="icon" onDblClick=${() => launch('root/apps/file_browser.app')}>
                    <img src="./images/apps/file_browser/icon.png" />
                    <span>File Browser</span>
                </div>
            </div>

            ${windows.map(win => html`
                <${Window} key=${win.id} win=${win}
                    onFocus=${() => { setZ(z+1); win.z = z+1; }}
                    onMinimize=${() => setWindows(windows.map(w => w.id === win.id ? {...w, minimized: true} : w))}
                    onClose=${() => setWindows(windows.filter(w=>w.id !== win.id))} />
            `)}

            <div class="taskbar">
                ${windows.map(win => html`
                    <div class="t-item ${!win.minimized ? 'active' : ''}" onClick=${() => {
                        setWindows(windows.map(w => w.id === win.id ? {...w, minimized: false, z: z+1} : w));
                        setZ(z+1);
                    }}>
                        <img src="./images/${win.icon}" />
                    </div>
                `)}
            </div>
        </div>
    `;
};

render(html`<${Desktop} />`, document.getElementById('app'));
