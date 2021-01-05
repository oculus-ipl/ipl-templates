

// array to categorize the player
    var playerCategory={
      "BAT":[],
      "BOWL":[],
      "All":[],
      "WK":[],
      "FORN":[],
      "RET":[]
    }


    var players=[];
    let playerCount=0;
    let scoreTag=document.getElementById('scoreTag');
    let playerCountDiv=document.getElementById('playerCountDiv');

// adding the names of the rendered players
    playerList.forEach(function(playerInfo){
      console.log(playerInfo)
      players.push(playerInfo.name);
    })
  console.log(players)

// search Bar
  var commonTagHelper = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: players
  });

  //Initializing the typeahead
  $('#searchBar').typeahead({
    hint: true,
    highlight: true, /* Enable substring highlighting */
    minLength: 0 /* Specify minimum characters required for showing suggestions */
  },
  {
      name: 'common',
      source: commonTagHelper
  });

  //show usergenerated array

  function snackbarFunction(condition) {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");
  if(condition=="You cannot add a player in more than two category in each section"){
    x = document.getElementById("snackbar2");
  }
  x.innerHTML=condition;
  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}



  var selectedPlayers=[];

// function to add the selected players and update the required changes

var checkName=function(){
    console.log(document.getElementById("searchBar").value);
    let newPlayer=document.getElementById("searchBar").value;
    if(selectedPlayers.length==11){
      snackbarFunction("Remove a Player");
      document.getElementById("searchBar").value="";
    }else if(!players.includes(newPlayer)){
      snackbarFunction("Invalid Player");
      document.getElementById("searchBar").value="";
    } else if(selectedPlayers.includes(newPlayer)){ 
      snackbarFunction("Already Selected");
      document.getElementById("searchBar").value="";
    }else{
      selectedPlayers.push(newPlayer);
      console.log(selectedPlayers);

      let selectedPlayerInfo={}

      //adding the selected player into the category array 
      playerList.forEach(function(playerInfo){
        if(playerInfo.name==newPlayer){
          selectedPlayerInfo=playerInfo;
          if(playerInfo.type=="BAT" &&playerInfo.is_wk){
            playerCategory["WK"].push(newPlayer);
          } else if(playerInfo.type=="BAT" && !playerInfo.is_wk){
            playerCategory["BAT"].push(newPlayer);
          } else {
            playerCategory[playerInfo.type].push(newPlayer);
          } 
          if(playerInfo.is_retro){
            playerCategory["RET"].push(newPlayer)
          }
          if(playerInfo.is_foriegn){
            playerCategory["FORN"].push(newPlayer)
          }
        }
      })
      console.log(selectedPlayerInfo,playerCategory);


      // Dynamically adding the players to display in HTML
      let starFielder="";
      let wk="";
      if(selectedPlayerInfo.is_starred){
        starFielder="Star Fielder";
      }
      if(selectedPlayerInfo.is_wk){
        wk="(WK)";
      }


      let playerDiv=document.getElementById("playerDiv");
      playerDiv.innerHTML+='<div class="col" style="transition: all 0.5s ease-in">'+
      '<div class="wrapper">'+
    
    '<div class="fut-player-card" style="background-image:linear-gradient('+selectedPlayerInfo.Color+',black);">'+
    
      '<div class="player-card-top">'+
        '<div class="player-master-info"><div class="test" align="left">'+
          '<div class="player-rating"><span>'+selectedPlayerInfo.overall+'</span></div>'+
          '<div class="player-position"><span>'+selectedPlayerInfo.type+'</span></div>'+
          '<div class="player-nation"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1280px-Flag_of_India.svg.png" alt="Argentina" draggable="false"/></div>'+
          '<div class="player-club"><img src="https://seeklogo.com/images/R/royal-challengers-bengaluru-logo-A54D45DE4A-seeklogo.com.png" alt="Barcelona" draggable="false"/></div>'+
        '</div></div>'+
      '<div class="player-picture"><img src="./virat.png" alt="Virat" draggable="false"/>'+
          '<div class="player-extra"><span>'+starFielder+'</span></div>'+
        '</div>'+
        '<div  style="width:30px;height:30px;"><img  class="crossImage" src="./closeButton.jpg" alt="Virat" draggable="false" style="width: 100%" onclick="remPlayer('+"'"+newPlayer+"'"+',this)"/></div>'+
      '</div>'+
    
      '<div class="player-card-bottom">'+
        '<div class="player-info">'+
          
          '<div class="player-name"><span>'+newPlayer+wk+'</span></div>'+
          
          '<div class="player-features">'+
            '<div class="player-features-col">BAT<span>'+
                '<div class="player-feature-value">'+selectedPlayerInfo.bat_ppl+'</div>'+
                '<div class="player-feature-title">POW</div></span><span>'+
                '<div class="player-feature-value">'+selectedPlayerInfo.bat_mid+'</div>'+
                '<div class="player-feature-title">MO</div></span><span>'+
                '<div class="player-feature-value">'+selectedPlayerInfo.bat_death+'</div>'+
                '<div class="player-feature-title">D</div></span></div>'+
            '<div class="player-features-col">BOWL<span>'+
                '<div class="player-feature-value">'+selectedPlayerInfo.bow_ppl+'</div>'+
                '<div class="player-feature-title">POW</div></span><span>'+
                '<div class="player-feature-value">'+selectedPlayerInfo.bow_mid+'</div>'+
                '<div class="player-feature-title">MO</div></span><span>'+
                '<div class="player-feature-value">'+selectedPlayerInfo.bow_death+'</div>'+
                '<div class="player-feature-title">D</div></span></div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'+  
        '</div>';

      // animation to display
      document.getElementById("searchBar").value="";
      console.log(playerDiv.lastChild.childNodes[0]);
      playerDiv.lastChild.childNodes[0].classList.add(".fadeIt")
      

      // updating the required changes
        playerCount=parseInt(selectedPlayerInfo.overall)+playerCount;
        console.log(playerCount);
        scoreTag.innerHTML=playerCount;
        if(selectedPlayers.length<11){
          playerCountDiv.innerHTML="You have to select <span style='color:red'>"+parseInt(11-selectedPlayers.length) +"</span> players!!";
        } else if(checkCriteria()){

          $("#bat_pplList option").remove();
          $("#bat_midList option").remove();
          $("#bat_deathList option").remove();

          $("#bow_pplList option").remove();
          $("#bow_midList option").remove();
          $("#bow_deathList option").remove();


          playerCategory["BAT"].forEach(function(player){
            console.log(player);
            document.getElementById("bat_midList").innerHTML+="<option value='"+player+"'></option>";
            document.getElementById("bat_pplList").innerHTML+="<option value='"+player+"'></option>";
            document.getElementById("bat_deathList").innerHTML+="<option value='"+player+"'></option>";
          })

          playerCategory["WK"].forEach(function(player){
            console.log(player);
            document.getElementById("bat_midList").innerHTML+="<option value='"+player+"'></option>";
            document.getElementById("bat_pplList").innerHTML+="<option value='"+player+"'></option>";
            document.getElementById("bat_deathList").innerHTML+="<option value='"+player+"'></option>";
          })

          playerCategory["All"].forEach(function(player){
            console.log(player);
            document.getElementById("bat_midList").innerHTML+="<option value='"+player+"'></option>";
            document.getElementById("bat_pplList").innerHTML+="<option value='"+player+"'></option>";
            document.getElementById("bat_deathList").innerHTML+="<option value='"+player+"'></option>";
            document.getElementById("bow_deathList").innerHTML+="<option value='"+player+"'></option>";
            document.getElementById("bow_midList").innerHTML+="<option value='"+player+"'></option>";
            document.getElementById("bow_pplList").innerHTML+="<option value='"+player+"'></option>";

          })

          playerCategory["BOWL"].forEach(function(player){
            console.log(player);
            document.getElementById("bow_deathList").innerHTML+="<option value='"+player+"'></option>";
            document.getElementById("bow_midList").innerHTML+="<option value='"+player+"'></option>";
            document.getElementById("bow_pplList").innerHTML+="<option value='"+player+"'></option>";

          })

          catInputFunction();
          playerCountDiv.innerHTML="You can now procced and click on <span class='formNext'><a href='#moveDown'>NEXT</a></span>";
        } else{
          playerCountDiv.innerHTML="Criteria not fulfilled, check criteria <span class='criteriaButton' onclick='changeRuleBox();'>HERE</span>";
        }
        changePlayerSelectedState();
        snackbarFunction("Player Selected");
      } 
  }
 
  var playerPositionObject={
    "bat_ppl":[],
    "bat_mid":[],
    "bat_death":[],
    "bow_ppl":[],
    "bow_mid":[],
    "bow_death":[]
  }
  
  var remPlayerCategory=function(oldPlayer,el){
    console.log(oldPlayer,el.parentNode.parentNode.parentNode.parentNode);
    let playerNameDiv=el.parentNode.parentNode.parentNode.parentNode;
   
    
  
    console.log(oldPlayer.split("-"));
    let infoArray=oldPlayer.split("-");
    playerPositionObject[infoArray[0]].splice(playerPositionObject[infoArray[0]].indexOf(infoArray[1]),1);

    playerNameDiv.style.opacity="0";
    playerNameDiv.style.transfrom="scale(0.8,0.8)";
    setTimeout(function(){ playerNameDiv.style.display="none";}, 400);
    console.log(playerPositionObject)
  }
  


  var checkCategoryCondition=function(category,playerName){
    console.log(category);

    if(!selectedPlayers.includes(playerName)){
      snackbarFunction("Invalid Player Name , please select from the list");
      return false;
    }

    if(playerPositionObject[category].includes(playerName)){
      console.log("already selected in the given category");
      snackbarFunction("already present");
      return false;
    }
    
    if(categoryCount(category)){

      if(category=="bat_ppl"||category=="bat_mid"||category=="bat_death"){
        console.log("yess inside batting check");
        let countPlayer=0;
          if(playerPositionObject["bat_death"].includes(playerName)){
            countPlayer+=1
          }
          if(playerPositionObject["bat_mid"].includes(playerName)){
            countPlayer+=1
          }
          if(playerPositionObject["bat_ppl"].includes(playerName)){
            countPlayer+=1
          }
    
          if(countPlayer>=2){
            snackbarFunction("You cannot add a player in more than two category in each section");
            console.log("yess working")
            return false;
          } else{
            
            return true;
          }
    
      }else{
          let countPlayer=0;
          if(playerPositionObject["bow_death"].includes(playerName)){
            countPlayer+=1
          }
          if(playerPositionObject["bow_mid"].includes(playerName)){
            countPlayer+=1
          }
          if(playerPositionObject["bow_ppl"].includes(playerName)){
            countPlayer+=1
          }
    
          if(countPlayer>=2){
            snackbarFunction("You cannot add a player in more than two category in each section");
            return false;
          } else{
            return true;
          } 
        }

    } else {
      snackbarFunction("Sorry cannot add more in this category");
    }
     
  }
  
  
  var catInputFunction=()=>{
    console.log("testing",document.getElementsByClassName('catInput')[0]); 
    let condition=checkCriteria(); 
    for(var i=0;i<6;i++){
      if(condition &&selectedPlayers.length==11){
        document.getElementsByClassName('catInput')[i].disabled=false;
      } else{
        document.getElementsByClassName('catInput')[i].disabled=true;
      }
    } 
  }


