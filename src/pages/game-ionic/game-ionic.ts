import { NavController } from 'ionic-angular';
import {HelloIonicPage} from  '../../pages/hello-ionic/hello-ionic';
import { Component, NgZone, ViewChild, ElementRef,AfterViewChecked } from '@angular/core';
import { Platform, AlertController, } from 'ionic-angular';

// cards array holds all cards
let card:any ;
let cards:any;

// deck of all cards in game
let deck:any = "";

// declaring move variable
let moves:any = 0;
let counter:any;

// declare variables for star icons
let stars:any = "";

// declaring variable of matchedCards
let matchedCard:any;

 // stars list
 let starsList:any;

 // close icon in modal
 let closeicon:any;

 // declare modal
 let modal:any;

 let finalTime: any;

 // array for opened cards
var openedCards = [];
var second = 0, minute = 0, hour = 0;
var timer = document.querySelector(".timer");
var interval;

@Component({
  selector: 'GameIonicPage',
  templateUrl: 'game-ionic.html'
})
export class GameIonicPage {

  constructor(public platform: Platform, public alertCtrl: AlertController, public zone: NgZone,public nav:NavController) {
    this.platform.ready().then(() => {
      setTimeout(()=>{ 
        // cards array holds all cards
        debugger;
        card = document.getElementsByClassName("card");
        cards = Array.prototype.slice.call( card );

        // deck of all cards in game
        deck = document.getElementById("card-deck");
        
        // declaring move variable
        moves = 0;
        counter = document.querySelector(".moves");

        // declare variables for star icons
        stars = document.querySelectorAll(".fa-star");

        // declaring variable of matchedCards
        matchedCard = document.getElementsByClassName("match");

        // stars list
        starsList = document.querySelectorAll(".stars li");

        // close icon in modal
        closeicon = document.querySelector(".close");

        // declare modal
        modal = document.getElementById("popup1");

        this.startGame();
        this.addListenersToCard();
      },1);
    });    

  }


// @description shuffles cards
// @param {array}
// @returns shuffledarray
shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};


// @description shuffles cards when page is refreshed / loads
//document.body.onload = startGame();


// @description function to start a new play 
startGame(){
    // shuffle deck
    cards = this.shuffle(cards);
    // remove all exisiting classes from each card
    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");
    }
    // reset moves
    moves = 0;
    counter.innerHTML = moves;
    // reset rating
    for (var i= 0; i < stars.length; i++){
        stars[i].style.color = "#FFD700";
        stars[i].style.visibility = "visible";
    }
    //reset timer
    second = 0;
    minute = 0; 
    hour = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
}


// @description toggles open and show class to display cards
displayCard (c){
    c.classList.toggle("open");
    c.classList.toggle("show");
    c.classList.toggle("disabled");
    // c.getElementsByClassName("myIcon")[0].classList.toggle("open");
    // c.getElementsByClassName("myIcon")[0].classList.toggle("show");
    // c.getElementsByClassName("myIcon")[0].classList.toggle("disabled");
};


// @description add opened cards to OpenedCards list and check if cards are match or not
 
cardOpen(event) {
    openedCards.push(event.target);
    var len = openedCards.length;
    if(len === 2){
        this.moveCounter();
        if(openedCards[0].type === openedCards[1].type){
            this.matched();
        } else {
            this.unmatched();
        }
    }
};


// @description when cards match
 matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");




    // openedCards[0].getElementsByClassName("myIcon")[0].classList.add("match", "disabled");
    // openedCards[1].getElementsByClassName("myIcon")[0].classList.add("match", "disabled");
    // openedCards[0].getElementsByClassName("myIcon")[0].classList.remove("show", "open", "no-event");
    // openedCards[1].getElementsByClassName("myIcon")[0].classList.remove("show", "open", "no-event");

    openedCards = [];
}


