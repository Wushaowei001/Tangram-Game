//BlockWidth is 20 and in other places its directly coded as 20.
//Board currently has 15 rows and 15 columns where the victory area is a 4x3 rectangle.

var totalOffsetX=0;
var totalOffsetY=0;
var levelScore=0;
var modeLevels = [1,1,1];
var currentMode=0;
var currentLevel=0;

var creationGameMode=-1; //Do not modify this.
var creationLevel=-1; //Do not modify this

var Piece= cc.Class.extend({
	color:"blue",
	blockWidth:20,
	basePositionX:0,
	basePositionY:0,
	madeUpCount:0,
	pieceNumber:0,
	ctor:function(x,y,pieceNo){
		this.basePositionX=x;
		this.basePositionY=y;
		this.pieceNumber=pieceNo;
		// Custom initialization
	},
	positionarr:[],
	rotatedarr:[],
	oldarr:[],
	spriteBlocks:[],
	initpositionarr:function(posarr){
		this.positionarr=new Array(3);
		this.oldarr=new Array(3);
		this.rotatedarr=new Array(3);
		this.spriteBlocks=new Array(3);
		for(i=0;i<3;i++){
			this.oldarr[i]=new Array(3);
			this.spriteBlocks[i]= new Array(3);
			this.rotatedarr[i]=new Array(3);
			this.positionarr[i]=new Array(3);
			for(j=0;j<3;j++){
				if(posarr[i][j]==1){
					this.madeUpCount+=1;
					this.spriteBlocks[i][j]=  new cc.Sprite.create(res.HelloWorld_png);
					this.positionarr[i][j]=1;
					this.spriteBlocks[i][j].setPosition(new cc.p(totalOffsetX+this.blockWidth*(i+this.basePositionX),totalOffsetY+this.blockWidth*(j+this.basePositionY)));
					this.spriteBlocks[i][j].setScale(20/this.spriteBlocks[i][j].getContentSize().width,20/this.spriteBlocks[i][j].getContentSize().height);	
					this.spriteBlocks[i][j].setAnchorPoint(new cc.p(0,0));
				}
				else
					this.positionarr[i][j]=0;
			}
		}
	},
	getpositionX:function(){
		return this.basePositionX;
	},
	getpositionY:function(){
		return this.basePositionY;
	},
	checkPiece:function(a,b,boardObj){ //a=x and b=y coordinates so arr[a][b] would be how we check
		//x axis is rows and y axis is columns.

		//Rows are vertical 
		//Columns are horizontal

		//cc.log(a);
		//cc.log(b);
		var state=0;
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				if(i+a<0)
					state=1;
				else if(i+a>=15)
					state=1;
				else if(j+b<0)
					state=1;
				else if(j+b>=15)
					state=1;
				else if(boardObj.positionarr[i+a][j+b]!=-1 && boardObj.positionarr[i+a][j+b]!=this.pieceNumber && this.positionarr[i][j]==1){
					state=1;
					cc.log("FAILED to PLACE");
				}
			}
		}
		if(state==0){
			cc.log("SUCCESS");
			return 1;
		}
		else
			return 0;
	},
	placePiece:function(a,b,boardObj){
		if(this.checkPiece(a,b,boardObj)==1){
			for(i=0;i<3;i++){
				for(j=0;j<3;j++){
					if(this.positionarr[i][j]==1){
						boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=-1;
					}
				}
			}
			this.basePositionX=a;
			this.basePositionY=b;
			for(i=0;i<3;i++){
				for(j=0;j<3;j++){
					if(this.positionarr[i][j]==1){
						var actionMove = cc.MoveTo.create(0, cc.p(totalOffsetX+this.blockWidth*(i+this.basePositionX),totalOffsetY+this.blockWidth*(j+this.basePositionY)));
						this.spriteBlocks[i][j].runAction(actionMove);
						boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=this.pieceNumber;
					}
				}
			}
		}
		//for(i=0;i<15;i++){
		//	cc.log(boardObj.positionarr[i]);
		//}
	},
	rotatePiece:function(dir,boardObj){
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				this.oldarr[i][j]=this.positionarr[i][j];
				this.rotatedarr[i][j]=this.positionarr[2-j][i];
			}
		}
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				this.positionarr[i][j]=this.rotatedarr[i][j];
			}
		}
		if(this.checkPiece(this.basePositionX,this.basePositionY,boardObj)==1){
			for(i=0;i<3;i++){
				for(j=0;j<3;j++){
					if(this.oldarr[i][j]==1){
						boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=-1;
					}
				}
			}
			for(i=0;i<3;i++){
				for(j=0;j<3;j++){
					if(this.positionarr[i][j]==1){
						boardObj.positionarr[i+this.basePositionX][j+this.basePositionY]=this.pieceNumber;
					}
				}
			}
		}
		else{
			for(i=0;i<3;i++){
				for(j=0;j<3;j++){
					this.positionarr[i][j]=this.oldarr[i][j];
				}
			}
		}
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				if(this.positionarr[i][j]==1){
					this.spriteBlocks[i][j]=  new cc.Sprite.create(res.HelloWorld_png);
					this.spriteBlocks[i][j].setPosition(new cc.Point(totalOffsetX+this.blockWidth*(i+this.basePositionX),totalOffsetY+this.blockWidth*(j+this.basePositionY)));
					this.spriteBlocks[i][j].setScale(20/this.spriteBlocks[i][j].getContentSize().width,20/this.spriteBlocks[i][j].getContentSize().height);	
					this.spriteBlocks[i][j].setAnchorPoint(new cc.p(0,0));
				}
			}
		}
	}
});