var categoryCount=(category)=>{

  console.log(category);
  if(category=="bat_ppl"&&playerPositionObject[category].length<4){
    return true;
  } else if(category=="bat_mid"&&playerPositionObject[category].length<4){
    return true;
  } else if(category=="bat_death"&&playerPositionObject[category].length<2){
    return true;
  }else if(category=="bow_ppl"&&playerPositionObject[category].length<3){
    return true;
  } else if(category=="bow_mid"&&playerPositionObject[category].length<3){
    return true;
  } else if(category=="bow_death"&&playerPositionObject[category].length<2){
    return true;
  }

  return false;

}


  
  
  var addPlayerCategory=function(category,el){
  
    if(selectedPlayers.length==11){
      console.log(category,el.parentNode.parentNode.childNodes[1].childNodes[1].value);
      let playerName=el.parentNode.parentNode.childNodes[1].childNodes[1].value;
      if(checkCategoryCondition(category,playerName) ){
        let categoryName=category+"-"+playerName;
      let className="rect-card "+playerName;

        console.log("getting parent: ",el.parentNode.parentNode.parentNode.parentNode.childNodes[3])
        let newDiv=el.parentNode.parentNode.parentNode.parentNode.childNodes[3];
        newDiv.innerHTML+='<div class="'+className+'">'+
        '<div class="row"  style="margin-left: 1rem;">'+
            '<div class="col-lg-9">'+
              '<h2 style="font-size:1.25rem;">'+playerName+'</h2>'+
            '</div>'+
            '<div class="col-lg-3">'+
              '<div  style="width:1.4rem;height:1.4rem;">'+
                '<img  class="crossImage" src="./closeButton.jpg" alt="Virat" draggable="false" style="width: 100%" onclick="remPlayerCategory('+"'"+categoryName+"'"+',this)"/>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>';
        // will use the below code to delete elements
        playerPositionObject[category].push(playerName);
        console.log(playerPositionObject);
        // console.log(document.getElementById(category+playerName).innerHTML);
        el.parentNode.parentNode.childNodes[1].childNodes[1].value="";
      } 
    } else{
      snackbarFunction("select 11 players first");
    }
    el.parentNode.parentNode.childNodes[1].childNodes[1].value="";
  
  }

  var checkIfAddedInCategory=(player)=>{

    console.log(player,"hiiiiiiiiii")
    let present=false;
    if(playerPositionObject["bat_ppl"].includes(player)){
      present=true;
      console.log("bat_ppl","hehehehe");
      playerPositionObject["bat_ppl"].splice(playerPositionObject["bat_ppl"].indexOf(player),1);

    }
    if(playerPositionObject["bat_mid"].includes(player)){
      present=true;
      console.log("bat_mid");
      playerPositionObject["bat_mid"].splice(playerPositionObject["bat_mid"].indexOf(player),1);

    }
    if(playerPositionObject["bat_death"].includes(player)){
      present=true;
      console.log("bat_death");
      playerPositionObject["bat_death"].splice(playerPositionObject["bat_death"].indexOf(player),1);

    }
    if(playerPositionObject["bow_ppl"].includes(player)){
      present=true;
      console.log("bow_ppl");
      playerPositionObject["bow_ppl"].splice(playerPositionObject["bow_ppl"].indexOf(player),1);

    }
    if(playerPositionObject["bow_mid"].includes(player)){
      present=true;
      console.log("bow_mid");
      playerPositionObject["bow_mid"].splice(playerPositionObject["bow_mid"].indexOf(player),1);

    }
    if(playerPositionObject["bow_death"].includes(player)){
      present=true;
      console.log("bow_death");
      playerPositionObject["bow_death"].splice(playerPositionObject["bow_death"].indexOf(player),1);

    }
    
    if(present){
      startAnimationForSelected("rect-card "+player);
    }
    
  }
  


  var startAnimationForSelected=function(player){
  
    console.log(player," animation");
    let classDiv=document.getElementsByClassName(player);
  
    document.getElementById("moveDown").scrollIntoView();
    for(var j=0;j<classDiv.length;j++){
      classDiv[j].style.display="none";
      // console.log(classDiv[j]);
    }

  }



 var checkRemove=function(){
  //console.log(document.getElementById("removeCOl"));
  document.getElementById("removeCOl").style.display="none";

 }


