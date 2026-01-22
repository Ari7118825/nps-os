export const FS = {
    write: (path, data) => {
        localStorage.setItem(`os_fs_${path}`, JSON.stringify(data));
    },
    read: (path) => {
        return JSON.parse(localStorage.getItem(`os_fs_${path}`));
    },
    list: (dir) => {
        const prefix = `os_fs_${dir}`;
        return Object.keys(localStorage)
            .filter(key => key.startsWith(prefix))
            .map(key => key.replace(prefix, ''));
    }
};
