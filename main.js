/*
 Ryan Cantone
 Project 4
 VFW 1306
 6-27-13
 */


window.addEventListener("DOMContentLoaded", function doItAll(){

    function $(e){
        var elementID = document.getElementById(e);
        return elementID;
    }

    function makeSelect(){
        var formTag = document.getElementsByTagName("form"),
            selectLi = $("select"),
            makeSelect = document.createElement("select");
        makeSelect.setAttribute("id", "weapons");
        for(var i = 0, j = weaponType.length; i < j; i++){
            var makeOption = document.createElement("option");
            var optText = weaponType[i];
            makeOption.setAttribute("value", optText);
            makeOption.innerHTML = optText;
            makeSelect.appendChild(makeOption);
        }
        selectLi.appendChild(makeSelect);
    }

    function getRadio(){
        var radios = document.forms[0].deadly;
        for(var i = 0; i < radios.length; i++){
            if (radios[i].checked){
                deadlyValue = radios[i].value;
            }
        }
    }

    function getCheckbox(){
        if($('fav').checked){
            favoriteValue = $('fav').value;
        } else {
            favoriteValue = "No"
        }
    }


    function toggleControls(n){
        switch(n){
            case "on":
                $("weaponForm").style.display = "none";
                $('clearData').style.display = "inline";
                $("displayData").style.display = "none";
                $("addNew").style.display = "inline";
                break;
            case "off":
                $("weaponForm").style.display = "block";
                $('clearData').style.display = "inline";
                $("displayData").style.display = "inline";
                $("addNew").style.display = "none";
                $("items").style.display = "none";
                break;
            default:
                return false;
        }
    }

    function validate(e){
        var getWeaponName = $("wn");
        var getWeaponCategory = $("weapons");

        errMsg.innerHTML = "";
        getWeaponName.style.border = "1px solid black";
        getWeaponCategory.style.border = "1px solid black";

        var messageArray = [];

        if(getWeaponName.value === ""){
            var weaponNameError = "Please enter the weapon's name.";
            getWeaponName.style.border = "2px solid red";
            messageArray.push(weaponNameError);
        }

        if(getWeaponCategory.value === "--Weapon Category--"){
            var weaponCategoryError = "Please choose a weapon category.";
            getWeaponCategory.style.border = "2px solid red";
            messageArray.push(weaponCategoryError);
        }

        if(messageArray.length >= 1){
            for(var i = 0, j = messageArray.length; i < j; i++){
                var text = document.createElement("li");
                text.innerHTML = messageArray[i];
                errMsg.appendChild(text);
            }
            e.preventDefault();
            return false;
        } else {
            storeData(this.key);
        }
    }

    function storeData(key){
        if(!key){
            var id = Math.floor(Math.random()*100000001);
        } else {
            id = key;
        }
        getRadio();
        getCheckbox();
        var item = {};
        item.weaponName = ["Weapon Name:", $("wn").value];
        item.weaponCategory = ["Weapon Category:", $("weapons").value];
        item.deadly = ["Deadly:", deadlyValue];
        item.favorite = ["Favorite:", favoriteValue];
        item.difficulty = ["Difficulty:", $("weapon").value];
        item.otherDetails = ["Other Details:", $("comments").value];
        localStorage.setItem(id, JSON.stringify(item));
        alert("Weapon Registered!");
    }

    function autoFillData(){
        for(var n in json){
            var id = Math.floor(Math.random()*100000001);
            localStorage.setItem(id, JSON.stringify(json[n]));
        }
    }

    function getData(){
        toggleControls("on");
        if(localStorage.length === 0){
            var ask = confirm("There are no registered weapons. Would you like to auto-fill the Database?");
            if(ask){
                autoFillData();
            } else {
                window.location.reload();
            }
        }
        var makeDiv = document.createElement("div");
        makeDiv.setAttribute("id", "items");
        var makeList = document.createElement("ul");
        makeDiv.appendChild(makeList);
        document.body.appendChild(makeDiv);
        $("items").style.display = "block";
        for(var i = 0, len=localStorage.length; i < len; i++){
            var makeli = document.createElement("li");
            var linksLi = document.createElement("li");
            makeList.appendChild(makeli);
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            var obj = JSON.parse(value);
            var makeSubList = document.createElement("ul");
            makeli.appendChild(makeSubList);
            getImage(obj.weaponCategory[1], makeSubList);
            for(var n in obj){
                var makeSubli = document.createElement("li");
                makeSubList.appendChild(makeSubli);
                var optSubText = obj[n][0] + " " + obj[n][1];
                makeSubli.innerHTML = optSubText;
                makeSubList.appendChild(linksLi);
            }
            makeItemLinks(localStorage.key(i), linksLi)
        }
    }

    function getImage(catName, makeSubList){
        var imageLi = document.createElement("li");
        makeSubList.appendChild(imageLi);
        var newImage = document.createElement("img");
        var setSrc = newImage.setAttribute("src", "images/" + catName + ".svg");
        imageLi.appendChild(newImage);

    }

    function makeItemLinks(key, linksLi){
        var editLink = document.createElement("a");
        editLink.href = "#";
        editLink.key = key;
        var editText = "Edit Weapon";
        editLink.addEventListener("click", editItem);
        editLink.innerHTML = editText;
        linksLi.appendChild(editLink);

        var breakTag = document.createElement('br');
        linksLi.appendChild(breakTag);

        var deleteLink = document.createElement("a");
        deleteLink.href = "#";
        deleteLink.key = key;
        var deleteText = "Delete Weapon";
        deleteLink.addEventListener("click", deleteItem);
        deleteLink.innerHTML = deleteText;
        linksLi.appendChild(deleteLink);
    }

    function editItem(){
        var value = localStorage.getItem(this.key);
        var item = JSON.parse(value);

        toggleControls("off");

        $("wn").value = item.weaponName[1];
        $("weapons").value = item.weaponCategory[1];
        var radios = document.forms[0].deadly;
        for(var i = 0; i < radios.length; i++){
            if(radios[i].value == "Yes" && item.deadly[1] == "Yes"){
                radios[i].setAttribute("checked", "checked");
            } else if(radios[i].value == "No" && item.deadly[1] == "No"){
                radios[i].setAttribute("checked", "checked");
            } else if(radios[i].value == "Unknown" && item.deadly[1] == "Unknown"){
                radios[i].setAttribute("checked", "checked");
            }
        }
        if(item.favorite[1] == "Yes"){
            $('fav').setAttribute("checked", "checked");
        }
        $("weapon").value = item.difficulty[1];
        $("comments").value = item.otherDetails[1];

        saveData.removeEventListener("click", storeData);

        $("saveData").value = "Edit Weapon";
        var editSubmit = $("saveData");

        editSubmit.addEventListener("click", validate);
        editSubmit.key = this.key;
    }

    function deleteItem(){
        var ask = confirm("Are you sure you want to delete this weapon?");
        if(ask){
            localStorage.removeItem(this.key);
            alert("Weapon removed from the Armory.");
            window.location.reload();
        } else {
            alert("Weapon was not removed from the Armory.");
        }
    }

    function eraseData(){
        if(localStorage.length === 0){
            alert("There are no registered weapons at the moment.");
        } else {
            var ask = confirm("Are you sure you want to delete the entire Armory Database?")
            if(ask){
                localStorage.clear();
                alert("The Armory Database has been erased.");
                window.location.reload();
                return false;
            } else {
                alert("The Armory Database was not deleted.");
                window.location.reload();
            }
        }
    }

    var weaponType = ["--Weapon Category--", "Handgun", "SMG", "Shotgun", "Rifle", "Bow", "Sword", "Axe", "Dagger", "Mace", "Explosive", "Poison", "Other"],
        deadlyValue,
        favoriteValue = "No",
        //usesValue,
        errMsg = $("errors");

    makeSelect();

    var saveData = $("saveData");
    saveData.addEventListener("click", validate);
    var displayData = $("displayData");
    displayData.addEventListener("click", getData);
    var clearData = $("clearData");
    clearData.addEventListener("click", eraseData);
});