import { html } from '../../js-os/window-manager.js';

export function init() {
    const content = html`
        <div style="padding: 20px; font-family: sans-serif;">
            <h3>File Explorer</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="border: 1px solid #ddd; padding: 10px;">📁 Documents</div>
                <div style="border: 1px solid #ddd; padding: 10px;">📁 Downloads</div>
                <div style="border: 1px solid #ddd; padding: 10px;">📁 Desktop</div>
            </div>
        </div>
    `;

    window.wm.open("File Browser", "apps/file_browser/icon.png", content);
}