var Board = cc.Class.extend({
	positionarr:[],
	spriteBlocks:[],
	belongPieces:[],
	countArray:[],
	victoryArray:[],
	ctor:function(victoryposition){
		this.initpositionarr(victoryposition);
		// Custom initialization
	},
	initpositionarr:function(victoryposition){
		this.positionarr=new Array(15);
		this.spriteBlocks=new Array(15);
		this.belongPieces=new Array(15);
		this.countArray=new Array(15);
		for(i=0;i<15;i++){
			this.spriteBlocks[i]= new Array(15);
			this.positionarr[i]=new Array(15);
			this.victoryArray[i]=new Array(15);
			for(j=0;j<15;j++){
				if(victoryposition[i][j]==1){
					this.victoryArray[i][j]=1;
					this.spriteBlocks[i][j]= new cc.Sprite.create(res.PlaceBoard_png);
				}
				else{
					this.victoryArray[i][j]=0;
					this.spriteBlocks[i][j]= new cc.Sprite.create(res.Board_png);
				}
				this.positionarr[i][j]=-1;
				this.spriteBlocks[i][j].setPosition(new cc.p(totalOffsetX+20*i,totalOffsetY+20*j));
				this.spriteBlocks[i][j].setScale(20/this.spriteBlocks[i][j].getContentSize().width,20/this.spriteBlocks[i][j].getContentSize().height);
				this.spriteBlocks[i][j].setAnchorPoint(new cc.p(0,0));
			}
		}
	},
	checkVictory:function(){
		for(i=0;i<15;i++){
			this.countArray[i]=0;
		}
		for(i=0;i<15;i++){
			for(j=0;j<15;j++){
				if(this.victoryArray[i][j]==1){
					if(this.positionarr[i][j]==-1){
						return 0;
					}
					this.countArray[this.positionarr[i][j]]+=1;
				}
			}
		}
		for(i=0;i<15;i++){
			if(this.countArray[i]!=0){
				if(this.countArray[i]!=this.belongPieces[i].madeUpCount){
					return 0;
				}
			}
		}
		return 1;
	}
//	add your properties and functions
});

