var limpiar = document.getElementById("limpiar");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var cw = canvas.width = 300, cx = cw /2;
var ch = canvas.height = 300, cy = ch /2;

var dibujar = false;
var factorDeAlisamiento = 5;
var Trazados = [];
var puntos =[];

//agrega un evento para limpiar el canvas
limpiar.addEventListener('click',function(){
    dibujar = false;
    ctx.clearRect(0.0.cw,ch);//limpia el canvas
    Trazados.length = 0; //se vacia el historial de trazos
    puntos.length = 0; //se vacia el historial de puntos 
},false);

//agrega un evento para iniciar el dibujo
canvas.addEventListener('mousedown',function(){
    dibujar = true;
    puntos.length = 0;
    ctx.beginPath();
},false);
//agrega un evento para retomar de donde el usuario dejo de presionar el raton
canvas.addEventListener('mouseup',redibujarTrazados,false);
//agrega un evento para retomar cuando el puntero se sale del canvas
canvas.addEventListener('mouseout',redibujarTrazados,false);
//agrega un evento continuo al mover el raton
canvas.addEventListener('mousemove',function(evt){
    if(dibujar){
        var m = oMousePos(canvas,evt); // obtener la pos del puntero del raton
        puntos.push(m); // almacena la posicion del puntero del raton en un arreglo
        ctx.lineTo(m.x,m.y); //dibujar una linea desde el punto creacdo hasta el punto actual
        ctx.stroke(); //crea el dibujo
    }
},false);

function reducirArray(n,elArray){
    let nuevoArray = elArray.filter((_,i) => i % n === 0);//filtran  los puntos en cada n posiciones
    nuevoArray.push(elArray[elArray.length-1]); // adds last point into 
    Trazados.push(nuevoArray);//se guarda el trazado hecho, en el arreglo de trazados
}

//funcion para calcular el punto de control en la curva de alisamiento
function calcularPuntoDeControl(ry,a,b){
   return{
    x : (ry[a].x + ry[b].x)/2,
    x : (ry[a].y + ry[b].y)/2,
   }
    
}

function alisarTrazado(ry){
    if(ry.length > 1){ //SE VERIFICA QUE EXISTAN MAS DE 1 PUNTO PARA REALIZAR EL TRAZADO
        var ultimoPunto = ry.length -1;
        ctx.beginPath();
        ctx.moveTo(ry[0].x, ry[0].y); //Iniciar el trazado desde el primero punto establecido

    for (let i = 1; i<ry.length - 2; i++){
        let pc = calcularPuntoDeControl(ry,i,i+1);//calcula el punto de control
        ctx.quadraticCurveTo(ry[i].x, ry[i].y, pc.x, pc.y);//dibuja la curva, desde el punto de control actual hasta el punto de control
    }

    ctx.quadraticCurveTo(ry[ultimoPunto -1].x, ry[ultimoPunto -1].y,ry[ultimoPunto].x,ry[ultimoPunto].y);
    ctx.stroke();
    }
}

function redibujarTrazados(){
    dibujar = false;
    ctx.clearRect(0,0,cw,ch);
    reducirArray(factorDeAlisamiento,puntos); //reducir la cantidad de puntos
    Trazados.forEach(trazado => alisarTrazado(trazado)); //suavizar y redibujar los trazos
}

function oMousePos(canvas,evt){
    let rect =canvas.getBoundingClientRect(); //    Se pbtienen los limites del canvas
    return{
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    };
}
