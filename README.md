##  Festivus webpart
This is a super fun `SPFx application customizer` perfect for the festive season!
Did you want to make your logo look different for a festival so the users can relate more with your intranet.
Look no further, have a play around this application customizer to decorate your SharePoint site logo with what you choose and where you choose!

### How it works
This SPFX application customizer targets the logo element and places the image of you choice in the DIRECTION of your choice
The datasource is a list `Festivus` with below columns:

* FestiveImage - Picture field
* Direction - Choice
  { `top-right`,`top-left`,`bottom-right`,`bottom-left`}
* Active - Yes/No 



### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