var GameMode1Layer = cc.Layer.extend({
	sprite:null,
	ctor:function (board,pieceList,noOfPieces) {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size=cc.winSize;
		currentMode=1;
		levelScore=0;
		/////////////////////////////
		// 2. add a menu item with "X" image, which is clicked to quit the program
		//    you may modify it.
		// ask the window size


		//(0,0) is the bottom left point.
		for(i=0;i<15;i++){
			for(j=0;j<15;j++){
				this.addChild(board.spriteBlocks[i][j]);
			}
		}
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				for(k=0;k<noOfPieces;k++){
					if(pieceList[k].positionarr[i][j]==1){
						this.addChild(pieceList[k].spriteBlocks[i][j]);
					}
				}
			}
		}
		for(k=0;k<noOfPieces;k++){
			pieceList[k].placePiece(pieceList[k].basePositionX,pieceList[k].basePositionY,board);
		}	
		var recentPiece=0;
		var clickOffsetXBlock=0;
		var clickOffsetYBlock=0;
		var originalBaseX=0;
		var originalBaseY=0;
		var pieceSelected=-1;
		var reference=this;
		
		if (cc.sys.capabilities.hasOwnProperty('keyboard')){
			cc.eventManager.addListener(
					{
						event: cc.EventListener.KEYBOARD,
						onKeyPressed:function(key,event){
							if(key==68){
								levelScore+=1;
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[recentPiece].positionarr[i][j]==1){
											reference.removeChild(pieceList[recentPiece].spriteBlocks[i][j]);
										}
									}
								}
								pieceList[recentPiece].rotatePiece(0,board);
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[recentPiece].positionarr[i][j]==1){
											reference.addChild(pieceList[recentPiece].spriteBlocks[i][j]);
										}
									}
								}
							}
							if(board.checkVictory()==1){
								cc.log("YOU WIN!");
								cc.director.runScene(new WinScene());
							}
						}
					},this);
		}
		
		if (cc.sys.capabilities.hasOwnProperty('mouse')){ //Set up mouse events
			cc.eventManager.addListener(
					{
						event: cc.EventListener.MOUSE,
						onMouseDown:function(event){
							if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
								for(k=0;k<noOfPieces;k++){
									//cc.log(event.getLocationX());
									if(pieceSelected==-1){
										clickOffsetXBlock=0;
										clickOffsetYBlock=0;
									}
									var click=cc.p(event.getLocationX(),event.getLocationY());
									var x=Math.floor((event.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((event.getLocationY()-totalOffsetY)/20);
									cc.log(x + " " + y + " Clicked at")
									for(i=0;i<3;i++){
										for(j=0;j<3;j++){
											if(pieceList[k].positionarr[i][j]==1 && cc.rectContainsPoint(new cc.Rect(totalOffsetX+(pieceList[k].basePositionX+i)*20,totalOffsetY+(pieceList[k].basePositionY+j)*20,20,20),click)){
												originalBaseX=pieceList[k].basePositionX;
												originalBaseY=pieceList[k].basePositionY;
												pieceSelected=k;
												recentPiece=k;
												clickOffsetXBlock=i;
												clickOffsetYBlock=j;
											}
										}
									}
									//cc.log("Left mouse clicked at "+event.getLocationX());
								}
							}
						},
						onMouseMove: function (event) {         
							//Move the position of current button sprite
							if(pieceSelected!=-1){
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[pieceSelected].positionarr[i][j]==1){
											var target=pieceList[pieceSelected].spriteBlocks[i][j].getPosition();
											var delta = event.getDelta();
											target.x += delta.x;
											target.y += delta.y;
											pieceList[pieceSelected].spriteBlocks[i][j].setPosition(target);
										}
									}
								}
							}
						},
						onMouseUp:function(event){
							if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
								if(pieceSelected!=-1){
									var x=Math.floor((event.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((event.getLocationY()-totalOffsetY)/20);
									cc.log(x+" "+y);
									cc.log((x-clickOffsetXBlock) + " " + (y-clickOffsetYBlock) + " Left at")
									if(pieceList[pieceSelected].checkPiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board)==1){
										pieceList[pieceSelected].placePiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board);
										levelScore+=1;
									}
									else{
										pieceList[pieceSelected].placePiece(originalBaseX,originalBaseY,board);
									}
									pieceSelected=-1;
								}
								if(board.checkVictory()==1){
									cc.log("YOU WIN!");
									cc.director.runScene(new WinScene());
								}
								//cc.log("Left mouse released at "+event.getLocationX());
							}
						}

					}, this);
		}
		var menuItem = new cc.MenuItemFont("Back", goToMenu);
		var menu = new cc.Menu(menuItem);
		menu.alignItemsVerticallyWithPadding(50);
		menu.setPosition(cc.p(size.width/2,size.height/2-180))
		this.addChild(menu);
		return true;
	}
});

