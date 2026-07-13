// import { remark } from 'remark';
// import html from 'remark-html';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { Properties } from 'hast';
import { toHast, Handler } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';
import { normalizeUri } from 'micromark-util-sanitize-uri';

const link: Handler = (state, node) => {
	const props: Properties = {
		href: normalizeUri(node.url),
		target: '_blank',
		class: 'text-blue-800',
	};
	if (node.title !== null && node.title !== undefined) {
		props.title = node.title;
	}
	return {
		type: 'element',
		tagName: 'a',
		properties: props,
		children: state.all(node),
	};
};

const markdownToHtml = (markdown: string) => {
	markdown = markdown.replace('```markdown', '').replace('```', '');
	const mdast = fromMarkdown(markdown);
	const hast = toHast(mdast, {
		handlers: {
			link,
		},
	});
	if (hast) {
		return toHtml(hast as any);
	}
	return '';
	// const result = await remark()
	// 	.use(html, {
	// 		sanitize: true,
	// 		handlers: {
	// 			a: (h, node, parent) => {
	// 				console.log(h, node, parent);
	// 				return node;
	// 			},
	// 		},
	// 	})
	// 	.process(markdown);
	// return result.toString();
};

export default markdownToHtml;
