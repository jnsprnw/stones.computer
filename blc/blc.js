const core = require('@actions/core');
const { SiteChecker } = require('broken-link-checker');

const brokenLinks = [];
let currentPage = '';
let countBroken = 0;
let countLinks = 0;
const URL = 'https://jonasparnow.com';

const siteChecker = new SiteChecker({
	excludedKeywords: ['//res.cloudinary.com/', '//linkedin.com/']
}, {
	error: (error) => {
  	console.log('error', { error })
  },
  link: (result) => {
  	countLinks += 1;
  	if (result.broken) {
  		if (currentPage !== result.base.original) {
  			currentPage = result.base.original;
  			brokenLinks.push(`### [${result.base.resolved}](${result.base.resolved})`);
  		}
  		brokenLinks.push(`- [ ] [${result.url.resolved}](${result.url.resolved}) (${result.brokenReason})`);
  		countBroken += 1;
  	}
  },
  end: () => {
  	const status = `${countBroken} of ${countLinks} links are broken.`;
  	core.info(status);
  	brokenLinks.unshift(status);
  	brokenLinks.unshift(`## Status report for ${URL}`);
  	core.setOutput('content', brokenLinks.join('\n'));
  	core.setOutput('countBroken', countBroken);
  }
})

siteChecker.enqueue(URL);
