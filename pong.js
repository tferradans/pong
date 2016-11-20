window.onload = function () {
    
    var game = {
        
        'current_screen': null,
        
        'WIDTH': 512,
        'HEIGHT': 384,
        
        'canvas': undefined,
        'ctx': undefined,
        'paused': false,
        'difficulty': 1,
        
        'init': function() {
            //get canvas and context
            game.canvas = document.getElementById("gameCanvas");
            game.ctx = game.canvas.getContext("2d");
            
            //set canvas size
            game.canvas.width = game.WIDTH;
            game.canvas.height = game.HEIGHT;
            
            //sets the opponent as the computer by default (can be changed by player)
            game.screen_game.opponent = game.screen_game.computer;
            
            //init game objects
            game.keyboard.init();
            game.audioplayer.init();
        
            game.reboot();
            
            //start game loop
            requestAnimationFrame(game.loop);
        },
        
        //audio player inits audio files before the game starts
        'audioplayer': {
            
            'ping': null,
            'pong': null,
            'bleep': null,
            
            'init': function() {
                this.ping = new Audio("ping.wav");
                this.pong = new Audio("pong.wav");
                this.bleep = new Audio("bleep.wav")
            },
        },
        
        'reboot': function() {
            //if the user restarts the game while it's paused
            if (game.paused) {
                game.pause()
            }
            
            //reboots keyboard status
            game.keyboard.reboot();
            //defines starting screen
            game.current_screen = game.screen_open;
            //init screen_game
            game.current_screen.reboot();
            
        },
        
        //pauses the game
        'pause': function () {
            //play sound
            game.audioplayer.ping.play();
            
            if (game.paused) {
                game.paused = false;
                game.loop();
            }
            else if (!game.paused) {
                game.paused = true;
            }
        },
        
        'loop': function () {
            //update and draw
            game.update();
            game.draw();
            
            if (!game.paused) {
            //request next animation frame
            requestAnimationFrame(game.loop);
            }
        },
        
        'update': function() {
            game.current_screen.update();
        },
        
        'draw': function() {
            game.current_screen.draw();
            
            if (game.paused) {
               game.signs.showPause();
            }
        },
        
        'keyboard': {
            
            'up': false,
            'down': false,
            'w': false,
            's': false,
            'enter': false,
            
            'init': function () {
                //pressed key
                window.addEventListener("keydown", function(event) {
                    //enter press
                    if (event.keyCode == 13) {
                        game.keyboard.enter = true;
                    }
                    //w key press
                    else if (event.keyCode == 87) {
                        game.keyboard.w = true;
                    }
                    //s key press
                    else if (event.keyCode == 83) {
                        game.keyboard.s = true;
                    }
                    //up arrow press
                    else if (event.keyCode == 38) {
                        game.keyboard.up = true;
                    }
                    //down arrow press
                    else if (event.keyCode == 40) {
                        game.keyboard.down = true;
                    }
                    
                    //p press, pause game
                    if (event.keyCode == 80) {
                        game.pause();
                    }
                    
                    //r press, restart game
                    if (event.keyCode == 82) {
                        game.reboot();
                    }
                    
                });
                
                //released key
                window.addEventListener("keyup", function(event) {
                    //w key release
                    if (event.keyCode == 87) {
                        game.keyboard.w = false;
                    }
                    //s key release
                    else if (event.keyCode == 83) {
                        game.keyboard.s = false;
                    }
                    
                    //up arrow release
                    if (event.keyCode == 38) {
                        game.keyboard.up = false;
                    }
                    //down arrow release
                    else if (event.keyCode == 40) {
                        game.keyboard.down = false;
                    }
                });
            },
            
            'reboot': function () {
                this.up = false;
                this.down = false;
                this.w = false;
                this.s = false;
                this.enter = false;
            },
        },
    
        
        'screen_open': {
            
            'MAX_TIME':80,
        
            'ms': 0,
            'insert_coin': true,
            
            'reboot': function() {},
            
            'update': function() {
                //increase miliseconds count
                this.ms++;
                //blink "insert coin" sign if count is high enough
                if (this.ms >= this.MAX_TIME) {
                    //reset count
                    this.ms = 0;
                    //switch states for message display
                    if (this.insert_coin) {
                        this.insert_coin = false;
                    }
                    else {
                        this.insert_coin = true;
                        //play sound
                        game.audioplayer.bleep.play();
                    }
                    //reset count
                    this.ms = 0;
                }
                
                //move to next screen when enter is pressed
                if (game.keyboard.enter) {
                    //play sound
                    game.audioplayer.ping.play();
                    //reset enter state
                    game.keyboard.enter = false;
                    //next screen
                    game.current_screen = game.screen_player;
                    //init screen_game
                    game.current_screen.reboot();
                }
            },
            
            'draw': function() {
                //clears game canvas
                game.ctx.clearRect(0,0, game.WIDTH, game.HEIGHT);
                
                //default text settings
                game.ctx.fillStyle = "white";
                game.ctx.textAlign = "center";
                game.ctx.font = "100px Courier New";
                
                //title font settings
                game.ctx.fillText("PONG", game.WIDTH/2, game.HEIGHT/2);
            
                game.ctx.font = "20px Courier New";
            
                //demo mode message, in case DEMO MODE exists
                //game.ctx.fillText("DEMO MODE", game.WIDTH/2, 0.1 * game.HEIGHT);
            
                //display "continue" message
                if (this.insert_coin) {
                    game.ctx.fillText("INSERT COIN TO CONTINUE", game.WIDTH/2, 0.75 * game.HEIGHT);
                    game.ctx.fillText("<press Enter to start>", game.WIDTH/2, (0.75 * game.HEIGHT) + 25);
                }
            },
        },
        
        //for selecting players
        'screen_player': {
            
            'THICK': 10,
            'THIN': 2,
            
            //true = 1 player , false = 2 players
            'opponent': true,
            
            'reboot': function() {},
            
            'update': function() {
                //change option
                if (game.keyboard.down && this.opponent) {
                    //play sound
                    game.audioplayer.pong.play();
                    this.opponent = false;
                    game.keyboard.down = false;
                }
                else if (game.keyboard.up && !this.opponent) {
                    //play sound
                    game.audioplayer.pong.play();
                    this.opponent = true;
                    game.keyboard.up = false;
                }
                //when enter is pressed
                if (game.keyboard.enter) {
                    //play sound
                    game.audioplayer.ping.play();
                    if (this.opponent) {
                        //reset enter key
                        game.keyboard.enter = false;
                        //set opponent as computer
                        game.screen_game.opponent = game.screen_game.computer;
                        //move to next screen
                        game.current_screen = game.screen_difficulty
                        //init screen_game
                        game.current_screen.reboot();
                    }
                    else {
                        //reset enter key
                        game.keyboard.enter = false;
                        //set opponent as player 2
                        game.screen_game.opponent = game.screen_game.player2;
                        //move to next screen
                        game.current_screen = game.screen_game;
                        //init screen_game
                        game.current_screen.reboot();
                    }
                }
            },
            
            'draw': function() {
                game.ctx.clearRect(0,0, game.WIDTH, game.HEIGHT);
                
                //style for canvas
                game.ctx.strokeStyle = "white";
                game.ctx.fillStyle = "white";
                game.ctx.lineWidth = this.THICK;
                
                //draw outer box
                game.ctx.strokeRect(0.1 * game.WIDTH, 0.24 * game.HEIGHT, 0.8 * game.WIDTH, 0.52 * game.HEIGHT);
                
                //draw text
                game.ctx.textAlign = "center";
                game.ctx.font = "27px Courier New";
                game.ctx.fillText("CHOOSE YOUR DESTINY:", game.WIDTH/2, 0.4 * game.HEIGHT);
                
                //draw options
                game.ctx.textAlign = "left";
                game.ctx.fillText("1 PLAYER", game.WIDTH/3 + 30, 0.52 * game.HEIGHT);
                game.ctx.fillText("2 PLAYERS", game.WIDTH/3 + 30, 0.65 * game.HEIGHT);
                
                //draw selection based on this.opponent
                game.ctx.lineWidth = this.THIN;
                if (this.opponent) {
                    game.ctx.fillRect(game.WIDTH/3 - 5, 0.46 * game.HEIGHT, 27, 27);
                    game.ctx.strokeRect(game.WIDTH/3 - 5, 0.59 * game.HEIGHT, 27, 27);
                }
                else {
                    game.ctx.strokeRect(game.WIDTH/3 - 5, 0.46 * game.HEIGHT, 27, 27);
                    game.ctx.fillRect(game.WIDTH/3 - 5, 0.59 * game.HEIGHT, 27, 27);
                }
                
            },
        },
        
        'screen_difficulty': {
            
            'THICK': 10,
            'THIN': 2,
            'MIN': 1,
            'MAX': 4,
            
            //base difficulty
            'difficulty': 1,
            
            'reboot': function() {
                game.difficulty = this.difficulty;
            },
            
            'update': function() {
                //middle values
                if (this.difficulty > this.MIN && this.difficulty < this.MAX) {
                    if (game.keyboard.down) {
                        //play sound
                        game.audioplayer.pong.play();
                        //reset key
                        game.keyboard.down = false;
                        this.difficulty++;
                    }
                    else if (game.keyboard.up) {
                        //play sound
                        game.audioplayer.pong.play();
                        //reset key
                        game.keyboard.up = false;
                        this.difficulty--;
                    }
                }
                //min value
                else if (this.difficulty == this.MIN) {
                    if (game.keyboard.down) {
                        //play sound
                        game.audioplayer.pong.play();
                        //reset key
                        game.keyboard.down = false;
                        this.difficulty++;
                    }
                }
                //max value
                else if (this.difficulty == this.MAX) {
                    if (game.keyboard.up) {
                        //play sound
                        game.audioplayer.pong.play();
                        //reset key
                        game.keyboard.up = false;
                        this.difficulty--;
                    }
                }
                
                //when enter is pressed, assign to game difficulty
                if (game.keyboard.enter) {
                    //reset enter
                    game.keyboard.enter = false;
                    //play sound
                    game.audioplayer.ping.play();
                    //assign to game property
                    game.difficulty = this.difficulty;
                    //proceed to next screen
                    game.current_screen = game.screen_game;
                    //init screen_game
                    game.current_screen.reboot();
                }
            },
            
            'draw': function() {
                var position = (game.WIDTH/3);
                game.ctx.clearRect(0,0, game.WIDTH, game.HEIGHT);
                
                //style for canvas
                game.ctx.strokeStyle = "white";
                game.ctx.fillStyle = "white";
                game.ctx.lineWidth = this.THICK;
                
                //draw outer box
                game.ctx.strokeRect(0.1 * game.WIDTH, 0.2 * game.HEIGHT, 0.8 * game.WIDTH, 0.6 * game.HEIGHT);
                
                //draw text
                game.ctx.textAlign = "center";
                game.ctx.font = "27px Courier New";
                game.ctx.fillText("HOW HARD SHOULD I PLAY?", game.WIDTH/2, 0.3 * game.HEIGHT);
                
                //draw options
                game.ctx.textAlign = "left";
                game.ctx.fillText("PIECE OF CAKE", position, 0.42 * game.HEIGHT);
                game.ctx.fillText("LET'S ROCK", position, 0.52 * game.HEIGHT);
                game.ctx.fillText("COME GET SOME", position, 0.62 * game.HEIGHT);
                game.ctx.fillText("DAMN, I'M GOOD", position, 0.72 * game.HEIGHT);
                
                //draw squares
                game.ctx.lineWidth = this.THIN;
                game.ctx.strokeRect(position - 40, 0.36 * game.HEIGHT, 27, 27);
                game.ctx.strokeRect(position - 40, 0.46 * game.HEIGHT, 27, 27);
                game.ctx.strokeRect(position - 40, 0.56 * game.HEIGHT, 27, 27);
                game.ctx.strokeRect(position - 40, 0.66 * game.HEIGHT, 27, 27);
                
                //fill square based on selected difficulty
                switch (this.difficulty) {
                    case this.MIN:
                        game.ctx.fillRect(position - 40, 0.36 * game.HEIGHT, 27, 27);
                        break;
                    case this.MIN+1:
                        game.ctx.fillRect(position - 40, 0.46 * game.HEIGHT, 27, 27);
                        break;
                    case this.MAX-1:
                        game.ctx.fillRect(position - 40, 0.56 * game.HEIGHT, 27, 27);
                        break;
                    case this.MAX:
                        game.ctx.fillRect(position - 40, 0.66 * game.HEIGHT, 27, 27);
                        break;
                }
            },
        },
        
        'screen_game': {
            
            'init': function () {
                
                this.player.init();
                this.opponent.init();
                this.score.init();
            },
            
            'reboot': function () {
                //reboot game objects
                this.player.reboot();
                this.puck.reboot();
                this.opponent.reboot();
                this.score.reboot();
            },
            
            'update': function () {
                //update game objects
                this.player.update();
                this.puck.update();
                this.opponent.update();
                this.score.update();
            },
            
            'draw': function () {
                //clear canvas
                game.ctx.clearRect(0,0, game.WIDTH, game.HEIGHT);
                
                //draw game objects
                this.midfield.draw();
                this.player.draw();
                this.puck.draw();
                this.opponent.draw();
                this.score.draw();
            },
            
            'midfield' : {
                'LINE_LENGTH': 10,
                'GAP': 6,
                'LINE_WIDTH':3,
                
                'draw': function () {
                    
                    game.ctx.strokeStyle = "white";
                    game.ctx.lineWidth = this.LINE_WIDTH;
                    
                    //draw mid lines
                    game.ctx.beginPath();
                    game.ctx.moveTo(game.WIDTH/2,0);
                    
                    var i = 0;
                    
                    while (i < game.HEIGHT) {
                        
                        i += this.LINE_LENGTH;
                        game.ctx.lineTo(game.WIDTH/2, i);
                        i += this.GAP;
                        game.ctx.moveTo(game.WIDTH/2, i);
                    } //end while
                    
                    game.ctx.closePath();
                    game.ctx.stroke();
                },
            },
        
            'player': {
                
                'MARGIN': 15,
                'WIDTH': 15,
                'HEIGHT': 80,
                'ACCELERATION': 0.7,
                'MAX_SPEED': 8,
                'TURBO_SPEED': 2,
                
                'position': 0,
                'speed': 0,
                
                'getBottom': function () {
                    return this.position+this.HEIGHT;
                },
                
                'getRight': function() {
                    return this.MARGIN + this.WIDTH;
                },
                
                'init': function () {},
                'reboot': function () {
                    //set initial position
                    this.position = game.HEIGHT/2 - this.HEIGHT/2;
                    this.speed = 0;
                },
                'update': function () {
                    //define current speed based on keyboard
                    if (game.keyboard.w) {
                        this.speed -= this.ACCELERATION;
                    }
                    else if (game.keyboard.s) {
                        this.speed += this.ACCELERATION;
                    }
                    else if (this.speed > 0) {
                        if (this.speed >= this.ACCELERATION) {
                            this.speed -= this.ACCELERATION;
                        }
                        else {
                            this.speed = 0;
                        }
                    }
                    else if (this.speed < 0) {
                        if (this.speed <= this.ACCELERATION) {
                            this.speed += this.ACCELERATION;
                        }
                        else {
                            this.speed = 0;
                        }
                    }
                    
                    else {
                        this.speed = 0;
                    }
                    
                    //speed limit
                    if (this.speed > this.MAX_SPEED) {
                        this.speed = this.MAX_SPEED;
                    }
                    else if (this.speed < -this.MAX_SPEED) {
                        this.speed = -this.MAX_SPEED;
                    }
                    
                    //increment position
                    this.position += this.speed;
                    
                    //limit position
                    if (this.position < 0) {
                        this.position = 0;
                        this.speed = 0;
                    }
                    else if (this.getBottom() > game.HEIGHT) {
                        this.position = game.HEIGHT-this.HEIGHT;
                        this.speed = 0;
                    }
                
                },
                'draw': function () {
                    game.ctx.fillStyle = "white";
                    game.ctx.fillRect(this.MARGIN, this.position, this.WIDTH, this.HEIGHT);
                },
            },
            
            'puck': {
                
                'SIZE': 14,
                'START_SPEED': 6,
                'SPEED_STEP':0.5,
                'SPREAD_ANGLE': Math.PI/6,
    
                'timer': null,
    
                'speed': 0,
                'angle':0,
                'center': {
                    'x': 0,
                    'y': 0,
                },
                
                //getters for puck
                'getTop': function () {
                    return this.center.y-this.SIZE/2;
                },
                'getBottom': function () {
                    return this.center.y+this.SIZE/2;
                },
                'getLeft': function () {
                    return this.center.x-this.SIZE/2;
                },
                'getRight': function () {
                    return this.center.x+this.SIZE/2;
                },
                
                //setters for puck
                'setTop': function (top) {
                    this.center.y = top+this.SIZE/2;
                },
                'setBottom': function (bottom) {
                    this.center.y = bottom-this.SIZE/2;
                },
                'setLeft': function (left) {
                    this.center.x = left+this.SIZE/2;
                },
                'setRight': function (right) {
                    this.center.x = right-this.SIZE/2;
                },
                
                //set limiting angles to avoid vertical lock
                'setAngle': function (angle) {
                
                    //reduce angle if over 360
                    while (angle >= 2*Math.PI) {
                        angle -= 2*Math.PI;
                    }
                    
                    //normalize angle between 0 and 360 degrees
                    if (angle < 0) {
                        angle += 2*Math.PI;
                    }
                    
                    //helpful variables
                    var circle = 2*Math.PI;
                    //set limiting angle, 30 degrees
                    var arc = circle/12;
                    
                    var steps = [
                        (circle/4)-arc,
                        (circle/4), //90 degrees
                        (circle/4)+arc,
                        (3*circle/4)-arc,
                        (3*circle/4), //270 degrees
                        (3*circle/4)+arc
                    ];
                    
                    //avoid angles that are too vertical
                    if (angle > steps[0] && angle <= steps[1]) {
                        angle = steps[0];
                    }
                    else if (angle > steps[1] && angle < steps[2]) {
                        angle = steps[2];
                    }
                    else if (angle > steps[3] && angle <= steps[4]) {
                        angle = steps[3];
                    }
                    else if (angle > steps[4] && angle < steps[5]) {
                        angle = steps[5];
                    }
                    
                    //set property
                    this.angle = angle;
                    
                    //play sound
                    game.audioplayer.pong.play();
                },
                
                'bounce': function(normal) {
                    //bounce angle along normal
                    this.setAngle(2 * normal - this.angle - Math.PI);
                },
                
                //don't block any angles
                'playerSetAngle': function (angle,player) {
                    //the player parameter identifies where the ball is bouncing
                    //reduce angle if over 360
                    while (angle >= 2*Math.PI) {
                        angle -= 2*Math.PI;
                    }
                    
                    //normalize angle between 0 and 360 degrees
                    if (angle < 0) {
                        angle += 2*Math.PI;
                    }
                    
                    //if the ball hits the player, prevents it from flipping over
                    if (player === true) {
                        if (angle >= 1.5 * Math.PI) {
                            angle = 1.6 * Math.PI;
                        }
                        else if (angle <= 0.5 * Math.PI) {
                            angle = 0.6 * Math.PI;
                        }
                    }
                    //if the ball hits the opponent, prevents it from flipping over
                    else if (player === false) {
                        if (angle >= 1.5 * Math.PI) {
                            angle = 1.4 * Math.PI;
                        }
                        else if (angle <= 0.5 * Math.PI) {
                            angle = 0.4 * Math.PI;
                        }
                    }
                    
                    //set property
                    this.angle = angle;
                    //play sound
                    game.audioplayer.ping.play();
                },
                
                'playerBounce': function(normal) {
                    //bounce angle along normal
                    this.playerSetAngle(2 * normal - this.angle - Math.PI);
                },
                
                'reboot': function () {
                    //set in center
                    this.center.x = game.WIDTH/2;
                    this.center.y = game.HEIGHT/2;
                    //set random angle for start
                    this.setAngle(Math.random()* 2*Math.PI);
                    
                    //reset start timer and speed
                    this.timer = 60;
                    this.speed = 0;
                    
                },
                'update': function () {
                    var screen_game = game.screen_game;
                    
                    //decrease timer
                    this.timer--;
                    
                    //when timer 0, assign start_speed to puck
                    if (this.timer == 0) {
                        //play sound
                        game.audioplayer.bleep.play();
                        //set start speed
                        this.speed = this.START_SPEED;
                    }
                    
                    //check for top and bottom collision with canvas
                    if (this.getTop() <= 0) {
                        this.setTop(1);
                        this.bounce(Math.PI/2);
                    }
                    else if (this.getBottom() >= game.HEIGHT) {
                        this.setBottom(game.HEIGHT - 1);
                        this.bounce(3*Math.PI/2)
                    }
                    
                    //if the ball leaves to the left
                    if (this.getLeft() <= 0) {
                        //play sound
                        game.audioplayer.bleep.play();
                        //add score
                        screen_game.score.P2.increase();
                        //reboot puck and players
                        this.reboot();
                        screen_game.player.reboot();
                        screen_game.opponent.reboot();
                    }
                    //if the ball leaves to the right
                    else if (this.getRight() >= game.WIDTH) {
                        //play sound
                        game.audioplayer.bleep.play();
                        //add score
                        screen_game.score.P1.increase();
                        //reboot puck and players
                        this.reboot();
                        screen_game.player.reboot();
                        screen_game.opponent.reboot();
                    }
                    
                    //check for collision with player
                    if (this.getLeft() <= screen_game.player.getRight() && this.getBottom() >= screen_game.player.position && this.getTop() <= screen_game.player.getBottom()) {
                        //bounce on player
                        this.setLeft(screen_game.player.getRight() + 1);
                        //create spread factor from hit position on the player
                        var spread_factor = ((this.center.y - screen_game.player.position) / screen_game.player.HEIGHT)* 2 - 1;
                        //limit spread factor
                        if (spread_factor < -1) {
                            spread_factor = -1;
                        }
                        else if (spread_factor > 1) {
                            spread_factor = 1;
                        }
                        //calculate bounce normal based on spread factor
                        var bounce_normal = spread_factor * this.SPREAD_ANGLE;
                        //bounce the ball!
                        this.playerBounce(bounce_normal);
                        //turbo speed!
                        if (spread_factor < -0.5 || spread_factor > 0.5) {
                            this.speed += this.SPEED_STEP;
                            }
                        
                    }
                    //check for collision with opponent
                    if (this.getRight() >= screen_game.opponent.getLeft() && this.getBottom() >= screen_game.opponent.position && this.getTop() <= screen_game.opponent.getBottom()) {
                        //bounce on player
                        this.setRight(screen_game.opponent.getLeft() - 1);
                        //create spread factor from hit position on the opponent
                        var spread_factor = ((this.center.y - screen_game.opponent.position) / screen_game.opponent.HEIGHT)* 2 - 1;
                        //limit spread factor
                        if (spread_factor < -1) {
                            spread_factor = -1;
                        }
                        else if (spread_factor > 1) {
                            spread_factor = 1;
                        }
                        //calculate bounce normal based on spread factor
                        var bounce_normal = -spread_factor * this.SPREAD_ANGLE;
                        //bounce the ball!
                        this.playerBounce(bounce_normal);
                        //turbo speed!
                        if (spread_factor < -0.5 || spread_factor > 0.5) {
                            this.speed += this.SPEED_STEP;
                            }
                        
                    }
                    
                    //increment center position
                    this.center.x += this.speed * Math.cos(this.angle);
                    this.center.y += this.speed * Math.sin(this.angle);
                },
                'draw': function () {
                    game.ctx.fillStyle = "white";
                    game.ctx.beginPath();
                    game.ctx.arc(
                        this.center.x, this.center.y,
                        this.SIZE/2, 0, 2*Math.PI);
                    game.ctx.closePath();
                    game.ctx.fill();
                    
                    
                },
            },
            
            'oponent': null,
            
            'computer': {
                
                'MARGIN': 15,
                'WIDTH': 15,
                'HEIGHT': 80,
                'ACCELERATION': 0.7,
                'MAX_SPEED': 8,
                'TURBO_SPEED': 2,
                
                'position': 0,
                'speed': 0,
                
                //variable space for computer player
                'space': function() {
                    return (this.HEIGHT/2)*Math.random() + (this.HEIGHT*3* Math.random()) / game.difficulty;
                },
                
                'getBottom': function () {
                    return this.position+this.HEIGHT;
                },
                
                'getLeft': function() {
                    return game.WIDTH - (this.MARGIN + this.WIDTH);
                },
                
                'init': function () {},
                'reboot': function () {
                    //set initial position
                    this.position = game.HEIGHT/2 - this.HEIGHT/2;
                    this.speed = 0;
                },
                'update': function () {
                    
                    var screen_game = game.screen_game;
                    
                    //define current speed based on puck position
                    //puck above opponent
                    if (screen_game.puck.center.y - this.position-this.space() < 0) {
                        this.speed -= this.ACCELERATION;
                    }
                    //puck below opponent
                    else if (screen_game.puck.center.y - this.position+this.space() >= 0) {
                        this.speed += this.ACCELERATION;
                    }
                    else if (this.speed > 0) {
                        if (this.speed >= this.ACCELERATION) {
                            this.speed -= this.ACCELERATION;
                        }
                        else {
                            this.speed = 0;
                        }
                    }
                    else if (this.speed < 0) {
                        if (this.speed <= this.ACCELERATION) {
                            this.speed += this.ACCELERATION;
                        }
                        else {
                            this.speed = 0;
                        }
                    }
                    
                    else {
                        this.speed = 0;
                    }
                    
                    //speed limit
                    if (this.speed > this.MAX_SPEED) {
                        this.speed = this.MAX_SPEED;
                    }
                    else if (this.speed < -this.MAX_SPEED) {
                        this.speed = -this.MAX_SPEED;
                    }
                    
                    //increment position
                    this.position += this.speed;
                    
                    //limit position
                    if (this.position < 0) {
                        this.position = 0;
                        this.speed = 0;
                    }
                    else if (this.getBottom() > game.HEIGHT) {
                        this.position = game.HEIGHT-this.HEIGHT;
                        this.speed = 0;
                    }
                
                },
                'draw': function () {
                    game.ctx.fillStyle = "white";
                    game.ctx.fillRect(game.WIDTH - (this.MARGIN + this.WIDTH), this.position, this.WIDTH, this.HEIGHT);
                },
            },
            
            'player2': {
                
                'MARGIN': 15,
                'WIDTH': 15,
                'HEIGHT': 80,
                'ACCELERATION': 0.7,
                'MAX_SPEED': 8,
                'TURBO_SPEED': 2,
                
                'position': 0,
                'speed': 0,
                
                'getBottom': function () {
                    return this.position+this.HEIGHT;
                },
                
                'getLeft': function() {
                    return game.WIDTH - (this.MARGIN + this.WIDTH);
                },
                
                'init': function () {},
                'reboot': function () {
                    //set initial position
                    this.position = game.HEIGHT/2 - this.HEIGHT/2;
                    this.speed = 0;
                },
                'update': function () {
                    var screen_game = game.screen_game;
                    
                    //define current speed based on keyboard
                    if (game.keyboard.up) {
                        this.speed -= this.ACCELERATION;
                    }
                    else if (game.keyboard.down) {
                        this.speed += this.ACCELERATION;
                    }
                    else if (this.speed > 0) {
                        if (this.speed >= this.ACCELERATION) {
                            this.speed -= this.ACCELERATION;
                        }
                        else {
                            this.speed = 0;
                        }
                    }
                    else if (this.speed < 0) {
                        if (this.speed <= this.ACCELERATION) {
                            this.speed += this.ACCELERATION;
                        }
                        else {
                            this.speed = 0;
                        }
                    }
                    
                    else {
                        this.speed = 0;
                    }
                    
                    //speed limit
                    if (this.speed > this.MAX_SPEED) {
                        this.speed = this.MAX_SPEED;
                    }
                    else if (this.speed < -this.MAX_SPEED) {
                        this.speed = -this.MAX_SPEED;
                    }
                    
                    //increment position
                    this.position += this.speed;
                    
                    //limit position
                    if (this.position < 0) {
                        this.position = 0;
                        this.speed = 0;
                    }
                    else if (this.getBottom() > game.HEIGHT) {
                        this.position = game.HEIGHT-this.HEIGHT;
                        this.speed = 0;
                    }
                
                },
                'draw': function () {
                    game.ctx.fillStyle = "white";
                    game.ctx.fillRect(game.WIDTH - (this.MARGIN + this.WIDTH), this.position, this.WIDTH, this.HEIGHT);
                },
            },
            
            'score': {
                
                'P1': {
                    'value': 0,
                    'increase': function () {
                        this.value += 1;
                    },
                },
                'P2': {
                    'value': 0,
                    'increase': function () {
                        this.value += 1;
                    },
                },
                
                'FONT_SIZE': 35,
                'DISTANCE': 30,
                'MARGIN': 5,
                
                'init': function () {},
                'reboot': function () {
                    //reset score to 0
                    this.P1.value = 0;
                    this.P2.value = 0;
                },
                'update': function () {
                    //check if score for either player == 10 and prompt endgame
                    if (this.P1.value == 10 || this.P2.value == 10) {
                        game.current_screen = game.screen_end;
                        //init screen_game
                        game.current_screen.reboot();
                    }
                },
                'draw': function () {
                    //set the font and distance to the top
                    var font = this.FONT_SIZE + "px Courier New";
                    var margin = this.FONT_SIZE + this.MARGIN;
                    
                    //draw the score
                    game.ctx.font = font;
                    game.ctx.textAlign = "center";
                    game.ctx.fillText(this.P1.value, (game.WIDTH/2 - this.DISTANCE), margin);
                    game.ctx.fillText(this.P2.value, (game.WIDTH/2 + this.DISTANCE), margin);
                    
                },
            },
        }, //end game screen
        
        'screen_end': {
            
            'MAX_TIME': 80,
            'ms': 0,
            'restart': true,
            
            'p1': {
                'score': null,
                'name': null,
            },
            
            'p2': {
                'score': null,
                'name': null,
            },
            
            'reboot': function() {
                //bring values from screen_game
                this.p1.score = game.screen_game.score.P1.value;
                this.p2.score = game.screen_game.score.P2.value;
                this.p1.name = "Player 1";
                
                //set player 2's name
                if (game.screen_game.opponent == game.screen_game.computer) {
                    this.p2.name = "Hal 9000";
                }
                else {
                    this.p2.name = "Player 2";
                }
                
            },
            
            'update': function() {
                //increase miliseconds count
                this.ms++;
                //blink "insert coin" sign if count is high enough
                if (this.ms >= this.MAX_TIME) {
                    //reset count
                    this.ms = 0;
                    //switch states for message display
                    if (this.restart) {
                        this.restart = false;
                    }
                    else {
                        this.restart = true;
                        //play sound
                        game.audioplayer.bleep.play();
                    }
                    //reset count
                    this.ms = 0;
                }
            },
            
            'draw': function() {
                
                game.ctx.clearRect(0, 0, game.WIDTH, game.HEIGHT);
                
                //text properties
                game.ctx.fillStyle = "white";
                game.ctx.lineWidth = 6;
                game.ctx.font = "80px Courier New";
                game.ctx.textAlign = "center";

                //writes game over and score
                game.ctx.fillText("GAME OVER", game.WIDTH/2, 0.25 * game.HEIGHT + 45);
                game.ctx.fillText(this.p1.score+ " x " + this.p2.score, game.WIDTH/2, game.HEIGHT/2 + 80);
                
                //gets winner name based on score
                game.ctx.font = "30px Courier New";
                if (this.p1.score > this.p2.score) {
                    game.ctx.fillText(this.p1.name + " wins!", game.WIDTH/2, 0.38 * game.HEIGHT + 45);
                }
                else {
                    game.ctx.fillText(this.p2.name + " wins!", game.WIDTH/2, 0.38 * game.HEIGHT + 45);
                }
                
                //restart message
                if (this.restart) {
                    game.ctx.font = "20px Courier New";
                    game.ctx.fillText("<Press 'R' to restart>", game.WIDTH/2, 0.9 * game.HEIGHT);
                }
            },
            
        },
    
        'signs': {
            'showPause': function () {
                
                //sign properties
                var WIDTH = 270;
                var HEIGHT = 60;
                
                game.ctx.strokeStyle = "white";
                game.ctx.fillStyle = "black";
                game.ctx.lineWidth = 6;
                
                //draw rectangle
                game.ctx.beginPath();
                game.ctx.rect(game.WIDTH/2-WIDTH/2, game.HEIGHT/2-HEIGHT/2, WIDTH, HEIGHT);
                game.ctx.fill();
                game.ctx.stroke();
                
                //font properties
                game.ctx.fillStyle = "white";
                game.ctx.textAlign = "center";
                game.ctx.font = "30px Courier New";
                //draw text
                game.ctx.fillText("GAME PAUSED", game.WIDTH/2, game.HEIGHT/2 + 10);
                
                game.ctx.closePath();
            },
        },
        
        
    };
    
    game.init();

};