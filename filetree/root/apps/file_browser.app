export function init(wm) {
    const content = html`
        <div class="file-explorer">
            <div class="sidebar">
                <div>Favorites</div>
                <div style="padding-left:10px; font-size: 0.8em; opacity: 0.7;">Desktop</div>
                <div style="padding-left:10px; font-size: 0.8em; opacity: 0.7;">Documents</div>
            </div>
            <div class="main-view">
                <p>Browsing: /root/home/</p>
                <div class="file-list">
                    <span>Folder: Downloads</span>
                    <span>Folder: Documents</span>
                </div>
            </div>
        </div>
    `;

    wm.open("File Browser", "apps/file_browser/icon.png", content);
}

// To allow the app to use the same html template engine
import htm from 'https://esm.sh/htm';
import { h } from 'https://esm.sh/preact@10.19.2';
const html = htm.bind(h);
