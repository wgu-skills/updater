import slugify from 'slugify';

const createSlug = (name) => slugify(name, { lower: true, strict: true, trim: true });

const toCamelCase = (fileName) => {
    if (typeof fileName !== 'string') {
        console.error('toCamelCase error: Input is not a string', fileName);
        return '';
    }

    return fileName.replace(/[^a-zA-Z0-9]/g, '').replace(/-(.)/g, (_, char) => char.toUpperCase());
};

const fixDuplicateSlugs = (toc) => {
    const slugs = new Map();
    const fixedToc = toc.split('\n').map((line) => {
        const slug = line.match(/\(#(.*)\)/);
        if (slug) {
            const [_, slugName] = slug;
            const count = slugs.get(slugName) || 0;
            slugs.set(slugName, count + 1);
            return line.replace(slugName, `${slugName}-${count + 1}`);
        }
        return line;
    });
    return fixedToc.join('\n');
};

export { createSlug, toCamelCase, fixDuplicateSlugs };
