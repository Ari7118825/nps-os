import { h } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';
const html = htm.bind(h);

export default function FileBrowser() {
    const folders = ['home', 'downloads', 'documents', 'desktop'];
    
    return html`
        <div class="file-browser">
            <div class="sidebar">
                ${folders.map(f => html`<div class="nav-item">📁 ${f}</div>`)}
            </div>
            <div class="main-view">
                <div class="file-icon">📄 readme.txt</div>
            </div>
        </div>
    `;
}
