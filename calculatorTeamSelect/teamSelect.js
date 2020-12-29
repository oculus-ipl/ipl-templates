

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
    minLength: 1 /* Specify minimum characters required for showing suggestions */
  },
  {
      name: 'common',
      source: commonTagHelper
  });

  //show usergenerated array

  function snackbarFunction(condition) {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");
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
      playerDiv.innerHTML+='<div class="col-lg-3" style="transition: all 0.5s ease-in">'+
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
        if(selectedPlayers.length<2){
          playerCountDiv.innerHTML="You have to select <span style='color:red'>"+parseInt(11-selectedPlayers.length) +"</span> players!!";
        } else if(checkCriteria()){

          playerCountDiv.innerHTML="You can now procced and click on <span class='formNext' onclick ='createForm();'>NEXT</span>";
        } else{
          playerCountDiv.innerHTML="Criteria not fulfilled, check criteria <span class='criteriaButton' onclick='changeRuleBox();'>HERE</span>";
        }
        changePlayerSelectedState();
        snackbarFunction("Player Selected");
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

      if(playerCategory["RET"].length>2){
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