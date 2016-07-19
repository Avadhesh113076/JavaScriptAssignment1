const readline = require('readline');
const fs = require('fs');

var header = [];
var jsonData = [];
var tempData = {};
var isHeader = true;

var asianCountry = ["China","India","Indonesia","Pakistan","Bangladesh","Russia","Japan","Philippines","Vietnam","Iran","Turkey","Thailand","Myanmar",
"South Korea","Iraq","Saudi Arabia","Uzbekistan","Malaysia","Nepal","Afghanistan","Yemen","North Korea","Taiwan","Syria","Sri Lanka","Kazakhstan",
"Cambodia","Azerbaijan","United Arab Emirates","Tajikistan","Maldives","Brunei","Bhutan","Timor-Leste","Bahrain","Qatar","Armenia","Mongolia",
"Georgia","Kuwait","Oman","Lebanon","Palestine","Turkmenistan"," Singapore","Kyrgyzstan","Laos","Jordan","Hong Kong","Israel"];

var countryLength = asianCountry.length;

var arr = [];
for( var i=0;i<56;i++)
{
    arr[i]=[];
    for(var j=0;j<4;j++)
    {
        arr[i][j]=0;
    }
}



const rl = readline.createInterface({
    input: fs.createReadStream('Indicators.csv')
});

var h1 = 0,
    queryIdx = 0,
        startValueIdx = 0,
        idx = 0;


rl.on('line', function(line){

    if(h1==0){
    var lineRecords = line.trim().split(',');
    for(var i=0;i<lineRecords.length;i++){
        if(isHeader){
            header[i] = lineRecords[i];
        }
    }
    h1++;
    }
    else{

    var lineRecords = line.trim();
    for(var i=1; i<lineRecords.length; i++) {

        queryIdx = 0,
        startValueIdx = 0,
        idx = 0;

   if (lineRecords.trim() === '') { continue; }

   while (idx < lineRecords.length) {
     /* if we meet a double quote we skip until the next one */
     var c = lineRecords[idx];

     if (c === '"') {
       do { c = lineRecords[++idx]; } while (c !== '"' && idx < lineRecords.length - 1);
     }

     if (c === ',' || /* handle end of line with no comma */ idx === lineRecords.length - 1) {
       /* we've got a value */
       var value = lineRecords.substr(startValueIdx, idx - startValueIdx).trim();

       /* skip first double quote */
       if (value[0] === '"') { value = value.substr(1); }
       /* skip last comma */
       if (value[value.length - 1] === ',') { value = value.substr(0, value.length - 1); }
       /* skip last double quote */
       if (value[value.length - 1] === '"') { value = value.substr(0, value.length - 1); }

       var key = header[queryIdx++];
       tempData[key] = value;
       startValueIdx = idx + 1;
     }

     ++idx;
   }

    }
    }


    if(isHeader == false){


        if(tempData.IndicatorCode == "SP.DYN.LE00.FE.IN"){
            for(var i = 0; i<countryLength; i++){
                if(tempData.CountryName == asianCountry[i]){
                    arr[parseInt(tempData.Year)-1960][0]=tempData.Year;
                    var count = parseFloat(tempData.Value);
                    arr[parseInt(tempData.Year)-1960][1] += count;
                    arr[parseInt(tempData.Year)-1960][3]++;
                }
            }
        }

        if(tempData.IndicatorCode == "SP.DYN.LE00.MA.IN"){
            for(var i = 0; i<countryLength; i++){
                if(tempData.CountryName == asianCountry[i]){
                    arr[parseInt(tempData.Year)-1960][0]=tempData.Year;
                    var count = parseFloat(tempData.Value);
                    arr[parseInt(tempData.Year)-1960][2] += count;
                }
            }
        }
    }


    tempData={};
    isHeader=false;
    //fs.writeFileSync('assignment1.json',JSON.stringify(jsonData), encoding = "utf8");
});


rl.on('close', function(){
    for(var i=0;i<56;i++){

    if(arr[i][0]!=0){
    var obj1 = {};
    obj1.Year = arr[i][0];
    obj1["Life expectancy at birth, female (years)"]=parseFloat(arr[i][1]/arr[i][3]);
    obj1["Life expectancy at birth, male (years)"]=parseFloat(arr[i][2]/arr[i][3]);
    }
    jsonData.push(obj1);
    fs.writeFileSync('jsonData/data1.json',JSON.stringify(jsonData), encoding = "utf8");
}

});