var GameMode2Layer = cc.Layer.extend({
	sprite:null,
	ctor:function (board,pieceList,noOfPieces) {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size=cc.winSize;
		currentMode=2;
		levelScore=0;
		for(i=0;i<15;i++){
			for(j=0;j<15;j++){
				this.addChild(board.spriteBlocks[i][j]);
			}
		}
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				for(k=0;k<noOfPieces;k++){
					if(pieceList[k].positionarr[i][j]==1){
						this.addChild(pieceList[k].spriteBlocks[i][j]);
					}
				}
			}
		}
		for(k=0;k<noOfPieces;k++){
			pieceList[k].placePiece(pieceList[k].basePositionX,pieceList[k].basePositionY,board);
		}
		//var actionmove = cc.MoveTo.create(1, cc.p(300,300));
		//piece.spriteBlocks[0][0].runAction(actionmove);
		//piece.placePiece(1,4,board);
		//piece2.placePiece(6,7,board);

		var recentPiece=0;
		var clickOffsetXBlock=0;
		var clickOffsetYBlock=0;
		var originalBaseX=0;
		var originalBaseY=0;
		var pieceSelected=-1;
		var reference=this;

		if (cc.sys.capabilities.hasOwnProperty('keyboard')){
			cc.eventManager.addListener(
					{
						event: cc.EventListener.KEYBOARD,
						onKeyPressed:function(key,event){
							if(key==68){
								levelScore+=1;
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[recentPiece].positionarr[i][j]==1){
											reference.removeChild(pieceList[recentPiece].spriteBlocks[i][j]);
										}
									}
								}
								pieceList[recentPiece].rotatePiece(0,board);
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[recentPiece].positionarr[i][j]==1){
											reference.addChild(pieceList[recentPiece].spriteBlocks[i][j]);
										}
									}
								}
							}
							if(board.checkVictory()==1){
								cc.log("YOU WIN!");
								cc.director.runScene(new WinScene());
							}
						}
					},this);
		}
		
		if (cc.sys.capabilities.hasOwnProperty('mouse')){ //Set up mouse events
			cc.eventManager.addListener(
					{
						event: cc.EventListener.MOUSE,
						onMouseDown:function(event){
							if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
								for(k=0;k<noOfPieces;k++){
									//cc.log(event.getLocationX());
									if(pieceSelected==-1){
										clickOffsetXBlock=0;
										clickOffsetYBlock=0;
									}
									var click=cc.p(event.getLocationX(),event.getLocationY());
									var x=Math.floor((event.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((event.getLocationY()-totalOffsetY)/20);
									cc.log(x + " " + y + " Clicked at")
									for(i=0;i<3;i++){
										for(j=0;j<3;j++){
											if(pieceList[k].positionarr[i][j]==1 && cc.rectContainsPoint(new cc.Rect(totalOffsetX+(pieceList[k].basePositionX+i)*20,totalOffsetY+(pieceList[k].basePositionY+j)*20,20,20),click)){
												originalBaseX=pieceList[k].basePositionX;
												originalBaseY=pieceList[k].basePositionY;
												pieceSelected=k;
												recentPiece=k;
												clickOffsetXBlock=i;
												clickOffsetYBlock=j;
											}
										}
									}
									//cc.log("Left mouse clicked at "+event.getLocationX());
								}
							}
						},
						onMouseMove: function (event) {         
							//Move the position of current button sprite
							if(pieceSelected!=-1){
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[pieceSelected].positionarr[i][j]==1){
											var target=pieceList[pieceSelected].spriteBlocks[i][j].getPosition();
											var delta = event.getDelta();
											target.x += delta.x;
											target.y += delta.y;
											pieceList[pieceSelected].spriteBlocks[i][j].setPosition(target);
										}
									}
								}
							}
						},
						onMouseUp:function(event){
							if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
								if(pieceSelected!=-1){
									var x=Math.floor((event.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((event.getLocationY()-totalOffsetY)/20);
									cc.log(x+" "+y);
									cc.log((x-clickOffsetXBlock) + " " + (y-clickOffsetYBlock) + " Left at")
									if(pieceList[pieceSelected].checkPiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board)==1){
										pieceList[pieceSelected].placePiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board);
										levelScore+=1;
									}
									else{
										pieceList[pieceSelected].placePiece(originalBaseX,originalBaseY,board);
									}
									pieceSelected=-1;
								}
								if(board.checkVictory()==1){
									cc.log("YOU WIN!");
									cc.director.runScene(new WinScene());
								}
								//cc.log("Left mouse released at "+event.getLocationX());
							}
						}

					}, this);
		}
		var menuItem = new cc.MenuItemFont("Back", goToMenu);
		var menu = new cc.Menu(menuItem);
		menu.alignItemsVerticallyWithPadding(50);
		menu.setPosition(cc.p(size.width/2,size.height/2-180))
		this.addChild(menu);
		return true;
	}
});

