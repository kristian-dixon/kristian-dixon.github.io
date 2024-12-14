let sendToDemo = function(call, value){ 
    let frame = document.getElementById("demo-frame");
    frame.contentWindow.postMessage({call:call,value:value});
}



let postContentContainer = document.getElementById('page-content');
let navigationWrapper = document.getElementById('navigation-wrapper');

//Handling the side panel show/ hide behaviour
let ShowPost = function(){
    postContentContainer.classList.remove('post-hidden');
    navigationWrapper.classList.add('navigation-hidden');

    var controlButtons = document.getElementsByClassName('post-controls');
    for(let i = 0; i< controlButtons.length; ++i){
        controlButtons[i].style.transitionDelay = (0.15 + i * 0.15)+'s';
        controlButtons[i].classList.remove('post-controls-hidden');
    }
}

let HidePost = function(){
    postContentContainer.classList.add('post-hidden');
    navigationWrapper.classList.remove('navigation-hidden');

    var controlButtons = document.getElementsByClassName('post-controls');
    for(let i = 0; i< controlButtons.length; ++i){
        controlButtons[i].style.transitionDelay = ((controlButtons.length - i) * 0.15)+'s';
        controlButtons[i].classList.add('post-controls-hidden');
    }
}

let showPostBtn = document.getElementById("show_post_btn");
if(showPostBtn)
    showPostBtn.onclick = ShowPost;

let hidePostBtn = document.getElementById("hide-post-btn");
if(hidePostBtn)
    hidePostBtn.onclick = HidePost;



//Handling pagnation
let changePage = (ctx)=>{ 
    
    let pageIndex = ctx.getAttribute("data-page-index");
    if(!pageIndex)
        return;

    let pages = document.getElementsByClassName("pagnated-page-wrapper");
    for(let i = 0; i < pages.length; i++)
    {
        let page = pages[i];

        if(page.getAttribute("data-page-index") == pageIndex)
        {
            page.classList.remove("hidden");

            //let onStateEntered pages[i].getAttribute("data-on-state-entered")
            let cmdType = page.getAttribute("data-cmd-call");
            if(cmdType)
            {
                sendToDemo(cmdType, page.getAttribute("data-cmd-args"));
            }
        }
        else
        {
            page.classList.add("hidden")
        }
    }
}

let pageBtns = document.getElementsByClassName("post-controls");
for(let i = 0; i < pageBtns.length; i++)
{
    let btn = pageBtns[i];
    btn.addEventListener('click', ()=>{
        changePage(btn);

        for(let j= 0; j < pageBtns.length; j++){
            if(pageBtns[j] != btn){
                pageBtns[j].classList.remove('active');
            }
        }
        btn.classList.add('active');
    })

    if(i == 0){
        btn.classList.add('active');
    }
}

let inPostButtons = document.getElementsByClassName("in-post-inputfield");

for(let i = 0; i < inPostButtons.length; i++)
{
    let btn = inPostButtons[i];

    btn.addEventListener('input',(x)=>{
        if(btn.type == 'file')
        {
            let modelUrl = URL.createObjectURL( btn.files[0] );
            sendToDemo(btn.getAttribute('data-cmd-call'), modelUrl)
        }
        else if(btn.type == "checkbox")
        {
            sendToDemo(btn.getAttribute('data-cmd-call'), btn.checked);
        }
        else
        {
            sendToDemo(btn.getAttribute('data-cmd-call'), btn.value);
        }
    })
}


//Workaround for IOS bug
// window.addEventListener('contextmenu', function(e){
//     sendToDemo('event:contextmenu', e);
//     e.preventDefault();
// })

// window.addEventListener('pointerdown', function(e){
//     console.log('JUMBO')
//     console.log(e);
//     sendToDemo('event:pointerdown', {
//         pointerId: e.pointerId,
//         clientX: e.clientX,
//         clientY: e.clientY
//     }
//     );
// })

// window.addEventListener('pointerup', (e)=>{
//     sendToDemo('event:pointerup', {
//         pointerId: e.pointerId,
//         clientX: e.clientX,
//         clientY: e.clientY
//     });
// })

// window.addEventListener('pointermove', (e)=>{
//     sendToDemo('event:pointermove', {
//         pointerId: e.pointerId,
//         clientX: e.clientX,
//         clientY: e.clientY
//     });
// })

// window.addEventListener('pointercancel', (e)=>{
//     sendToDemo('event:pointercancel', {
//         pointerId: e.pointerId,
//         clientX: e.clientX,
//         clientY: e.clientY
//     });
// })