const game = document.getElementById("game");
const world = document.getElementById("world");

const player = document.getElementById("player");
const npc = document.getElementById("npc");

const prompt = document.getElementById("prompt");
const dialogue = document.getElementById("dialogue");

const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 1200;

const PLAYER = 64;
const NPC = 64;

let px = 800;
let py = 600;

const nx = 120;
const ny = 120;

const speed = 4;

let talking = false;
let near = false;

const keys = {};

document.addEventListener("keydown",(e)=>{

    const k=e.key.toLowerCase();

    if(k==="e"){

        if(near){

            talking=!talking;

            dialogue.style.display=talking?"block":"none";

        }

        return;

    }

    keys[k]=true;

});

document.addEventListener("keyup",(e)=>{

    keys[e.key.toLowerCase()]=false;

});

function collision(ax,ay,bx,by){

    return (

        ax < bx+NPC &&
        ax+PLAYER > bx &&
        ay < by+NPC &&
        ay+PLAYER > by

    );

}

function gameLoop(){

    if(!talking){

        let x=px;
        let y=py;

        if(keys["w"]) y-=speed;
        if(keys["s"]) y+=speed;
        if(keys["a"]) x-=speed;
        if(keys["d"]) x+=speed;

        x=Math.max(0,Math.min(WORLD_WIDTH-PLAYER,x));
        y=Math.max(0,Math.min(WORLD_HEIGHT-PLAYER,y));

        if(!collision(x,y,nx,ny)){

            px=x;
            py=y;

        }

    }

    player.style.left=px+"px";
    player.style.top=py+"px";

    npc.style.left=nx+"px";
    npc.style.top=ny+"px";

    const dx=(px+32)-(nx+32);
    const dy=(py+32)-(ny+32);

    near=Math.sqrt(dx*dx+dy*dy)<120;

    if(near&&!talking){

        prompt.style.display="block";

        prompt.style.left=(nx+20)+"px";
        prompt.style.top=(ny-25)+"px";

    }else{

        prompt.style.display="none";

    }

    let camX=px-400+32;
    let camY=py-300+32;

    camX=Math.max(0,Math.min(WORLD_WIDTH-800,camX));
    camY=Math.max(0,Math.min(WORLD_HEIGHT-600,camY));

    world.style.transform=`translate(${-camX}px,${-camY}px)`;

    requestAnimationFrame(gameLoop);

}

gameLoop();