var GameMode3Layer = cc.Layer.extend({
	sprite:null,
	ctor:function (board,pieceList,noOfPieces) {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size=cc.winSize;
		levelScore=0;
		currentMode=3;
		for(i=0;i<15;i++){
			for(j=0;j<15;j++){
				this.addChild(board.spriteBlocks[i][j]);
			}
		}
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				for(k=0;k<noOfPieces;k++){
					if(pieceList[k].positionarr[i][j]==1){
						this.addChild(pieceList[k].spriteBlocks[i][j]);
					}
				}
			}
		}
		for(k=0;k<noOfPieces;k++){
			pieceList[k].placePiece(pieceList[k].basePositionX,pieceList[k].basePositionY,board);
		}
		//var actionmove = cc.MoveTo.create(1, cc.p(300,300));
		//piece.spriteBlocks[0][0].runAction(actionmove);
		//piece.placePiece(1,4,board);
		//piece2.placePiece(6,7,board);

		var recentPiece=0;
		var clickOffsetXBlock=0;
		var clickOffsetYBlock=0;
		var originalBaseX=0;
		var originalBaseY=0;
		var pieceSelected=-1;
		var reference=this;

		if (cc.sys.capabilities.hasOwnProperty('keyboard')){
			cc.eventManager.addListener(
					{
						event: cc.EventListener.KEYBOARD,
						onKeyPressed:function(key,event){
							if(key==68){
								levelScore+=1;
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[recentPiece].positionarr[i][j]==1){
											reference.removeChild(pieceList[recentPiece].spriteBlocks[i][j]);
										}
									}
								}
								pieceList[recentPiece].rotatePiece(0,board);
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[recentPiece].positionarr[i][j]==1){
											reference.addChild(pieceList[recentPiece].spriteBlocks[i][j]);
										}
									}
								}
							}
							if(board.checkVictory()==1){
								cc.log("YOU WIN!");
								cc.director.runScene(new WinScene());
							}
						}
					},this);
		}
		
		if (cc.sys.capabilities.hasOwnProperty('mouse')){ //Set up mouse events
			cc.eventManager.addListener(
					{
						event: cc.EventListener.MOUSE,
						onMouseDown:function(event){
							if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
								for(k=0;k<noOfPieces;k++){
									//cc.log(event.getLocationX());
									if(pieceSelected==-1){
										clickOffsetXBlock=0;
										clickOffsetYBlock=0;
									}
									var click=cc.p(event.getLocationX(),event.getLocationY());
									var x=Math.floor((event.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((event.getLocationY()-totalOffsetY)/20);
									cc.log(x + " " + y + " Clicked at")
									for(i=0;i<3;i++){
										for(j=0;j<3;j++){
											if(pieceList[k].positionarr[i][j]==1 && cc.rectContainsPoint(new cc.Rect(totalOffsetX+(pieceList[k].basePositionX+i)*20,totalOffsetY+(pieceList[k].basePositionY+j)*20,20,20),click)){
												originalBaseX=pieceList[k].basePositionX;
												originalBaseY=pieceList[k].basePositionY;
												pieceSelected=k;
												recentPiece=k;
												clickOffsetXBlock=i;
												clickOffsetYBlock=j;
											}
										}
									}
									//cc.log("Left mouse clicked at "+event.getLocationX());
								}
							}
						},
						onMouseMove: function (event) {         
							//Move the position of current button sprite
							if(pieceSelected!=-1){
								for(i=0;i<3;i++){
									for(j=0;j<3;j++){
										if(pieceList[pieceSelected].positionarr[i][j]==1){
											var target=pieceList[pieceSelected].spriteBlocks[i][j].getPosition();
											var delta = event.getDelta();
											target.x += delta.x;
											target.y += delta.y;
											pieceList[pieceSelected].spriteBlocks[i][j].setPosition(target);
										}
									}
								}
							}
						},
						onMouseUp:function(event){
							if (event.getButton() == cc.EventMouse.BUTTON_LEFT){
								if(pieceSelected!=-1){
									var x=Math.floor((event.getLocationX()-totalOffsetX)/20);
									var y=Math.floor((event.getLocationY()-totalOffsetY)/20);
									cc.log(x+" "+y);
									cc.log((x-clickOffsetXBlock) + " " + (y-clickOffsetYBlock) + " Left at")
									if(pieceList[pieceSelected].checkPiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board)==1){
										pieceList[pieceSelected].placePiece(x-clickOffsetXBlock,y-clickOffsetYBlock,board);
										levelScore+=1;
									}
									else{
										pieceList[pieceSelected].placePiece(originalBaseX,originalBaseY,board);
									}
									pieceSelected=-1;
								}
								if(board.checkVictory()==1){
									cc.log("YOU WIN!");
									cc.director.runScene(new WinScene());
								}
								//cc.log("Left mouse released at "+event.getLocationX());
							}
						}

					}, this);
		}
		var menuItem = new cc.MenuItemFont("Back", goToMenu);
		var menu = new cc.Menu(menuItem);
		menu.alignItemsVerticallyWithPadding(50);
		menu.setPosition(cc.p(size.width/2,size.height/2-180))
		this.addChild(menu);
		return true;
	}
});

var MenuLayer = cc.Layer.extend({
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size = cc.winSize;
		var sprite = new cc.Sprite.create(res.Board_png);
		sprite.setAnchorPoint(cc.p(0.5,0.5));
		sprite.setPosition(cc.p(size.width/2,size.height/2));
		sprite.setScaleX(0.5);
		sprite.setScaleY(0.2);
		var menuItem1 = new cc.MenuItemFont("Play Mode 1", startGameMode1);
		var menuItem2 = new cc.MenuItemFont("Play Mode 2", startGameMode2);
		var menuItem3 = new cc.MenuItemFont("Play Mode 3", startGameMode3);
		var menuItem4 = new cc.MenuItemFont("View Scores", viewScores);
		var menuItem5 = new cc.MenuItemFont("View Achievements", viewAchievements);
		var menuItem6 = new cc.MenuItemFont("Quit", quitGame);
		var menu = new cc.Menu(menuItem1,menuItem2,menuItem3,menuItem4,menuItem5,menuItem6);
		menu.alignItemsVerticallyWithPadding(50);
		this.addChild(menu);
		return true;
	}
});

