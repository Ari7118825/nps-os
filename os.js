class WindowManager {
    constructor() {
        this.highestZ = 10;
        this.desktop = document.getElementById('desktop');
        this.addBtn = document.getElementById('add-window');
        
        this.addBtn.onclick = () => this.createWindow("New Window", "This is a window");
    }

    createWindow(title, content) {
        const win = document.createElement('div');
        win.className = 'window';
        win.style.zIndex = ++this.highestZ;
        
        // Initial Position
        win.style.top = '100px';
        win.style.left = '100px';

        win.innerHTML = `
            <div class="title-bar">
                <span class="title">${title}</span>
                <div class="controls">
                    <button class="min">_</button>
                    <button class="max">□</button>
                    <button class="close">×</button>
                </div>
            </div>
            <div class="window-body">${content}</div>
            <div class="resizer"></div>
        `;

        this.desktop.appendChild(win);
        this.makeDraggable(win);
        this.makeResizable(win);
        
        // Layering focus
        win.onmousedown = () => win.style.zIndex = ++this.highestZ;

        // Controls
        win.querySelector('.close').onclick = () => win.remove();
        win.querySelector('.max').onclick = () => win.classList.toggle('maximized');
    }

    makeDraggable(win) {
        const titleBar = win.querySelector('.title-bar');
        let offsetX, offsetY, isDragging = false;

        titleBar.onmousedown = (e) => {
            isDragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
        };

        window.onmousemove = (e) => {
            if (!isDragging) return;
            win.style.left = (e.clientX - offsetX) + 'px';
            win.style.top = (e.clientY - offsetY) + 'px';
        };

        window.onmouseup = () => isDragging = false;
    }

    makeResizable(win) {
        const resizer = win.querySelector('.resizer');
        resizer.onmousedown = (e) => {
            e.preventDefault();
            const startWidth = win.offsetWidth;
            const startHeight = win.offsetHeight;
            const startX = e.clientX;
            const startY = e.clientY;

            const doResize = (moveE) => {
                win.style.width = startWidth + (moveE.clientX - startX) + 'px';
                win.style.height = startHeight + (moveE.clientY - startY) + 'px';
            };

            const stopResize = () => {
                window.removeEventListener('mousemove', doResize);
                window.removeEventListener('mouseup', stopResize);
            };

            window.addEventListener('mousemove', doResize);
            window.addEventListener('mouseup', stopResize);
        };
    }
}

new WindowManager();
