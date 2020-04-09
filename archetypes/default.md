---
# Title to be displayed with a short description (max. 110 characters)
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
expirydate: {{ (now.AddDate 0 2 0).Format "2006-01-02" }}
draft: false
sitemap_exclude: true
# Name of the company (with department if you want) (e.g. "Wikimedia Foundation, Technology")
place: ""
# Date when the job will start; leave out if starting is flexible; afterwards the listing will disappear (date format "2020-02-02" YYYY-MM-DD)
start: ""
# Direct link to the job offering (e.g. "https://boards.greenhouse.io/wikimedia/jobs/2083317?gh_src=fd611a951")
link: ""
---