var LevelLayer = cc.Layer.extend({
	ctor:function (gameMode) {
		//////////////////////////////
		// 1. super init first
		this._super();
		cc.log(gameMode);
		var size = cc.winSize;
		var menuItems = new Array(modeLevels[gameMode-1]);
		for(i=0;i<modeLevels[gameMode-1];i++){
			j=i+1;
			menuItems[i] = new cc.MenuItemFont("Level "+j.toString(), 
				function() {  
					if(gameMode==1){
						if(j==1)
							cc.director.runScene(new GameMode1Scene1());
					}
					if(gameMode==2){
						if(j==1)
							cc.director.runScene(new GameMode2Scene1());
					}
					if(gameMode==3){
						if(j==1)
							cc.director.runScene(new GameMode3Scene1());
					}  
				}
			);
		}
		var menu = new cc.Menu(menuItems[0]);
		//menu.initWithItems(menuItems);
		menu.alignItemsVerticallyWithPadding(50);
		this.addChild(menu);
		return true;
	}
});


var viewScores=function(){
	cc.director.runScene(new ScoreScene());
}

var viewAchievements=function(){
	cc.director.runScene(new AchievementScene());
}

var quitGame=function(){
	cc.log("Exit game");
}

var startGameMode1=function(){
	creationGameMode=1;
	cc.director.runScene(new LevelScene());
}

var startGameMode2=function(){
	creationGameMode=2;
	cc.director.runScene(new LevelScene());
}

var startGameMode3=function(){
	creationGameMode=3;
	cc.director.runScene(new LevelScene());
}

var ScoreLayer = cc.Layer.extend({
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size = cc.winSize;
		var ls= cc.sys.localStorage;
		var value;
		var players=Object.keys(ls);
		var temp;
		var start=0;
		for(temp=0;temp<players.length;temp++){
			value=ls.getItem(players[temp]);
			if(value!=null && players[temp]!="#Achievements" && players[temp]!="#Names"){
				var label = new cc.LabelTTF(players[temp]+ " " +value,"Arial");
				label.setFontSize(10);
				label.setPosition(cc.p(size.width/2,size.height/2-50+start*20));
				this.addChild(label);
				start+=1;
			}
		}
		var menuItem = new cc.MenuItemFont("Back", goToMenu);
		var menu = new cc.Menu(menuItem);
		menu.alignItemsVerticallyWithPadding(50);
		menu.setPosition(cc.p(size.width/2,size.height/2-170))
		this.addChild(menu);
		return true;
	},
});

var goToMenu=function(){
	cc.director.runScene(new MenuScene());
}

var AchievementLayer = cc.Layer.extend({
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size = cc.winSize;
		var ls= cc.sys.localStorage;
		var value;
		var list = new Array(100);
		var names = new Array(100);
		for(i=0;i<100;i++){
			list[i] = new Array(100);
		}
		//If you want to reset the achievements and names, remove the if statement below and view the achievements page.
		if(ls.getItem("#Achievements")==null || ls.getItem("#Names")==null){
			ls.setItem("#Names",JSON.stringify(names)); //We use JSON to store arrays as strings.
			ls.setItem("#Achievements",JSON.stringify(list)); //We use JSON to store arrays as strings.
		}
		names=JSON.parse(ls.getItem("#Names"));
		list=JSON.parse(ls.getItem("#Achievements"));
		cc.log(list);
		var temp;
		var state=0;
		for(temp=0;temp<list.length;temp++){
			state=0;
			for(temp2=0;temp2<list[temp].length;temp2++){
				if(list[temp][temp2]!=null){
					if(state==0){
						var label = new cc.LabelTTF(names[temp],"Arial");
						label.setFontSize(10);
						label.setPosition(cc.p(size.width/2-300,size.height/2-50+temp*20));
						this.addChild(label);
						state=1;
					}
					var label2 = new cc.LabelTTF(list[temp][temp2],"Arial");
					label2.setFontSize(10);
					label2.setPosition(cc.p(size.width/2-300+(temp2+1)*100,size.height/2-50+temp*20));
					this.addChild(label2);
				}
			}
		}
		var menuItem = new cc.MenuItemFont("Back", goToMenu);
		var menu = new cc.Menu(menuItem);
		menu.alignItemsVerticallyWithPadding(50);
		menu.setPosition(cc.p(size.width/2,size.height/2-170))
		this.addChild(menu);
		return true;
	},
});