// description when cards don't match
 unmatched(){
   let that = this;
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");

    // openedCards[0].getElementsByClassName("myIcon")[0].classList.add("unmatched");
    // openedCards[1].getElementsByClassName("myIcon")[0].classList.add("unmatched");

    this.disable();
    setTimeout(()=>{
        openedCards[0].classList.remove("show", "open", "no-event","unmatched");
        openedCards[1].classList.remove("show", "open", "no-event","unmatched");

        // openedCards[0].getElementsByClassName("myIcon")[0].classList.remove("show", "open", "no-event","unmatched");
        // openedCards[1].getElementsByClassName("myIcon")[0].classList.remove("show", "open", "no-event","unmatched");

        that.enable();
        openedCards = [];
    },1100);
}


// @description disable cards temporarily
 disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}


// @description enable cards and disable matched cards
 enable(){
    Array.prototype.filter.call(cards, (card)=>{
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}


// @description count player's moves
 moveCounter(){
   let i: any;
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        second = 0;
        minute = 0; 
        hour = 0;
        this.startTimer();
    }
    // setting rates based on moves
    if (moves > 8 && moves < 12){
        for( i= 0; i < 3; i++){
            if(i > 1){
                stars[i].style.visibility = "collapse";
                
            }
        }
    }
    else if (moves > 13){
        for( i= 0; i < 3; i++){
            if(i > 0){
                stars[i].style.visibility = "collapse";
            }
        }
    }
}


// @description game timer

 startTimer(){
    interval = setInterval(()=>{
      var timer = document.querySelector(".timer");
        timer.innerHTML = minute+"mins "+second+"secs";
        second++;
        if(second == 10){
            // minute++;
            // second=0;
          
            this.congratulations();
        
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}


// @description congratulations when all cards match, show modal and moves, time and rating
 congratulations(){
    if (matchedCard.length == 12 || second == 10){
        let context = this;
        document.getElementById("play-again").addEventListener("click",()=>{
            context.routeBack();
        });
        clearInterval(interval);
        var timer = document.querySelector(".timer");
        finalTime = timer.innerHTML;

        // show congratulations modal
        modal.classList.add("show");

        // declare star rating variable
        var starRating = document.querySelector(".stars").innerHTML;

        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;

        //closeicon on modal
        this.closeModal();
    };
}


// @description close icon on modal
 closeModal(){
    closeicon.addEventListener("click", (e)=>{
        modal.classList.remove("show");
        this.startGame();
    });
}


// @desciption for user to play Again 
 playAgain(){
    modal.classList.remove("show");
    this.nav.pop();
    // this.startGame();
}

routeBack(){
    modal.classList.remove("show");
    this.nav.pop();
}
// loop to add event listeners to each card
addListenersToCard(){
  for ( var i = 0; i < cards.length; i++){
    card = cards[i];
    // card.addEventListener("click", this.displayCard(card));
    // card.addEventListener("click",this.congratulations);

    card.addEventListener('click', (event) => {
      event.target.classList.toggle("open");
      event.target.classList.toggle("show");
      event.target.classList.toggle("disabled");

    //   event.target.getElementsByClassName("myIcon")[0].classList.toggle("open");
    //   event.target.getElementsByClassName("myIcon")[0].classList.toggle("show");
    //   event.target.getElementsByClassName("myIcon")[0].classList.toggle("disabled");

    });

    card.addEventListener('click', (event) => {
    openedCards.push(event.target);
    var len = openedCards.length;
    if(len === 2){
        this.moveCounter();
        if(openedCards[0].type === openedCards[1].type){
            this.matched();
        } else {
            this.unmatched();
        }
    }
    
  });

  card.addEventListener('click', (event) => {
    
  if (matchedCard.length == 16){
    clearInterval(interval);
    var timer = document.querySelector(".timer");
    finalTime = timer.innerHTML;

    // show congratulations modal
    modal.classList.add("show");

    // declare star rating variable
    var starRating = document.querySelector(".stars").innerHTML;

    //showing move, rating, time on modal
    document.getElementById("finalMove").innerHTML = moves;
    document.getElementById("starRating").innerHTML = starRating;
    document.getElementById("totalTime").innerHTML = finalTime;

    //closeicon on modal
    this.closeModal();
   
};
  });

  };
}
}


