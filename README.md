# Excalidraw in Quip

To publish:

update version_number in manifest.json

Run `qla publish`

Go to dev console https://fb.quip.com/dev/console/app/ESVAjAxsAGC?tab=builds

And select deploy to production

## Next

* Check edit permissions work
* Add link to github repo
* Hide the export and import buttons under an ‘Actions’ menu


## Nice to have, but stuck
* Get the theme from quip settings https://github.com/excalidraw/excalidraw/blob/master/src/packages/excalidraw/README.md#theme. Couldn’t find the preference for that in Quip API
* *Adjustable dimentions — totally stuck. Tried changing the scale, didn’t work. I hope they answer my stack exchange answer https://salesforce.stackexchange.com/questions/343307/resize-option-not-working-with-scale-in-manifest-json

* Export — Didn’t worked either, as a workaround just log to console (https://salesforce.stackexchange.com/q/343891/97340)
    * Maybe try to copy and paste

