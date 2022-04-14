//Lancement du serveur Websocket
const ws = new WebSocket("ws://xu@vm-sdc-09.icube.unistra.fr:8081");

//Récupération du UserID
const userId = JSON.stringify({
    header:"REQUEST_CLIENT_ID"
});

//Affiche et zoom, dézoom sur l'image
function afficheZoomImg(){
    //Création de l'image
    var image = document.createElement('img');
    var divImage = document.createElement('div');
    var imageSrc = 'data:image/png;base64,' + result;
    image.src = imageSrc;
    document.body.appendChild(divImage);
    divImage.appendChild(image);

    /////////////////////////////////////
    //Fonctionnalité de zoom dans l'image
    ////////////////////////////////////
    var zoomScale = 1;
    let pos = { top: 0, left: 0, x: 0, y: 0 };

    const mouseDownHandler = function (e) {
        pos = {
            left: divImage.scrollLeft,
            top: divImage.scrollTop,
            // position actuel du curseur
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = function (e) {
        // distance entre curseur et déplacement
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroller divImage vers la nouvelle position
        divImage.scrollTop = pos.top - dy;
        divImage.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = function () {
        divImage.style.cursor = 'grab';

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    divImage.addEventListener('mousedown', mouseDownHandler);

    console.log('zoom actuel ', zoomScale);
    //Ecouteur d'évenements pour les boutons de zoom
    zoomBtn.addEventListener('click', function(){
        if(zoomScale < 15){
            zoomScale++;
            image.style.scale = zoomScale;
            console.log(zoomScale);
        }
    });
    dezoomBtn.addEventListener('click', function(){
        if(zoomScale > 1){
            zoomScale--;
            image.style.scale = zoomScale;
            console.log(zoomScale);
        }
    });
}

//Variables utilisés dans la boucle
var getImg;
var uid;
var result;
var parsed;
var zoomBtn = document.querySelector("#zoom");
var dezoomBtn = document.querySelector("#dezoom");
var imageCarte = document.querySelector("#carte");


//Requêtes Websocket 

//Récupère le user id
ws.addEventListener("open", () => {
    ws.send(userId);
});

//Récupère le data lorsqu'il reçoit un message
ws.addEventListener('message',function(event){
    parsed = JSON.parse(event.data);
    switch (parsed.header){
        case "REQUEST_CLIENT_ID":
            uid = String(parsed.clientId);
            
            getImg = JSON.stringify({
                checksum: "0333ff8c224366dac05ba154f2c6e4d9",
                isLaunchOrthoRect: false,
                fileName: "070992.tif",
                overWrite: false,
                clientId: uid,
                header: "OPEN_IMAGE"
            }); 
            ws.send(getImg); 
                break;
        case "OPEN_IMAGE_RESPONSE":
            getImg = JSON.stringify({
                idMessage: parsed.clientId,
                doRescale: false,
                clientId: uid,
                header: "GET_BUFFER_IMAGE"
            }); 
            ws.send(getImg); 
                break;
        case "BUFFERED_IMAGE":
            result = parsed.base64File; 
            afficheZoomImg();
                break;
        default: 
            break;
    }
});


        

        
        

 