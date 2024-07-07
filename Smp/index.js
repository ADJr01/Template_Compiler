
function templateToObjectCompile(htmlString) {
    function parseTag(tagString) {
        tagString = tagString.trim();
        let i = 1; // skipping the first character or `<`
        while (tagString[i] !== ' ' && tagString[i] !== '>' && i < tagString.length) {
            i++;
        }

        const tagName = tagString.slice(1, i);//parsed tag name

        const attributes = {};
        while (i < tagString.length && tagString[i] !== '>') {
            if (tagString[i] === ' ') {
                i++;
                continue;
            }
            let attrNameStart = i;
            while (tagString[i] !== '=' && tagString[i] !== ' ' && tagString[i] !== '>' && i < tagString.length) {
                i++;
            }
            const attrName = tagString.slice(attrNameStart, i);
            if (tagString[i] === '=') {
                i++; // skip '='
                const quote = tagString[i];
                i++; // skip quote
                let attrValueStart = i;
                while (tagString[i] !== quote && i < tagString.length) {
                    i++;
                }
                const attrValue = tagString.slice(attrValueStart, i);
                attributes[attrName] = attrValue;
                i++; // skip closing quote
            }
        }

        return { tagName, attributes };
    }

    function parseHTMLString(htmlString) {
        const result = [];
        let i = 0;
        const stack = [];
        while (i < htmlString.length) {
            if (htmlString[i] === '<') {
                // Handle tags
                let tagStart = i;
                while (htmlString[i] !== '>' && i < htmlString.length) {
                    i++;
                }
                let tagEnd = i;
                let tagString = htmlString.slice(tagStart, tagEnd + 1);
                if (tagString[1] === '/') {
                    // Closing tag
                    let tagName = tagString.slice(2, -1);
                    if (stack.length > 0 && stack[stack.length - 1].tag === tagName) {
                        const completedElement = stack.pop();
                        if (stack.length === 0) {
                            result.push(completedElement);
                        }
                    }
                } else {
                    // Opening tag
                    const { tagName, attributes } = parseTag(tagString);
                    const element = {
                        tag: tagName,
                        attributes: attributes,
                        children: []
                    };
                    if (stack.length > 0) {
                        stack[stack.length - 1].children.push(element);
                    }
                    stack.push(element);
                }
                i++; // Move past '>'
            } else {
                // Handle text content
                let textStart = i;
                while (htmlString[i] !== '<' && i < htmlString.length) {
                    i++;
                }
                let textContent = htmlString.slice(textStart, i).trim();
                if (textContent && stack.length > 0) {
                    stack[stack.length - 1].children.push(textContent);
                }
            }
        }
        return result;
    }

    return parseHTMLString(htmlString);
}


const template = `<div id="str">
    <div id="banner">
    <h1>Hella, World</h1>
    </div>
    <ul>
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
        <li>item 4</li>
        <li>item 5</li>
    </ul>
</div>`
const templateObject = templateToObjectCompile(template);
console.log(templateObject)