//  function to change the selected players count
 var changePlayerSelectedState=function(){
  console.log("changing state");
  document.getElementById('playersSelectedDiv2').innerHTML='<p><span class="playerType">Batsman:</span>'+playerCategory["BAT"].length+' </p>'+
    '<p><span class="playerType">Bowler:</span>'+playerCategory["BOWL"].length+' </p>'+
    '<p><span class="playerType">WK:</span>'+playerCategory["WK"].length+' </p>'+
    '<p><span class="playerType">All-rounder:</span>'+playerCategory["All"].length+'</p>';
 }



//  function to remove the selected players and updating the reqeuired changes
var remPlayer=function(player,tagCheck){

  console.log(tagCheck.parentNode.parentNode.parentNode.parentNode.parentNode,player);
  let playerDivRem=tagCheck.parentNode.parentNode.parentNode.parentNode.parentNode;

  playerDivRem.style.opacity="0";
  tagCheck.style.display="none";
  setTimeout(function(){ playerDivRem.style.display="none";}, 1000);
// removing the deslected player from all categories
  playerList.forEach(function(playerInfo){
    if(playerInfo.name==player){
      playerCount=parseInt(playerCount-parseInt(playerInfo.overall));
      scoreTag.innerHTML=playerCount;
      if(playerInfo.type=="BAT" &&playerInfo.is_wk){
          playerCategory["WK"].splice(playerCategory["WK"].indexOf(player),1);
        } else if(playerInfo.type=="BAT" && !playerInfo.is_wk){
          playerCategory[playerInfo.type].splice(playerCategory[playerInfo.type].indexOf(player),1);
        } else {
          playerCategory[playerInfo.type].splice(playerCategory[playerInfo.type].indexOf(player),1);
        }

      if(playerInfo.is_retro){
        playerCategory["RET"].splice(playerCategory["RET"].indexOf(player),1);
      }

      if(playerInfo.is_foriegn){
        playerCategory["FORN"].splice(playerCategory["FORN"].indexOf(player),1);
      }
      console.log(playerCount,"hello");
    }
  })

  // updating the page 
  selectedPlayers.splice(selectedPlayers.indexOf(player),1)
  console.log(selectedPlayers);
  changePlayerSelectedState();
  playerCountDiv.innerHTML="You have to select <span style='color:red'>"+parseInt(11-selectedPlayers.length) +"</span> players!!";
  checkIfAddedInCategory(player);

  if(selectedPlayers.length==10){
    catInputFunction();
  }

 }



 var checkPlayer=function(){
  console.log("removing dynamically added player");
 }


