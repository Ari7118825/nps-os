import { h } from 'https://esm.sh/preact';
import { useState } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { FS } from '../../js-os/fs.js';

const html = htm.bind(h);

export default function Creator() {
    const [name, setName] = useState('newfile.txt');
    const [content, setContent] = useState('');

    const saveFile = () => {
        FS.write(`/desktop/${name}`, content);
        alert('Saved to Desktop!');
    };

    return html`
        <div class="creator">
            <input value=${name} onInput=${(e) => setName(e.target.value)} />
            <textarea onInput=${(e) => setContent(e.target.value)} placeholder="Type here..."></textarea>
            <button onClick=${saveFile}>Save to Desktop</button>
        </div>
    `;
}
