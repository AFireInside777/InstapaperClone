function sendLink(){
    var newlink = $('#linkshit').val();
    var newlink = JSON.stringify(newlink)
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
    post.id = "forerase"

    var picandinfo = document.createElement("div");
    picandinfo.style.display = "flex";
    picandinfo.style.padding = "2px"
    post.appendChild(picandinfo)

    var postpic = document.createElement("div");
    postpic.style.minWidth = "187px";
    postpic.style.minHeight= "125px";
    postpic.style.marginRight = "1px";
    postpic.style.borderRightStyle = "solid";
    postpic.style.borderColor = "red";

    var pic = document.createElement("img");
    pic.src = postarray[0]
    pic.style.maxWidth = "186px";
    pic.style.maxHeight = "125px"
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
    article.appendChild(articlepreview);
    infobox.appendChild(article);

    var notes = document.createElement("TEXTAREA");
    notes.style.width = "99%";
    notes.style.height ="70px";
    notes.style.overflow = "auto";
    notes.style.bottom = "100px"
    notes.style.borderStyle = "dotted"
    post.appendChild(notes);
    /*find out how to expand texte area automatically with each new line.*/
    /*Give the TextArea an ID, and then send to a function*/
    /*put buttons under div for hide*/
    /*For word count thing, have an array keep all word counts, then adjust height accordingly*/
    /*Make an event listener for all text areas.*/
    /*For every 20 or so words, expand the textarea, or every 400 letters*/
    /*infobox.appendChild(postauthoranddate);*/
    var bookmarklane = document.getElementById("bookmarkandlink");
    bookmarklane.appendChild(post);

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
    link.style.display = "flex"

    var linktext = document.createElement("TEXTAREA")
    linktext.style.wordWrap = "soft"
    linktext.style.height = "18px"
    linktext.style.resize = "none"
    linktext.style.width = "719px"
    linktext.id = "linkshit";
    link.appendChild(linktext)

    var button = document.createElement("input");
    button.style.display = "absolute";
    button.style.height = "24px"
    button.type = "submit";
    button.value = "Upload"
    button.onclick = function(){sendLink()};
    link.appendChild(button)

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