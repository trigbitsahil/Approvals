// import { convert } from 'html-to-text';

import markdownToHtml from './markdownToHTML';

const htmltoText = (html: string) => {
	let text = html;
	text = text.replace(/\n/gi, '');
	text = text.replace(/<style([\s\S]*?)<\/style>/gi, '');
	text = text.replace(/<script([\s\S]*?)<\/script>/gi, '');
	text = text.replace(/<a.*?href="(.*?)[\\?\\"].*?>(.*?)<\/a.*?>/gi, ' $2 $1 ');
	text = text.replace(/<\/div>/gi, '\n\n');
	text = text.replace(/<\/li>/gi, '\n');
	text = text.replace(/<li.*?>/gi, '  *  ');
	text = text.replace(/<\/ul>/gi, '\n\n');
	text = text.replace(/<\/p>/gi, '\n\n');
	text = text.replace(/<br\s*[\/]?>/gi, '\n');
	text = text.replace(/<[^>]+>/gi, '');
	text = text.replace(/^\s*/gim, '');
	text = text.replace(/ ,/gi, ',');
	text = text.replace(/ +/gi, ' ');
	text = text.replace(/\n+/gi, '\n\n');
	return text.trim();
};

const markdownToText = (markdown: string) => {
	const html = markdownToHtml(markdown);
	return htmltoText(html || '');
	// return convert(html, {
	// 	wordwrap: 130,
	// });
};

export default markdownToText;
