$(document).ready(function(){



});


async function submitData(){

    var meterNumber = document.getElementById('meterNumberTbx').value;

    var response  = await fetchDataFromElhub(meterNumber);

    renderElhubResponse(response);

}


function renderElhubResponse(response){

    if(response.status!=200)
        document.getElementById('extElhubMsg').textContent = response.message
     else{

        var tableHTML = '<table class="table" style="font-size: 12px;"> ';
        tableHTML += '<tr> <td>Målepunktid</td><td>Adresse</td> <td>Målernummer</td></tr>';

        tableHTML+'<tr>';
        tableHTML+='<td>'+response.data.accountingPoint+'</td>';
        tableHTML+='<td>'+response.data.address+'</td>';
        tableHTML+='<td>'+response.data.meterNumber+'</td>';

        tableHTML+='</tr>';
        tableHTML+='</table>';
        
        
        document.getElementById('resultContent').innerHTML = tableHTML;
     }   


}

window.addEventListener('load',async()=>{

    document.getElementById('testElhub').addEventListener('click',submitData)
})


async function makeFetchRequest(env,token,meterNumber){

    return new Promise(async (resolve, reject) => {

        var payload = {
            "Header": {
              "EventID": this.uuidv4()
            },
            "Payload": {
              "MeteringPoint": {
                "Identification": meterNumber
              }
            }
          };

          var BASE_URL = env.BASE_URL;
          
          var url = BASE_URL+"/mwe/QueryAccountingPointCharacteristics"
          
            
          var resp = await fetch(url,{
            "method": "POST",
            
            "headers": {
              'Authorization':'Bearer '+token,
              "Content-Type": "application/json"
            },
            "body":JSON.stringify(payload)

          }).catch(e=>{
            resolve({status:500,message:'Query Accounting Point Request Failed'})
          })

          var result = await resp.text();
          resolve({status:200,response:result})

        
          
     //   $.ajax(settings);

    });

}

  
    
async function getToken(env){

    return new Promise(async (resolve, reject) => {

      var  CLIENT_ID =    env.CLIENT_ID
      var  CLIENT_SECRET =  env.CLIENT_SECRET
       var LOGIN_ENDPOINT = env.LOGIN_ENDPOINT
       var SCOPE_URL =     env.SCOPE_URL
       
      var reqbody = "grant_type=client_credentials&client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&audience=124&scope="+SCOPE_URL
     

        var settings = {
            "url": LOGIN_ENDPOINT,
            "method": "POST",
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data":reqbody,
            success:function(response){
                console.log(response);
                resolve(response)
            },
            error:function(exception){
                console.log(exception);
            }
        };
          
        $.ajax(settings);
        
    });

}

async function fetchDataFromElhub(data){

    return new Promise(async (resolve, reject) => {

     var env ={
        thales:{
            CLIENT_ID:'2a38a678-7a96-4444-8b76-c99f19e78c70',
            CLIENT_SECRET:'0ISqy/6Y6Xj0yqBjpyuZuVG@oZCu/y-z',
            LOGIN_ENDPOINT:'https://login.microsoftonline.com/73fbcf56-ad0e-441c-b431-2a36dc8918d7/oauth2/v2.0/token',
            SCOPE_URL:'api://dbcf1fa9-bb96-4fd8-9193-558d95e77409/.default',
            BASE_URL:'https://api-dev.utilitycloud.app/v1',
    
        },
    
        hks:{
            CLIENT_ID:'d496f3a5-63d8-41c0-ad8a-8fe102c3d127',
            CLIENT_SECRET:'A9:@5mJ6.qYz:NxCmkL5.L50]1B7=M-B',
            LOGIN_ENDPOINT:'https://login.microsoftonline.com/73fbcf56-ad0e-441c-b431-2a36dc8918d7/oauth2/v2.0/token',
            SCOPE_URL:'http://api-stag.utilitycloud.app/.default',
            BASE_URL:'https://api-stag.utilitycloud.app/v1',
           
        },
        pythagoras:{
          CLIENT_ID:'ade8d952-8d4a-4c1e-98a6-bf720156070d',
          CLIENT_SECRET:'WylK/U?O6aDb:i22F:w6TMaDwoae/Y@g',
          LOGIN_ENDPOINT:'https://login.microsoftonline.com/73fbcf56-ad0e-441c-b431-2a36dc8918d7/oauth2/v2.0/token',
          SCOPE_URL:'api://dbcf1fa9-bb96-4fd8-9193-558d95e77409/.default',
          BASE_URL:'https://api-dev.utilitycloud.app/v1'
        
        },
      ahl:{
          CLIENT_ID:'b1609cfb-752c-40a3-ad74-a5fd9d01000f',
          CLIENT_SECRET:'wdrJqaDLjmXA/Q2bv]:k-quJHAKDF878',
          LOGIN_ENDPOINT:'https://login.microsoftonline.com/73fbcf56-ad0e-441c-b431-2a36dc8918d7/oauth2/v2.0/token',
          SCOPE_URL:'http://api-stag.utilitycloud.app/.default',
          BASE_URL:'https://api-stag.utilitycloud.app/v1'
      }
     }   

    // var selectedEnv = data.url.split('.')[0];

    //  if(selectedEnv.indexOf('thales')>-1){
    //     selectedEnv = env["thales"]
    //  }else if(selectedEnv.indexOf('hks')>-1){
    //   selectedEnv = env["hks"]
    // }else if(selectedEnv.indexOf('ahl')>-1){
    //   selectedEnv = env["ahl"]
    // }else if(selectedEnv.indexOf('pytagoras')>-1){
    //   selectedEnv = env["pythagoras"]
    // }
        
   var selectedEnv = env["hks"];

        try {
        
          var tokenRes = await getToken(selectedEnv);
        var elhubResponse = await makeFetchRequest(selectedEnv,tokenRes.access_token,data.meterNumber)

        if(elhubResponse.status==200){
            let xmlstr = elhubResponse.response;

            //resolve(xmlstr);
            const parser = new DOMParser();
            const srcDOM = parser.parseFromString(xmlstr, "application/xml");
    
            var responseData = this.xml2json(srcDOM);
    
            console.log(responseData);
    
            var responsePayload = responseData.RequestUpfrontMeteringPointCharacteristicsResponse.ResponseUpfrontMeteringPointCharacteristics.PayloadMasterDataMPEvent
            var accountingPoint = responsePayload.MeteringPointUsedDomainLocation.Identification;

            var streetName = responsePayload.MPAddressMeteringPointAddress.StreetName;
            var buildingNumber = responsePayload.MPAddressMeteringPointAddress.BuildingNumber==undefined?'':responsePayload.MPAddressMeteringPointAddress.BuildingNumber;
            var postCode = responsePayload.MPAddressMeteringPointAddress.Postcode;
            var cityName = responsePayload.MPAddressMeteringPointAddress.CityName;
            var address = streetName + " #  " + buildingNumber + ' ' + postCode + ' ' + cityName;
            var meterNumber = responsePayload.MeteringInstallationMeterFacility==undefined?'':responsePayload.MeteringInstallationMeterFacility.MeterIdentification;


            resolve({data:{accountingPoint,address,meterNumber},status:200});
        }else{

            resolve({data:elhubResponse});

        }

        } catch (error) {
          resolve({message:'Unable to retrieve data',status:404});
        }
        
        
        

        
    });

}