var WinLayer = cc.Layer.extend({
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size = cc.winSize;
		var sprite = new cc.Sprite.create(res.Youwin_png);
		sprite.setAnchorPoint(cc.p(0.5,0.5));
		sprite.setPosition(cc.p(size.width/2,size.height/2));
		sprite.setScaleX(0.5);
		sprite.setScaleY(0.5);
		this.addChild(sprite);
		textField = new ccui.TextField();
		textField.setTouchEnabled(true);
		textField.fontName = "Marker Felt";
		textField.placeHolder = "Enter your name here";
		textField.fontSize = 30;
		textField.x = size.width/2;
		textField.y = size.height/2+100;
		textField.addEventListener(this.textFieldEvent, this);
		var label = new cc.LabelTTF(30-levelScore, "Lobster", 28);
		label.setPosition(cc.p(size.width/2,size.height/2-70));
		this.addChild(label);
		this.addChild(textField);
		return true;
	},
	
	textFieldEvent: function(sender, type){
		switch (type)
		{
			case ccui.TextField.EVENT_ATTACH_WITH_IME:
				cc.log("Activate");
				
				break;
			case ccui.TextField.EVENT_DETACH_WITH_IME:
				var ls = cc.sys.localStorage;
				var cur = ls.getItem(textField.string);
				if(cur==null || cur<30-levelScore ){
					ls.setItem(textField.string,30-levelScore);
				}
				var addedState=0;
				if(currentLevel==modeLevels[currentMode-1]){
					var list=JSON.parse(ls.getItem("#Achievements"));
					var names=JSON.parse(ls.getItem("#Names"));
					for(i=0;i<list.length && addedState==0;i++){
						if(names[i]==null || names[i]==textField.string){
							names[i]=textField.string;
							for(j=0;j<list[i].length;j++){
								if(list[i][j]==null || list[i][j]=="Completed Mode "+currentMode.toString()){
									list[i][j]="Completed Mode "+currentMode.toString();
									addedState=1;
									break;
								}
							}
						}
					}
					ls.setItem("#Names",JSON.stringify(names));
					ls.setItem("#Achievements",JSON.stringify(list));
				}
				cc.director.runScene(new MenuScene());

				break;
			case ccui.TextField.EVENT_INSERT_TEXT:
				cc.log("Inserted");
				cc.log(textField.string);

				break;
			case ccui.TextField.EVENT_DELETE_BACKWARD:
				cc.log("Delete");
				cc.log(textField.string);
				
				break;
		}
	}
});

var LevelScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer6 = new LevelLayer(creationGameMode);
		this.addChild(layer6);
	}
});

var ScoreScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer5 = new ScoreLayer();
		this.addChild(layer5);
	}
});

var AchievementScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer6 = new AchievementLayer();
		this.addChild(layer6);
	}
});

var MenuScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new MenuLayer();
		this.addChild(layer);
	}
});


var WinScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer2 = new WinLayer();
		this.addChild(layer2);
	}
});


var GameMode1Scene1 = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var size=cc.winSize;
		currentMode=1;
		currentLevel=1;
		totalOffsetX=size.width/2-150;
		totalOffsetY=size.height/2-150;
		var boardarray=new Array(15);
		for(i=0;i<15;i++){
			boardarray[i]=new Array(15);
			for(j=0;j<15;j++){
				boardarray[i][j]=0;
			}
		}
		for(i=4;i<8;i++){
			for(j=4;j<7;j++){
				boardarray[i][j]=1;
			}
		}
		var board = new Board(boardarray);
		var pieceList = new Array(5);
		var noOfPieces=2;
		var piece = new Piece(1,0,0);
		var piece2 = new Piece(10,5,1);
		board.belongPieces[0]=piece;
		board.belongPieces[1]=piece2;
		//Convention belongPieces[i] should have piece whose pieceNumber is i
		var arr=new Array(3);
		var arr2=new Array(3);
		for(i=0;i<3;i++){
			arr[i]=new Array(3);
			arr2[i]=new Array(3);
			for(j=0;j<3;j++){
				arr2[i][j]=1;
			}
		}
		arr[0][0]=1;
		arr[0][1]=1;
		arr[0][2]=1;
		piece.initpositionarr(arr);
		piece2.initpositionarr(arr2);
		pieceList[0]=piece;
		pieceList[1]=piece2;
		var layer2 = new GameMode1Layer(board,pieceList,2);
		this.addChild(layer2);
	}
});

