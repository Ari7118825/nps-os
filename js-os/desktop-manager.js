import { h } from 'https://esm.sh/preact';
import { useState } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import WindowManager from './window-manager.js';

const html = htm.bind(h);

export default function DesktopManager() {
    const [windows, setWindows] = useState([]);

    const launchApp = (appId) => {
        if (!windows.find(w => w.id === appId)) {
            setWindows([...windows, { id: appId, title: appId.replace('_', ' ').toUpperCase() }]);
        }
    };

    const closeWindow = (id) => setWindows(windows.filter(w => w.id !== id));

    return html`
        <div class="desktop">
            <div class="icons">
                <div class="icon" onClick=${() => launchApp('file_browser')}>📁 File Browser</div>
                <div class="icon" onClick=${() => launchApp('console')}>💻 Console</div>
            </div>
            
            ${windows.map(win => html`
                <${WindowManager} 
                    key=${win.id} 
                    title=${win.title} 
                    onClose=${() => closeWindow(win.id)}
                >
                    <p>Welcome to ${win.title}</p>
                <//>
            `)}

            <div class="taskbar">
                <button>Start</button>
            </div>
        </div>
    `;
}
