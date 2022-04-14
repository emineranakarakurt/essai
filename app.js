const ws = new WebSocket("ws://xu@vm-sdc-09.icube.unistra.fr:8081");

        const userId = JSON.stringify({
            header:"REQUEST_CLIENT_ID"
        });
        
        var getImg;
        var uid;
        var result;
        var parsed;
        

        ws.addEventListener("open", () => {
            ws.send(userId);
        });

        ws.addEventListener('message',function(event){
            parsed = JSON.parse(event.data);
            if (parsed.clientId === undefined){
                if (parsed.idData === undefined){
                    result = parsed.base64File;
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

                    //Ecouteur d'évenements pour les boutons de zoom
                    
                    zoomBtn.addEventListener('click', function(){
                        if(zoomScale < 15){
                            image.style.scale = zoomScale++;
                            console.log(zoomScale);
                        }
                    });
                    dezoomBtn.addEventListener('click', function(){
                        if(zoomScale > 0){
                            image.style.scale = zoomScale--;
                            console.log(zoomScale);
                        }
                    });
                }
                else {
                    getImg = JSON.stringify({
                        idMessage: parsed.clientId,
                        doRescale: false,
                        clientId: uid,
                        header: "GET_BUFFER_IMAGE"
                    });
                }
            }
            else{
                uid = String(parsed.clientId);
                getImg = JSON.stringify({
                    checksum: "0333ff8c224366dac05ba154f2c6e4d9",
                    isLaunchOrthoRect: false,
                    fileName: "070992.tif",
                    overWrite: false,
                    clientId: uid,
                    header: "OPEN_IMAGE"
                });
            }
            if (parsed.base64File === undefined){
                ws.send(getImg);
            }
        });
        

        /*****************INTERACTION UTILISATEUR******************/
        var zoomBtn = document.querySelector("#zoom");
        var dezoomBtn = document.querySelector("#dezoom");
        var imageCarte = document.querySelector("#carte");

        
        

 