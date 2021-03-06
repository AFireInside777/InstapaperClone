var noteandidlist = []
var notetransferlist = []
var notes

function collectnotes(){
    for (notearray of noteandidlist){
        if (notearray[1].value == false){
            notetransferlist.push([notearray[0], "Nothing"])
        } else {
            notetransferlist.push([notearray[0], notearray[1].value])
        }
    }
    if (notetransferlist.length > 0){
        $.ajax({
            url: '/updatenotes',
            datatype: "text",
            data: JSON.stringify(notetransferlist),
            type: 'POST',
            success: function(response){
                alert(response)
                location.reload()
            },
            error: function(error){
                console.log(error);
            }
        });
    }
    
}

function sendLink(){
    var newlink = $('#linkshit').val();
    var newlink = JSON.stringify(newlink)
    grandpostarray = []
    $('#linkshit').val('');
    $.ajax({
        url: '/processlink',
        datatype: "json",
        data: newlink,
        type: 'POST',
        success: function(response){
            console.log(response)
            location.reload()
        },
        error: function(error){
            console.log(error);
        }
    });
}

function processlink(postarray) {

    var post = document.createElement("div");
    post.style.backgroundColor = "white"
    post.style.maxWidth = "782px";
    post.style.marginBottom = "4px"
    post.style.borderStyle = "solid"
    post.style.borderColor = "blue"
    post.style.display = "flex"
    post.style.flexDirection = "column"
    post.id = postarray[5]

    var picandinfo = document.createElement("div");
    picandinfo.style.display = "flex";
    picandinfo.style.flexDirection = "row"
    picandinfo.style.padding = "2px"
    post.appendChild(picandinfo)

    var postpic = document.createElement("div");
    postpic.style.minWidth = "187px";
    postpic.style.minHeight= "110px";
    postpic.style.marginRight = "1px";
    postpic.style.borderRightStyle = "solid";
    postpic.style.borderColor = "red";

    var pic = document.createElement("img");
    pic.src = postarray[0]
    pic.style.maxWidth = "186px";
    pic.style.maxHeight = "110px"
    postpic.appendChild(pic);

    picandinfo.appendChild(postpic);

    var infobox = document.createElement("div");
    infobox.style.width = "600px"
    infobox.style.display = "block";
    picandinfo.appendChild(infobox);

    var posttitle = document.createElement("div");
    posttitle.innerHTML = (postarray[1]);
    posttitle.style.height = "25%"
    posttitle.style.whiteSpace = "nowrap"
    
    infobox.appendChild(posttitle);

    var postdate = document.createElement("div");
    postdate.style.height = "25%"
    postdate.innerHTML = (postarray[2]);
    infobox.appendChild(postdate); 

    var postlink = document.createElement("div");
    var sentlink = document.createTextNode(postarray[3]);
    postlink.style.height = "25%"
    postlink.style.overflow = "hidden"
    postlink.style.whiteSpace = "nowrap"
    postlink.appendChild(sentlink);
    infobox.appendChild(postlink);

    var article = document.createElement("div");
    var articlepreview = document.createTextNode(postarray[4]);
    article.style.height = "25%"
    article.style.whiteSpace = "nowrap"
    article.style.verticalAlign = "bottom"
    article.appendChild(articlepreview);
    infobox.appendChild(article);

    notes = document.createElement("TEXTAREA");
    notes.style.width = "99.1%";
    notes.style.height ="70px";
    notes.style.overflow = "auto";
    notes.style.bottom = "100px"
    notes.style.borderStyle = "dotted"
    notes.style.resize = "vertical"
    notes.id = postarray[5]
    notes.innerHTML = postarray[6]
    post.appendChild(notes);
    var bookmarklane = document.getElementById("bookmarkandlink");
    bookmarklane.appendChild(post);
    
    console.log(postarray[6])

    noteandidlist.push([notes.id, notes])
}

function MainDisplay(){

    var origindiv = document.createElement("div");
    origindiv.id = "bookmarkandlink"
    origindiv.style.border = "solid";
    origindiv.style.width = "800px"
    origindiv.style.height = "565px"
    origindiv.style.margin = "auto"
    origindiv.style.overflow = "hidden"
    origindiv.style.overflowY = "scroll"

    var link = document.createElement("div")
    link.style.marginBottom = "2px";
    link.style.border = "solid";
    link.style.display = "flex"
    link.style.flexDirection = "column"
    link.style.alignItems = "stretch"

    var linktext = document.createElement("TEXTAREA")
    linktext.style.wordWrap = "soft"
    linktext.style.resize = "none"
    linktext.style.width = "99.1%"
    linktext.id = "linkshit";
    link.appendChild(linktext)

    var button = document.createElement("input");
    button.style.height = "100%"
    button.type = "submit";
    button.value = "Scrape Link"
    link.appendChild(button)
    button.onclick = function(){sendLink()};

    var button2 = document.createElement("input");
    button2.style.height = "24px"
    button2.type = "submit";
    button2.value = "Update Notes on Posts"
    link.appendChild(button2)
    button2.onclick = function(){collectnotes()};

    origindiv.appendChild(link);
    document.body.appendChild(origindiv)

    function retrivedb(){
        $.ajax({
            url: '/collect',
            datatype: "json",
            type: 'GET',
            success: function(response){
                if (Array.isArray(response)){
                    response.forEach(processlink)
                } else {
                    console.log(response)
                }
                                
            },
        });
    }
    retrivedb()

}

MainDisplay()