var GameMode2Scene1 = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var size=cc.winSize;
		currentMode=2;
		currentLevel=1;
		totalOffsetX=size.width/2-150;
		totalOffsetY=size.height/2-150;
		/////////////////////////////
		// 2. add a menu item with "X" image, which is clicked to quit the program
		//    you may modify it.
		// ask the window size


		//(0,0) is the bottom left point.
		var boardarray=new Array(15);
		for(i=0;i<15;i++){
			boardarray[i]=new Array(15);
			for(j=0;j<15;j++){
				boardarray[i][j]=0;
			}
		}
		for(i=4;i<8;i++){
			for(j=4;j<7;j++){
				boardarray[i][j]=1;
			}
		}
		var board = new Board(boardarray);
		//var board = new BoardSprite(res.CloseSelected_png,cc.rect(300,300,200,200));
		var pieceList = new Array(5);
		var noOfPieces=3;
		var piece = new Piece(1,0,0);
		var piece2 = new Piece(10,5,1);
		var piece3 = new Piece(12,1,2);
		board.belongPieces[0]=piece;
		board.belongPieces[1]=piece2;
		board.belongPieces[2]=piece3;
		//var piece3 = new Piece(7,1,2);
		var arr=new Array(3);
		var arr2=new Array(3);
		var arr3=new Array(3);
		for(i=0;i<3;i++){
			arr[i]=new Array(3);
			arr2[i]=new Array(3);
			arr3[i]=new Array(3);
			for(j=0;j<3;j++){
				arr2[i][j]=1;
			}
		}
		arr[0][0]=1;
		arr[0][1]=1;
		arr[0][2]=1;
		arr3[0][0]=1;
		arr3[0][1]=1;
		arr3[0][2]=1;
		arr3[1][0]=1;
		arr3[2][0]=1;
		piece.initpositionarr(arr);
		piece2.initpositionarr(arr2);
		piece3.initpositionarr(arr3);
		pieceList[0]=piece;
		pieceList[1]=piece2;
		pieceList[2]=piece3;
		var layer3=new GameMode2Layer(board,pieceList,3);
		this.addChild(layer3);
	}
});

var GameMode3Scene1 = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var size=cc.winSize;
		currentMode=3;
		currentLevel=1;
		totalOffsetX=size.width/2-150;
		totalOffsetY=size.height/2-150;
		/////////////////////////////
		// 2. add a menu item with "X" image, which is clicked to quit the program
		//    you may modify it.
		// ask the window size


		//(0,0) is the bottom left point.
		var boardarray=new Array(15);
		for(i=0;i<15;i++){
			boardarray[i]=new Array(15);
			for(j=0;j<15;j++){
				boardarray[i][j]=0;
			}
		}
		for(i=4;i<8;i++){
			for(j=4;j<7;j++){
				boardarray[i][j]=1;
			}
		}
		for(i=9;i<13;i++){
			for(j=9;j<12;j++){
				boardarray[i][j]=1;
			}
		}
		var board = new Board(boardarray);
		//var board = new BoardSprite(res.CloseSelected_png,cc.rect(300,300,200,200));
		var pieceList = new Array(5);
		var noOfPieces=4;
		var piece = new Piece(1,0,0);
		var piece2 = new Piece(10,5,1);
		var piece3 = new Piece(12,1,2);
		var piece4 = new Piece(2,10,3);
		board.belongPieces[0]=piece;
		board.belongPieces[1]=piece2;
		board.belongPieces[2]=piece3;
		board.belongPieces[3]=piece4;
		//var piece3 = new Piece(7,1,2);
		var arr=new Array(3);
		var arr2=new Array(3);
		var arr3=new Array(3);
		var arr4=new Array(3);
		for(i=0;i<3;i++){
			arr[i]=new Array(3);
			arr2[i]=new Array(3);
			arr3[i]=new Array(3);
			arr4[i]=new Array(3);
			for(j=0;j<3;j++){
				arr2[i][j]=1;
			}
		}
		arr[0][0]=1;
		arr[0][1]=1;
		arr[0][2]=1;
		arr3[0][0]=1;
		arr3[0][1]=1;
		arr3[0][2]=1;
		arr3[1][0]=1;
		arr3[2][0]=1;
		arr4[1][1]=1;
		arr4[1][2]=1;
		arr4[2][1]=1;
		arr4[2][2]=1;
		arr4[0][1]=1;
		arr4[0][2]=1;
		arr4[2][0]=1;
		piece.initpositionarr(arr);
		piece2.initpositionarr(arr2);
		piece3.initpositionarr(arr3);
		piece4.initpositionarr(arr4);
		pieceList[0]=piece;
		pieceList[1]=piece2;
		pieceList[2]=piece3;
		pieceList[3]=piece4;
		var layer4=new GameMode3Layer(board,pieceList,4);
		this.addChild(layer4);
	}
});