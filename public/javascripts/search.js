
const membersShow = document.getElementById("membersShow");
let seeMembersFlag = false;

const hideElements = () => {
    seeMembers = !seeMembers;
    if (seeMembers) {
        membersShow.style = "display: block";
    } else {
        membersShow.style = "display: none";
    }
};