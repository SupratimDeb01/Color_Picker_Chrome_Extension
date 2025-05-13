const pickerbtn=document.querySelector("#picker-btn");
const exportbtn=document.querySelector("#export-btn");
const clear=document.querySelector("#clear-btn");
const colorlist=document.querySelector(".all-colors");
const prev=document.querySelector(".code");
const prevup=document.querySelector(".prev");
const copy=document.querySelector(".copy");

let pickedcolors=JSON.parse(localStorage.getItem("color-list"))  ||[];

let currentpopup=null;

const updatecodebox=(color="#ffffff")=>{
    prev.textContent=color;
    prevup.style.backgroundColor=color;
}

const copytoclipboard = async(text,element)=>{ 
    try{
        await navigator.clipboard.writeText(text); //will wait until copying to clipboar is completed
        element.innerText="Copied!"; // after copying it will display a msg as "copied!"
        setTimeout(() =>{
            element.innerText=text;
        },1000);//after 1sec the "copied!" part will reset to normal.
    }
    catch(err){
        alert("Failed to copy text!");
    }
}
const exportcolor=()=>{
    const colortext=pickedcolors.join("\n"); //Joins all colors in the array into a single string, each on a new line.
    const blob=new Blob([colortext],{type:"text/plain"}); //Creates a Blob (binary large object) representing the string as a text file.
    const url=URL.createObjectURL(blob); //Creates a temporary URL pointing to the blob object — a downloadable link.
    const a=document.createElement("a");//Dynamically creates an <a> tag.
    a.href=url;
    a.download='colors.txt';//Sets the filename for download when the link is clicked.
    document.body.appendChild(a);//Adds the link to the document so it can be clicked.
    a.click();//Simulates a click on the link — triggers the download.
}
const createcolorpopup=(color)=>{
    const popup=document.createElement("div");
    popup.classList.add("color-popup");
    popup.innerHTML=`
    <div class="color-popup-content">
    <span class="close-popup">x</span>
    <div class="color-info">
    <div class="color-preview" style="background: ${color}; border: 1px solid ${color === "#ffffff" ? "#797979ab" : color}"></div>
    <div class="color-details">
    <div class="color-value">
    <span class="label">HEX:</span>
    <span class="value Hex" data-color="${color}">${color}</span>
    </div>
    <div class="color-value">
    <span class="label">RGB:</span>
    <span class="value RGB" data-color="${color}">${hextorgb(color)}</span>
    </div>
    </div>
    </div>
    </div>
    `;

    // Close button inside the popup
    const closePopup = popup.querySelector(".close-popup");
    closePopup.addEventListener('click', () => {
        document.body.removeChild(popup);
        currentpopup = null;
    });
  
      // Event listeners to copy color values to clipboard
      const colorValues = popup.querySelectorAll(".value");
      colorValues.forEach((value) => {
          value.addEventListener('click', (e) => {
              const text = e.currentTarget.innerText;
              copytoclipboard(text, e.currentTarget);
          });
      });
  
      return popup;
}

const showcolor=()=>{
    colorlist.innerHTML=pickedcolors.map((color)=>
    `
    <li class="color">
    <span class="rect" data-color="${color}" style="background: ${color}; border: 1px solid ${color === "#ffffff" ? "#797979ab" : color}"></span>
    </li>
    `
).join("")
const colorelements= document.querySelectorAll(".color");
colorelements.forEach((element) =>{
    const colorbox= element.querySelector(".rect");
    colorbox.addEventListener('click',(e)=>{
        const color=e.currentTarget.dataset.color; //When you access .dataset on that element, JavaScript automatically turns all data-* attributes into properties of the dataset object.
        if(currentpopup){
            document.body.removeChild(currentpopup);
        }
        const popup=createcolorpopup(color);
        document.body.appendChild(popup);
        currentpopup=popup
        updatecodebox(color);
    })
})
const pickedcolorcontainer=document.querySelector(".color-list");
pickedcolorcontainer.classList.toggle("hide",pickedcolors.length === 0)
}
const hextorgb=(hex)=>{
    const bigint=parseInt(hex.slice(1),16);
    const r=(bigint >> 16)&255;
    const g=(bigint >> 8)&255;
    const b=bigint &255;
    return `rgb(${r},${g},${b})`;
}

const activateEyeDropper = async () => {
    document.body.style.display = "none";
    try {
        const { sRGBHex } = await new EyeDropper().open();

        if (!pickedcolors.includes(sRGBHex)) {
            pickedcolors.push(sRGBHex);
            localStorage.setItem("color-list", JSON.stringify(pickedcolors));
        }

        updatecodebox(pickedcolors[pickedcolors.length - 1] || "#ffffff");
        showcolor();
    } catch (error) {
        alert(error);
    } finally {
        document.body.style.display = "block";
    }
};

const clearAll = () => {
    pickedcolors = [];
    localStorage.removeItem("color-list");
    prev.textContent="#ffffff";
    prevup.style.backgroundColor="#ffffff";
    showcolor();
}

pickerbtn.addEventListener('click',activateEyeDropper);
clear.addEventListener('click',clearAll);
exportbtn.addEventListener('click',exportcolor);

copy.addEventListener('click',async()=>{
    const currhex=prev.textContent.trim(); //using trim to remove any white space if exists
    try{
    await navigator.clipboard.writeText(currhex);
    prev.textContent="Copied!";
    setTimeout(()=>{
        prev.textContent=currhex;
    },1000);
}
catch(error){
   alert("Failed to copy text!");
}
})

showcolor();
updatecodebox(pickedcolors[pickedcolors.length - 1] || "#ffffff");
