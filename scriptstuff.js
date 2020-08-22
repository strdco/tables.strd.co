var useHeaders = true;
var batchCount=100;




window.onload = function letsgo() {

    backbutton.onclick = function getBack() {
        inputarea.style.display="inline";
        outputarea.style.display="none";

        inputtoolbar.style.display="inline";
        outputtoolbar.style.display="none";
    }


    outputarea.onclick=function(e) {
        outputarea.select();
    };


    // Interpret the table source
    gobutton.onclick = function parseSource() {

        inputarea.style.display="none";
        outputarea.style.display="inline";

        inputtoolbar.style.display="none";
        outputtoolbar.style.display="inline";

        useHeaders = headers.checked;

        var txt = "";
        var columns="";
        var j = JSON.parse('[[\"'+inputarea.value.replace(/\'/g, "\'\'").replace(/\t/g, '\", \"').replace(/\n/g, '\"],[\"')+'\"]]');

        // Remove leading blank rows
        while (j[0].join(",")=="") {
            console.log('Removed leading blank row.');
            var x = j.splice(0, 1);
        }

        // Put the first row in a "headers" string:
        if (useHeaders) {
            columns = "\["+j.splice(0, 1)[0].join("\], \[")+"\]";
        }
        
        // Loop over every row:
        for(var i=0; i<j.length; i++) {

            // Ignore empty rows:
            if (j[i].join(",")!="") {

                // Begin a new batch
                if (i%batchCount == 0) {
                    if (i>0) {txt+=";\n"; }
                    txt+="\nINSERT INTO "+(tablename.value == "" ? "[table]" : tablename.value);
                    if (useHeaders) { txt+=" ("+columns+")"}
                    txt+="\nVALUES ";
                }
                // ... or continue on an existing one:
                else {
                    txt+=",\n";
                    if (pretty.checked) { txt+="       "; }
                }

                // The data row:
                txt+="(\'"+j[i].join("\', \'")+"\')";
            }
        }
        txt+=";";

        // Replace 'NULL' with NULL:
        if (fixnulls.checked) {
            // txt=txt.replace(/(?<=\(| )'NULL'(?=,|\))/g, "NULL");
            txt=txt.replace(/\('NULL'(?=,|\))/g, "(NULL");
            txt=txt.replace(/\ 'NULL'(?=,|\))/g, " NULL");
        }

        outputarea.value=txt;

    };
}