//  temporary not required now
 var createForm=function(){
  console.log(selectedPlayers);

  let formDynamic=document.createElement('form');
  formDynamic.method="POST"
  formDynamic.action="/nextPage"

  selectedPlayers.forEach(function(player){
    var inputElement=document.createElement('input');
    inputElement.type="hidden"
    inputElement.name="playerList"
    inputElement.value=player;

    formDynamic.appendChild(inputElement);
  })

  var inputElement=document.createElement('input');
    inputElement.type="hidden"
    inputElement.name="score"
    inputElement.value=playerCount;

  document.body.appendChild(formDynamic);
  formDynamic.submit();
 }



//  checking the required criteria
 var checkCriteria=function(){
      if(playerCategory["BOWL"].length<3 || playerCategory["BOWL"].length>5){
          return false;
      }
      if(playerCategory["All"].length<1 || playerCategory["All"].length>3){
          return false;
      }

      if(playerCategory["WK"].length<1 || playerCategory["WK"].length>2){
          return false;
      }

      if(playerCategory["WK"].length==2){
        if(playerCategory["BAT"].length<2 || playerCategory["BAT"].length>4){
          return false;
        }
      } else{
        if(playerCategory["BAT"].length<3 || playerCategory["BAT"].length>5){
          return false;
        }
      }

      if((playerCategory["BOWL"].length+playerCategory["All"].length<5)){
        return false;
      }

      if(playerCategory["RET"].length>2|| playerCategory["RET"].length<1){
        return false;
      }

      if(playerCategory["FORN"].length>4){
        return false;
      }
      return true;
 }


// displaying the rulebox division 
 var changeRuleBox=function(){

  if(document.getElementById('ruleDiv').className=="positionDown"){
    
    document.getElementById('ruleDiv').classList.remove("positionDown");
    document.getElementById('ruleDiv').classList.add("positionUp");
    
    setTimeout(function(){ 
      document.getElementById('overlay').style.display="none";
    }, 1000);
  }else{
    document.getElementById('overlay').style.display="block";
    setTimeout(function(){ 
      document.getElementById('ruleDiv').classList.remove("positionUp");
    document.getElementById('ruleDiv').classList.add("positionDown");
    }, 200);
   
   }
}