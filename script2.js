const readline = require('readline');
const fs = require('fs');
var header=[];
var LifeExpectancyAtBirthTotal=[];
var Country=[];
var jsonData=[];
var tempData={};

const rl = readline.createInterface({
   input: fs.createReadStream('Indicators.csv')
});

rl.on('line',function(line)
{
   var lineRecords=line.trim().split(',');

   if(lineRecords[2]+","+lineRecords[3]=='"Life expectancy at birth, total (years)"' )
       {
       var flag=0;
       var j=0;
       for(;j<Country.length;j++)
       {

           if(lineRecords[0]==Country[j])
           {
               flag=1;
               LifeExpectancyAtBirthTotal[j]=LifeExpectancyAtBirthTotal[j]+parseFloat(lineRecords[6],10);
           }

           if(flag==1)
           {
               break;
           }

       }

       if (flag==0)
       {
           Country[j] = lineRecords[0].toString();
           LifeExpectancyAtBirthTotal[j] = parseFloat(lineRecords[6],10);

       }

   }

});





rl.on('close',function()
{
   for(var l=0;l<LifeExpectancyAtBirthTotal.length;l++)
   {
       for(var m=l;m<LifeExpectancyAtBirthTotal.length-1;m++)
       {
           if (LifeExpectancyAtBirthTotal[l]<LifeExpectancyAtBirthTotal[m+1])
           {

               var temp1 = LifeExpectancyAtBirthTotal[l]
               LifeExpectancyAtBirthTotal[l]=LifeExpectancyAtBirthTotal[m+1];
               LifeExpectancyAtBirthTotal[m+1]=temp1;

               var temp2 = Country[l];
               Country[l]=Country[m+1];
               Country[m+1]=temp2;

           }
       }

   }

   for (var n = 0; n < 5; n++)
   {

       tempData={};
       tempData["Country"]=Country[n].toString();
       tempData["Life expectancy at birth, total (years)"]=LifeExpectancyAtBirthTotal[n].toString();

       jsonData.push(tempData);

   }

   fs.writeFileSync("data3.json",JSON.stringify(jsonData),encoding="utf8");

});
